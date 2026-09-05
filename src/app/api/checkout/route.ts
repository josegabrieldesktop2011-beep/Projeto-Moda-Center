import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Faça login' }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      couponCode,
      couponDiscount,
      subtotal,
      shippingCost,
      discountTotal,
      total,
      paymentMethod,
      addressId,
      customAddress,
      shippingName,
      installments = 1,
      saveAddress = false,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }
    if (!['CARTAO_CREDITO', 'PIX', 'BOLETO'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 });
    }

    let shippingAddress = customAddress || null;
    if (addressId && !customAddress) {
      const addr = await prisma.address.findUnique({
        where: { id: addressId, userId: session.user.id },
      });
      if (!addr) {
        return NextResponse.json({ error: 'Endereço não encontrado' }, { status: 400 });
      }
      shippingAddress = {
        recipient: addr.recipient,
        street: addr.street,
        number: addr.number,
        complement: addr.complement,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
      };
    }

    if (saveAddress && customAddress) {
      try {
        await prisma.address.create({
          data: {
            userId: session.user.id,
            recipient: customAddress.recipient,
            street: customAddress.street,
            number: customAddress.number,
            complement: customAddress.complement || null,
            neighborhood: customAddress.neighborhood,
            city: customAddress.city,
            state: customAddress.state,
            zipCode: customAddress.zipCode,
            isDefault: (await prisma.address.count({ where: { userId: session.user.id } })) === 0,
          },
        });
      } catch {}
    }

    const variantIds = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { id: true, name: true, price: true, discountPrice: true, images: { take: 1 } } } },
    });

    if (variants.length !== variantIds.length) {
      return NextResponse.json({ error: 'Variante não encontrada' }, { status: 400 });
    }

    for (const v of variants) {
      const qty = items.find((i: any) => i.variantId === v.id)?.quantity || 0;
      if (qty > v.stock) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${v.product.name} ${v.size}/${v.color}` },
          { status: 400 }
        );
      }
    }

    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: 'Cupom inválido' }, { status: 400 });
      }
      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 });
      }
      if (coupon.usesPerClient) {
        const uses = await prisma.couponUsage.count({
          where: { couponId: coupon.id, userId: session.user.id },
        });
        if (uses >= coupon.usesPerClient) {
          return NextResponse.json({ error: 'Limite por cliente atingido' }, { status: 400 });
        }
      }
      couponId = coupon.id;
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          subtotal,
          shippingCost,
          discountTotal,
          total,
          paymentMethod,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDENTE',
          couponId,
          shippingAddress,
          trackingUrl: shippingName,
        },
      });

      for (const v of variants) {
        const it = items.find((i: any) => i.variantId === v.id);
        const finalPrice =
          v.product.discountPrice != null
            ? Number(v.product.discountPrice)
            : Number(v.product.price);
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: v.productId,
            productVariantId: v.id,
            productName: v.product.name,
            variantSize: v.size,
            variantColor: v.color,
            unitPrice: finalPrice,
            quantity: it.quantity,
            subtotal: finalPrice * it.quantity,
          },
        });
        await tx.productVariant.update({
          where: { id: v.id },
          data: { stock: { decrement: it.quantity } },
        });
      }

      if (couponId) {
        await tx.couponUsage.create({
          data: {
            couponId,
            userId: session.user.id,
            orderId: created.id,
          },
        });
      }

      await tx.orderStatusLog.create({
        data: { orderId: created.id, status: 'AGUARDANDO_PAGAMENTO', note: 'Pedido criado' },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'ORDER_CREATE',
          entity: 'Order',
          entityId: created.id,
        },
      });

      return created;
    });

    let paymentIntent = null;
    try {
      const { stripe } = await import('@/lib/stripe');
      if (stripe['_api']?.['_basePath']) {
        const pi = await stripe.paymentIntents.create({
          amount: Math.round(total * 100),
          currency: 'brl',
          metadata: { orderId: order.id, orderNumber: order.orderNumber },
          payment_method_types:
            paymentMethod === 'PIX'
              ? ['pix']
              : paymentMethod === 'BOLETO'
              ? ['customer_balance']
              : ['card'],
        });
        paymentIntent = { id: pi.id, clientSecret: pi.client_secret };
        await prisma.order.update({
          where: { id: order.id },
          data: { stripePaymentId: pi.id },
        });
      } else {
        paymentIntent = { id: `mock_pi_${order.id}`, clientSecret: `mock_secret_${order.id}` };
      }
    } catch (e) {
      console.log('[STRIPE_MOCK] Stripe não configurado, usando mock');
      paymentIntent = { id: `mock_pi_${order.id}`, clientSecret: `mock_secret_${order.id}` };
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total,
      paymentMethod,
      paymentIntent,
      redirectUrl: `/pedido/${order.orderNumber}/sucesso`,
    });
  } catch (e: any) {
    console.error('[CHECKOUT_POST]', e);
    return NextResponse.json({ error: e.message || 'Erro ao finalizar pedido' }, { status: 500 });
  }
}
