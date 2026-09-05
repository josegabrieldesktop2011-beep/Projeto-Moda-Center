import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user) return NextResponse.json({ error: 'Faça login' }, { status: 401 });

    const product = await prisma.product.findUnique({ where: { slug: params.slug } });
    if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });

    const { rating, comment } = await _req.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Nota inválida' }, { status: 400 });
    }
    if (comment && comment.length > 500) {
      return NextResponse.json({ error: 'Comentário muito longo' }, { status: 400 });
    }

    const purchased = await prisma.order.count({
      where: {
        userId: s.user.id,
        status: 'ENTREGUE',
        items: { some: { productId: product.id } },
      },
    });

    await prisma.review.upsert({
      where: { userId_productId: { userId: s.user.id, productId: product.id } },
      update: {
        rating,
        comment: comment || null,
        verified: purchased > 0,
      },
      create: {
        userId: s.user.id,
        productId: product.id,
        rating,
        comment: comment || null,
        verified: purchased > 0,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro' }, { status: 500 });
  }
}
