'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/products/ProductCard';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

// Mocked data for client-side rendering
const mockProducts = [
  {
    id: 'wl-1',
    slug: 'camiseta-basica-feminina',
    name: 'Camiseta Básica Feminina',
    price: 49.9,
    discountPrice: null,
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=camiseta%20branca%20feminina%20fundo%20branco&image_size=square_hd',
    rating: 4.5,
    reviewsCount: 128,
    colors: [
      { color: 'Branco', hex: '#FFFFFF' },
      { color: 'Preto', hex: '#000000' },
    ],
    firstVariant: {
      variantId: 'v1',
      size: 'M',
      color: 'Branco',
      colorHex: '#FFFFFF',
      stock: 30,
    },
  },
  {
    id: 'wl-2',
    slug: 'vestido-floral-midi',
    name: 'Vestido Floral Midi',
    price: 159.9,
    discountPrice: 129.9,
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vestido%20floral%20midi%20rosa%20fundo%20branco&image_size=square_hd',
    rating: 4.8,
    reviewsCount: 54,
    colors: [{ color: 'Rosa', hex: '#FDA4AF' }],
    firstVariant: {
      variantId: 'v2',
      size: 'P',
      color: 'Rosa',
      colorHex: '#FDA4AF',
      stock: 15,
    },
  },
];

export default function ListaDesejosPage() {
  const [items, setItems] = React.useState<any[]>(mockProducts);
  const total = items.reduce(
    (acc, it) => acc + (it.discountPrice || it.price),
    0
  );
  const economia = items.reduce((acc, it) => {
    if (it.discountPrice) return acc + (it.price - it.discountPrice);
    return acc;
  }, 0);

  return (
    <div className="container-pad py-6 sm:py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Heart size={26} fill="currentColor" className="text-primary-500" />
            Minha lista de desejos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} produto{items.length === 1 ? '' : 's'} salvo
            {items.length === 1 ? '' : 's'} · Total de{' '}
            <strong className="text-gray-900">{formatCurrency(total)}</strong>
            {economia > 0 && (
              <span className="ml-2 text-green-600 font-semibold">
                Economize {formatCurrency(economia)} se comprar tudo!
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => toast.success('Link compartilhado copiado!')}
              className="btn-secondary !py-2.5 !px-4 text-sm min-h-[44px]"
            >
              <Share2 size={16} />
              Compartilhar
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-10 sm:p-14 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto">
            <Heart size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1.5">
              Sua lista está vazia 🥺
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Salve seus produtos preferidos aqui para lembrar depois ou compartilhar com quem gosta!
            </p>
          </div>
          <Link href="/produtos" className="btn-primary inline-flex !py-3 !px-6">
            <ShoppingBag size={18} />
            Descobrir produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {items.map((p) => (
              <div key={p.id} className="relative group">
                <ProductCard {...p} />
                <button
                  type="button"
                  aria-label="Remover da lista"
                  onClick={() => {
                    setItems(items.filter((i) => i.id !== p.id));
                    toast.success('Removido da lista!');
                  }}
                  className="absolute top-14 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-50 min-h-[40px] min-w-[40px]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 card p-5 sm:p-6 max-w-lg mx-auto text-center space-y-4">
            <p className="text-sm text-gray-600">
              Gostou de tudo? Que tal levar todos os seus favoritos agora?
            </p>
            <div className="space-y-1 text-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({items.length})</span>
                <span className="font-semibold">{formatCurrency(total + economia)}</span>
              </div>
              {economia > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descontos</span>
                  <span className="font-bold">-{formatCurrency(economia)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-end">
                <span className="font-bold text-base">Total</span>
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.success('Todos adicionados ao carrinho!')}
              className="btn-primary w-full !py-3 text-base"
            >
              <ShoppingBag size={18} />
              Adicionar tudo ao carrinho
            </button>
          </div>
        </>
      )}
    </div>
  );
}
