import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    const subtotalStr = searchParams.get('subtotal');
    if (!code) return NextResponse.json({ error: 'Cupom obrigatório' }, { status: 400 });
    const subtotal = subtotalStr ? parseFloat(subtotalStr) : 0;

    const session = await getServerSession(authOptions);
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Cupom inválido' }, { status: 404 });
    }

    if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
      return NextResponse.json({ error: 'Cupom ainda não liberado' }, { status: 400 });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 });
    }
    if (subtotal < Number(coupon.minOrderValue)) {
      return NextResponse.json(
        { error: `Valor mínimo: R$ ${Number(coupon.minOrderValue).toFixed(2)}` },
        { status: 400 }
      );
    }
    if (coupon.maxUses) {
      const uses = await prisma.couponUsage.count({ where: { couponId: coupon.id } });
      if (uses >= coupon.maxUses) {
        return NextResponse.json({ error: 'Cupom esgotado' }, { status: 400 });
      }
    }
    if (session?.user && coupon.usesPerClient) {
      const uses = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: session.user.id },
      });
      if (uses >= coupon.usesPerClient) {
        return NextResponse.json(
          { error: 'Limite de uso por cliente atingido' },
          { status: 400 }
        );
      }
    }

    let discount = 0;
    if (coupon.discountType === 'percentual') {
      discount = (subtotal * Number(coupon.discountValue)) / 100;
    } else {
      discount = Number(coupon.discountValue);
    }
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      ok: true,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discount: Number(discount.toFixed(2)),
    });
  } catch (e) {
    console.error('[COUPON_GET]', e);
    return NextResponse.json({ error: 'Erro ao validar cupom' }, { status: 500 });
  }
}
