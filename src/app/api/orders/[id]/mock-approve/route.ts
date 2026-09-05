import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'Faça login' }, { status: 401 });
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order || order.userId !== s.user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAGO',
          paymentStatus: 'APROVADO',
        },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId: order.id,
          status: 'PAGO',
          note: 'Pagamento aprovado (simulação dev/test)',
        },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro' }, { status: 500 });
  }
}
