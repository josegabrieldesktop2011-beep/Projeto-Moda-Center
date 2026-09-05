import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const categoria = searchParams.get('categoria');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(48, parseInt(searchParams.get('perPage') || '24'));
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const orderBy = searchParams.get('orderBy') || 'relevance';
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');

    const where: any = { isActive: true };

    if (featured === 'true') where.featured = true;
    if (onSale === 'true') where.discountPrice = { not: null };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoria) {
      where.OR = [
        ...(where.OR || []),
        { category: { slug: categoria } },
        { category: { parent: { slug: categoria } } },
      ];
    }
    if (brands.length) where.brand = { in: brands };

    if (sizes.length || colors.length || priceMin || priceMax) {
      where.variants = {
        some: {
          ...(sizes.length ? { size: { in: sizes } } : {}),
          ...(colors.length ? { color: { in: colors } } : {}),
          ...(priceMin || priceMax
            ? {
                product: {
                  OR: [
                    {
                      discountPrice: {
                        gte: priceMin ? parseFloat(priceMin) : undefined,
                        lte: priceMax ? parseFloat(priceMax) : undefined,
                        not: null,
                      },
                    },
                    {
                      AND: {
                        discountPrice: null,
                        price: {
                          gte: priceMin ? parseFloat(priceMin) : undefined,
                          lte: priceMax ? parseFloat(priceMax) : undefined,
                        },
                      },
                    },
                  ],
                },
              }
            : {}),
        },
      };
    }

    let orderByArg: any = { featured: 'desc' as const };
    switch (orderBy) {
      case 'price_asc':
        orderByArg = [{ discountPrice: { sort: 'asc', nulls: 'last' } }, { price: 'asc' }];
        break;
      case 'price_desc':
        orderByArg = [{ discountPrice: { sort: 'desc', nulls: 'first' } }, { price: 'desc' }];
        break;
      case 'newest':
        orderByArg = { createdAt: 'desc' };
        break;
      case 'best_selling':
        orderByArg = {
          orderItems: { _count: 'desc' as const },
        };
        break;
      default:
        orderByArg = [{ featured: 'desc' }, { createdAt: 'desc' }];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, slug: true, name: true } },
          images: { orderBy: { position: 'asc' }, take: 1 },
          variants: { select: { id: true, size: true, color: true, colorHex: true, stock: true, sku: true } },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: orderByArg,
      }),
    ]);

    const formatted = products.map((p: any) => {
      const price = Number(p.discountPrice ?? p.price);
      const avg = p.reviews.length
        ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length
        : 0;
      const colorsMap = new Map();
      p.variants.forEach((v: any) => {
        if (!colorsMap.has(v.color)) colorsMap.set(v.color, v.colorHex);
      });
      const firstAvailable = p.variants.find((v: any) => v.stock > 0) || p.variants[0];
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        finalPrice: price,
        image: p.images[0]?.url || '',
        images: p.images,
        rating: avg,
        reviewsCount: p._count.reviews,
        category: p.category,
        brand: p.brand,
        colors: Array.from(colorsMap.entries()).map(([color, hex]) => ({ color, hex })),
        sizes: Array.from(new Set(p.variants.map((v: any) => v.size))),
        variants: p.variants,
        firstVariant: firstAvailable
          ? {
              variantId: firstAvailable.id,
              size: firstAvailable.size,
              color: firstAvailable.color,
              colorHex: firstAvailable.colorHex,
              stock: firstAvailable.stock,
            }
          : null,
        totalStock: p.variants.reduce((a: number, v: any) => a + v.stock, 0),
      };
    });

    return NextResponse.json({
      products: formatted,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (e) {
    console.error('[PRODUCTS_GET]', e);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
