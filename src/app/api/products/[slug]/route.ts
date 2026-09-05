import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        category: { select: { id: true, slug: true, name: true } },
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: [{ color: 'asc' }, { size: 'asc' }] },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    const avg = product.reviews.length
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

    const sizeColorMatrix: Record<string, Record<string, any>> = {};
    const sizes = new Set<string>();
    const colorsMap = new Map<string, string>();
    product.variants.forEach((v) => {
      sizes.add(v.size);
      if (!colorsMap.has(v.color)) colorsMap.set(v.color, v.colorHex || '#CCC');
      if (!sizeColorMatrix[v.size]) sizeColorMatrix[v.size] = {};
      sizeColorMatrix[v.size][v.color] = v;
    });

    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        NOT: { id: product.id },
        OR: [
          product.categoryId ? { categoryId: product.categoryId } : {},
          { brand: product.brand ?? undefined },
        ],
      },
      take: 8,
      include: {
        images: { take: 1 },
        variants: { where: { stock: { gt: 0 } }, take: 1 },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true }, take: 100 },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    const formattedRelated = related.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      image: p.images[0]?.url || '',
      rating: p.reviews.length
        ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length
        : 0,
      reviewsCount: p._count.reviews,
      firstVariant: p.variants[0]
        ? {
            variantId: p.variants[0].id,
            size: p.variants[0].size,
            color: p.variants[0].color,
            colorHex: p.variants[0].colorHex,
            stock: p.variants[0].stock,
          }
        : null,
    }));

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        rating: avg,
        sizes: Array.from(sizes),
        colors: Array.from(colorsMap.entries()).map(([color, hex]) => ({ color, hex })),
        variantsMatrix: sizeColorMatrix,
      },
      related: formattedRelated,
    });
  } catch (e) {
    console.error('[PRODUCT_SLUG_GET]', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
