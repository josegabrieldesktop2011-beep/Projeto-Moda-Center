import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  let event;
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  try {
    if (webhookSecret && sig) {
      const { stripe } = await import('@/lib/stripe');
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
      console.log('[STRIPE_WEBHOOK_MOCK]', event.type);
    }
  } catch (e) {
    console.error('[WEBHOOK_SIG]', e);
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const intent = event.data?.object;

  if (event.type === 'payment_intent.succeeded') {
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'APROVADO',
            status: 'PAGO',
          },
        });
        await tx.orderStatusLog.create({
          data: { orderId: order.id, status: 'PAGO', note: 'Pagamento aprovado via Stripe' },
        });
        if (order.couponId) {
          // já registrado em checkout
        }
      });
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'RECUSADO' },
      });
    }
  } else if (event.type === 'charge.refunded') {
    const pi = intent.payment_intent;
    if (pi) {
      const order = await prisma.order.findFirst({ where: { stripePaymentId: pi } });
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'ESTORNADO' },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
