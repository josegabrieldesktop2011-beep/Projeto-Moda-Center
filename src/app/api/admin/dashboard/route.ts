import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function staff(req: any) {
  const s = await getServerSession(authOptions);
  if (!s?.user || (s.user.role !== 'ADMIN' && s.user.role !== 'VENDEDOR')) {
    return NextResponse.json({ error: 'não autorizado' }, { status: 403 });
  }
  return null;
}

export async function GET(req: Request) {
  const err = await staff(null);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const periodo = parseInt(searchParams.get('periodo') || '30');
  const start = new Date(Date.now() - periodo * 24 * 60 * 60 * 1000);

  const [pagos, total, pendentes, clientes, items] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: start }, paymentStatus: 'APROVADO' },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.count({
      where: {
        status: { in: ['AGUARDANDO_PAGAMENTO', 'PAGO', 'PROCESSANDO'] },
      },
    }),
    prisma.user.count({ where: { role: 'CLIENTE' } }),
    prisma.orderItem.findMany({ take: 200, select: { unitPrice: true, quantity: true } }),
  ]);

  const faturamento = Number(pagos._sum.total || 0);
  const soma = items.reduce((acc, i) => acc + Number(i.unitPrice) * i.quantity, 0);
  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const ticketMedio = total > 0 ? faturamento / total : 0;

  return NextResponse.json({
    faturamento,
    pedidosTotal: total,
    pendentes,
    clientes,
    ticketMedio,
  });
}
