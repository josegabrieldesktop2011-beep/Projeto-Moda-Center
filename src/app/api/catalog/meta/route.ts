import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, isValidEmail, isValidCpf } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { parentId: null },
        include: {
          _count: { select: { products: true } },
          children: {
            include: { _count: { select: { products: true } } },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        distinct: ['brand'],
        select: { brand: true },
      }),
    ]);
    const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'UN', '36', '38', '40', '42', '44', '46'];
    const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[];
    return NextResponse.json({
      categories: categories.map((c) => ({
        ...c,
        children: c.children || [],
      })),
      sizes,
      brands,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
