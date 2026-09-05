'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  rating?: number;
  reviewsCount?: number;
  colors?: { color: string; hex: string }[];
  firstVariant?: { variantId: string; size: string; color: string; colorHex?: string; stock: number };
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  discountPrice,
  image,
  rating = 0,
  reviewsCount = 0,
  colors = [],
  firstVariant,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const hasDiscount = discountPrice && discountPrice < price;
  const discount = hasDiscount
    ? Math.round(((price - (discountPrice as number)) / price) * 100)
    : 0;
  const showPrice = hasDiscount ? (discountPrice as number) : price;

  return (
    <div className="card group overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <Link
        href={`/produto/${slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            -{discount}%
          </span>
        )}
        <button
          type="button"
          aria-label="Adicionar à lista de desejos"
          onClick={(e) => {
            e.preventDefault();
            toast.success('Adicionado à lista de desejos!');
          }}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur hover:bg-white flex items-center justify-center shadow-sm transition min-h-[40px] min-w-[40px]"
        >
          <Heart size={18} className="text-gray-600" />
        </button>
      </Link>
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        <Link href={`/produto/${slug}`} className="block">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2.75rem] group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>

        {(rating > 0 || reviewsCount > 0) && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={12}
                  fill={n <= Math.round(rating) ? '#eab308' : 'transparent'}
                  className={n <= Math.round(rating) ? 'text-gold-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewsCount})</span>
          </div>
        )}

        {colors.length > 0 && (
          <div className="flex gap-1.5">
            {colors.slice(0, 5).map((c) => (
              <span
                key={c.color}
                title={c.color}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(price)}
              </p>
            )}
            <p className="text-base font-extrabold text-gray-900">
              {formatCurrency(showPrice)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Adicionar ao carrinho"
            disabled={!firstVariant || firstVariant.stock <= 0}
            onClick={() => {
              if (!firstVariant) return;
              addItem({
                variantId: firstVariant.variantId,
                productId: id,
                productName: name,
                productImage: image,
                size: firstVariant.size,
                color: firstVariant.color,
                colorHex: firstVariant.colorHex,
                unitPrice: showPrice,
                quantity: 1,
                maxStock: firstVariant.stock,
              });
              toast.success(`${name} adicionado ao carrinho!`, {
                description: `${firstVariant.size} · ${firstVariant.color}`,
              });
            }}
            className={cn(
              'w-11 h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-sm transition shrink-0 disabled:bg-gray-300 min-h-[44px] min-w-[44px]'
            )}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
