import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'unauth' }, { status: 401 });

    const order = await prisma.order.findFirst({
      where: { orderNumber: params.orderNumber },
      include: {
        items: { orderBy: { productName: 'asc' } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
        reviews: true,
      },
    });

    if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
    if (order.userId !== s.user.id && s.user.role === 'CLIENTE') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    return NextResponse.json({ order, items: order.items, statusHistory: order.statusHistory });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro' }, { status: 500 });
  }
}
