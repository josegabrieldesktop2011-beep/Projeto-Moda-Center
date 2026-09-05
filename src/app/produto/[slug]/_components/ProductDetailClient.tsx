'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  Check,
  Ruler,
  Send,
  ZoomIn,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store';
import { cn, formatCurrency, formatDateOnly, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';
import { StarsRating } from '@/components/ui/StarsRating';
import { useSession } from 'next-auth/react';

const fetcher = (u: string) => fetch(u).then((r) => {
  if (!r.ok) throw new Error('not found');
  return r.json();
});

const tabelaMedidas = [
  { tam: 'PP', busto: 84, cintura: 64, quadril: 90 },
  { tam: 'P', busto: 88, cintura: 68, quadril: 94 },
  { tam: 'M', busto: 92, cintura: 72, quadril: 98 },
  { tam: 'G', busto: 98, cintura: 78, quadril: 104 },
  { tam: 'GG', busto: 104, cintura: 84, quadril: 110 },
  { tam: 'XG', busto: 112, cintura: 92, quadril: 118 },
];

export function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(`/api/products/${slug}`, fetcher);
  const addItem = useCartStore((s) => s.addItem);

  const [activeImg, setActiveImg] = React.useState(0);
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [color, setColor] = React.useState<string | null>(null);
  const [size, setSize] = React.useState<string | null>(null);
  const [qty, setQty] = React.useState(1);
  const [tableOpen, setTableOpen] = React.useState(false);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(false);
  const [tab, setTab] = React.useState<'desc' | 'specs' | 'reviews'>('desc');

  const product = data?.product;
  const related = data?.related || [];

  React.useEffect(() => {
    if (product?.variantsMatrix && !color) {
      const first = product.colors?.[0];
      if (first) setColor(first.color);
    }
  }, [product?.colors]);

  React.useEffect(() => {
    if (product?.variantsMatrix && color && !size) {
      const sizes = Object.keys(product.variantsMatrix)
        .filter((s) => product.variantsMatrix[s][color])
        .filter((s) => product.variantsMatrix[s][color].stock > 0);
      setSize(sizes[0] || Object.keys(product.variantsMatrix)[0] || null);
    }
  }, [color, product?.variantsMatrix]);

  const currentVariant =
    size && color && product?.variantsMatrix?.[size]?.[color];

  const finalPrice = product?.discountPrice ?? product?.price;
  const inStock = currentVariant && currentVariant.stock > 0;

  const submitReview = async () => {
    if (!session) {
      toast.error('Faça login para avaliar');
      router.push(`/auth/login?callbackUrl=/produto/${slug}`);
      return;
    }
    if (reviewRating < 1) {
      toast.error('Selecione uma nota');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success('Avaliação enviada!');
        setReviewText('');
        setReviewRating(5);
        window.location.reload();
      } else {
        toast.error(d.error || 'Erro');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-pad py-6 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-pad py-16 text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Produto não encontrado</h2>
        <p className="text-gray-500">Esse produto pode ter sido removido ou não existe.</p>
        <Link href="/produtos" className="btn-primary">
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  const sizesAvailable = Object.keys(product.variantsMatrix || {}).filter(
    (s) => !color || (product.variantsMatrix[s][color] && product.variantsMatrix[s][color].stock > 0)
  );

  return (
    <div className="pb-16">
      <div className="container-pad py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-gray-700 whitespace-nowrap">Início</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/produtos?categoria=${product.category.slug}`} className="hover:text-gray-700 capitalize whitespace-nowrap">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-semibold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="container-pad grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 group">
            {product.images?.[activeImg] && (
              <Image
                src={product.images[activeImg].url}
                alt={product.images[activeImg].alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label="Zoom"
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center min-h-[48px] min-w-[48px]"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveImg((i) =>
                  i - 1 < 0 ? product.images.length - 1 : i - 1
                )
              }
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hidden sm:flex min-h-[48px] min-w-[48px]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImg((i) => (i + 1) % product.images.length)}
              aria-label="Próxima"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hidden sm:flex min-h-[48px] min-w-[48px]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {product.images?.map((img: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border-2 transition',
                  activeImg === i
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            {product.category && (
              <span className="chip bg-primary-50 text-primary-700 mb-2">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <StarsRating rating={product.rating} size={18} readOnly />
                <span className="text-sm font-semibold text-gray-700">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews?.length || 0} avaliações)
              </span>
              <span className="chip bg-green-50 text-green-700 flex items-center gap-1">
                <Package size={12} />
                {inStock ? 'Em estoque' : 'Sem estoque'}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            {product.discountPrice && (
              <p className="text-base text-gray-400 line-through font-semibold">
                {formatCurrency(product.price)}
              </p>
            )}
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {formatCurrency(finalPrice)}
            </p>
            {product.discountPrice && (
              <span className="chip bg-primary-500 text-white">
                Economize {formatCurrency(Number(product.price) - Number(product.discountPrice))}
              </span>
            )}
            <p className="text-xs text-gray-500 w-full">
              ou até 12x sem juros de{' '}
              {formatCurrency(Number(finalPrice) / 12)} no cartão
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label !mb-0">Cor: <strong>{color || '—'}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors?.map((c: any) => {
                  const hasSize = product.sizes?.some(
                    (s: string) =>
                      product.variantsMatrix[s]?.[c.color]?.stock > 0
                  );
                  return (
                    <button
                      key={c.color}
                      type="button"
                      disabled={!hasSize}
                      onClick={() => setColor(c.color)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition min-h-[44px]',
                        color === c.color
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-sm font-semibold text-gray-800">{c.color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label !mb-0">Tamanho</span>
                <button
                  type="button"
                  onClick={() => setTableOpen((v) => !v)}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 min-h-[36px]"
                >
                  <Ruler size={14} />
                  Tabela de medidas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((s: string) => {
                  const variant = color
                    ? product.variantsMatrix[s]?.[color]
                    : product.sizes?.includes(s);
                  const available = variant
                    ? typeof variant === 'object'
                      ? variant.stock > 0
                      : variant
                    : false;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={color && !available}
                      onClick={() => setSize(s)}
                      className={cn(
                        'w-12 h-12 rounded-xl text-sm font-bold border-2 transition',
                        size === s
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200'
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {tableOpen && (
              <div className="card overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="p-3 text-left font-semibold">Tamanho</th>
                        <th className="p-3 text-center font-semibold">Busto (cm)</th>
                        <th className="p-3 text-center font-semibold">Cintura (cm)</th>
                        <th className="p-3 text-center font-semibold">Quadril (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabelaMedidas.map((r) => (
                        <tr key={r.tam} className="border-t border-gray-100">
                          <td className="p-3 font-bold text-primary-600">{r.tam}</td>
                          <td className="p-3 text-center text-gray-700">{r.busto}</td>
                          <td className="p-3 text-center text-gray-700">{r.cintura}</td>
                          <td className="p-3 text-center text-gray-700">{r.quadril}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <span className="label">Quantidade</span>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    aria-label="Diminuir"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 min-h-[48px] min-w-[48px]"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                  <button
                    type="button"
                    aria-label="Aumentar"
                    onClick={() =>
                      setQty((q) =>
                        Math.min(currentVariant?.stock || 10, q + 1)
                      )
                    }
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 min-h-[48px] min-w-[48px]"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {currentVariant ? `${currentVariant.stock} unidades disponíveis` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              disabled={!inStock || !currentVariant}
              onClick={() => {
                if (!currentVariant) return;
                addItem({
                  variantId: currentVariant.id,
                  productId: product.id,
                  productName: product.name,
                  productImage: product.images?.[0]?.url || '',
                  size,
                  color,
                  colorHex: product.colors?.find((c: any) => c.color === color)?.hex,
                  unitPrice: Number(finalPrice),
                  quantity: qty,
                  maxStock: currentVariant.stock,
                });
                toast.success('Produto adicionado ao carrinho!');
              }}
              className="btn-primary flex-1 text-base min-h-[56px]"
            >
              <ShoppingBag size={20} />
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              onClick={() => {
                setWishlisted((v) => !v);
                toast.success(wishlisted ? 'Removido dos desejos' : 'Adicionado à lista de desejos!');
              }}
              className={cn(
                'btn-secondary !py-3.5 sm:w-auto min-w-[56px] min-h-[56px]',
                wishlisted && '!border-primary-500 !text-primary-600 !bg-primary-50'
              )}
              aria-label="Lista de desejos"
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              <span className="sm:inline hidden">Favoritos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: Truck, title: 'Entrega rápida', desc: 'Envio para todo Brasil' },
              { icon: ShieldCheck, title: 'Compra segura', desc: 'Dados protegidos' },
              { icon: RotateCcw, title: 'Troca fácil', desc: '30 dias para trocar' },
            ].map((i, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <i.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{i.title}</p>
                  <p className="text-xs text-gray-500">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-pad mt-10 sm:mt-14">
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          {[
            { id: 'desc', label: 'Descrição' },
            { id: 'specs', label: 'Especificações' },
            { id: 'reviews', label: `Avaliações (${product.reviews?.length || 0})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={cn(
                'px-5 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition min-h-[48px]',
                tab === t.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6 sm:py-8">
          {tab === 'desc' && (
            <div className="max-w-3xl prose prose-gray max-w-none">
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
          {tab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              {[
                { label: 'Composição', value: product.composition },
                { label: 'Marca', value: product.brand || 'Moda Center' },
                { label: 'Cuidados', value: product.care || 'Lavar à mão, não usar alvejante' },
                { label: 'Origem', value: 'Brasil' },
                { label: 'Garantia', value: '3 meses contra defeitos de fabricação' },
                { label: 'SKU', value: currentVariant?.sku || product.variants?.[0]?.sku || '-' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between p-4 border border-gray-100 rounded-xl">
                  <span className="text-sm font-semibold text-gray-600">{s.label}</span>
                  <span className="text-sm text-gray-900 font-medium text-right max-w-[60%]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="card p-5 sm:p-6">
                <h4 className="font-bold text-gray-900 mb-4">Escreva sua avaliação</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <StarsRating rating={reviewRating} onChange={setReviewRating} size={28} />
                    <span className="text-sm text-gray-500">Selecione uma nota</span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                    placeholder="Conte sua experiência com este produto..."
                    rows={4}
                    className="input resize-none !h-auto"
                  />
                  <div className="flex justify-between items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500">
                      {reviewText.length}/500 caracteres
                    </span>
                    <button
                      type="button"
                      onClick={submitReview}
                      disabled={submitting || !reviewRating}
                      className="btn-primary !py-2.5 !px-5"
                    >
                      <Send size={16} />
                      {submitting ? 'Enviando...' : 'Enviar avaliação'}
                    </button>
                  </div>
                </div>
              </div>

              {product.reviews?.length === 0 && (
                <div className="card p-10 text-center">
                  <Star size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nenhuma avaliação ainda. Seja o primeiro!</p>
                </div>
              )}

              {product.reviews?.map((r: any) => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-brand-500 text-white font-bold flex items-center justify-center shrink-0">
                      {r.user?.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{r.user?.name || 'Cliente'}</p>
                          <span className="text-xs text-gray-500">{formatDateOnly(r.createdAt)}</span>
                        </div>
                        <StarsRating rating={r.rating} size={16} readOnly />
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {r.comment}
                        </p>
                      )}
                      {r.verified && (
                        <span className="chip bg-green-50 text-green-700 mt-2">
                          <Check size={12} />
                          Compra verificada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-pad mt-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {related.slice(0, 8).map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {zoomOpen && product.images?.[activeImg] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomOpen(false);
            }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center min-h-[48px] min-w-[48px]"
            aria-label="Fechar"
          >
            ✕
          </button>
          <div className="relative w-full max-w-5xl aspect-square">
            <Image
              src={product.images[activeImg].url}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
