import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from './_components/ProductDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const p = await prisma.product.findUnique({ where: { slug: params.slug } });
    if (!p) return { title: 'Produto não encontrado' };
    return {
      title: p.name,
      description: p.description.substring(0, 160),
      openGraph: {
        title: p.name,
        description: p.description.substring(0, 160),
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />;
}
