import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user) return NextResponse.json([]);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 10;
  const where = s.user.role === 'CLIENTE' ? { userId: s.user.id } : {};

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { items: true } },
        items: { take: 1, include: { variant: { select: { id: true } } } },
      },
      take: perPage,
      skip: (page - 1) * perPage,
    }),
  ]);

  return NextResponse.json({
    orders,
    totalPages: Math.ceil(total / perPage),
    total,
  });
}
