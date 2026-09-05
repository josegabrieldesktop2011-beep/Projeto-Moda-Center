'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Bookmark,
  BookmarkPlus,
  Tag,
  Truck,
  ArrowRight,
  ShoppingCart,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore, CartItem } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const saved = useCartStore((s) => s.savedForLater);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const updateQty = useCartStore((s) => s.updateQuantity);
  const remove = useCartStore((s) => s.removeItem);
  const move = useCartStore((s) => s.moveToSaved);
  const moveBack = useCartStore((s) => s.moveToCart);
  const removeSaved = useCartStore((s) => s.removeSaved);
  const apply = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clear);

  const [cep, setCep] = React.useState('');
  const [cepVal, setCepVal] = React.useState('');
  const [coupon, setCoupon] = React.useState('');
  const [loadingShip, setLoadingShip] = React.useState(false);
  const [loadingCoupon, setLoadingCoupon] = React.useState(false);
  const [shippingOptions, setShippingOptions] = React.useState<
    { name: string; cost: number; days: number; type: string }[]
  >([]);
  const [shippingSelected, setShippingSelected] = React.useState<string | null>(null);
  const { data: session } = useSWR('/api/auth/session', fetcher);

  const selectedShip = shippingOptions.find((o) => o.type === shippingSelected);
  const shippingCost = selectedShip?.cost || 0;
  const total = subtotal - couponDiscount + shippingCost;

  const calcShipping = async () => {
    if (!cep.replace(/\D/g, '').length) return;
    setLoadingShip(true);
    try {
      const r = await fetch(
        `/api/shipping/calculate?cep=${encodeURIComponent(cep.replace(/\D/g, ''))}`
      );
      const d = await r.json();
      if (r.ok && d.options?.length) {
        setShippingOptions(d.options);
        setShippingSelected(d.options[0].type);
        setCepVal(cep);
        toast.success('Opções de frete calculadas!');
      } else {
        toast.error(d.error || 'Erro ao calcular');
      }
    } finally {
      setLoadingShip(false);
    }
  };

  const applyCouponFn = async () => {
    if (!coupon.trim()) return;
    setLoadingCoupon(true);
    try {
      const r = await fetch(
        `/api/coupon/validate?code=${encodeURIComponent(coupon)}&subtotal=${subtotal}`
      );
      const d = await r.json();
      if (r.ok && d.ok) {
        apply(d.code, d.discount);
        toast.success(`Cupom ${d.code} aplicado! -${formatCurrency(d.discount)}`);
        setCoupon('');
      } else {
        toast.error(d.error || 'Cupom inválido');
      }
    } finally {
      setLoadingCoupon(false);
    }
  };

  if (items.length === 0 && saved.length === 0) {
    return (
      <div className="container-pad py-16 sm:py-20 text-center">
        <div className="card max-w-lg mx-auto p-8 sm:p-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto">
            <ShoppingCart size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 text-sm">
              Adicione peças incríveis para começar sua compra.
            </p>
          </div>
          <Link href="/produtos" className="btn-primary w-full">
            <ShoppingBag size={20} />
            Começar a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pad py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag size={26} />
        Meu Carrinho
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="card divide-y divide-gray-100">
            {items.map((it) => (
              <CartRow
                key={it.variantId}
                item={it}
                onQty={(q) => updateQty(it.variantId, q)}
                onRemove={() => {
                  remove(it.variantId);
                  toast.info(`${it.productName} removido`);
                }}
                onSave={() => {
                  move(it.variantId);
                  toast.success('Salvo para depois!');
                }}
              />
            ))}
          </div>

          {saved.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bookmark size={18} className="text-brand-600" />
                  Salvo para depois ({saved.length})
                </h3>
              </div>
              <div className="card divide-y divide-gray-100">
                {saved.map((it) => (
                  <div
                    key={it.variantId}
                    className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={it.productImage}
                        alt={it.productName}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produto/${it.productId}`}
                        className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base hover:text-primary-600"
                      >
                        {it.productName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: it.colorHex || '#CCC' }}
                          title={it.color}
                        />
                        <span className="text-xs text-gray-500">
                          {it.color} · {it.size}
                        </span>
                      </div>
                      <p className="text-lg font-extrabold text-gray-900 mt-2">
                        {formatCurrency(it.unitPrice)}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => moveBack(it.variantId)}
                          className="btn-outline-primary !py-2 !px-3 text-xs min-h-[40px]"
                        >
                          Voltar ao carrinho
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSaved(it.variantId)}
                          className="btn-ghost !py-2 !px-3 text-xs text-gray-500 hover:text-red-500 min-h-[40px]"
                          aria-label="Remover"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/produtos"
            className="btn-outline-primary w-full lg:w-fit"
          >
            ← Continuar comprando
          </Link>
        </div>

        <aside className="lg:sticky lg:top-28 h-fit space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Truck size={20} />
              Calcular frete
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Seu CEP"
                value={cep}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setCep(v.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9));
                }}
                className="input !min-h-[44px]"
              />
              <button
                type="button"
                onClick={calcShipping}
                disabled={loadingShip}
                className="btn-secondary !px-4 !min-h-[48px]"
              >
                {loadingShip ? '...' : 'OK'}
              </button>
            </div>

            {shippingOptions.length > 0 && (
              <div className="space-y-2 pt-2">
                {shippingOptions.map((o) => (
                  <label
                    key={o.type}
                    className={cn(
                      'flex items-center justify-between gap-3 p-3 rounded-xl border-2 cursor-pointer transition min-h-[56px]',
                      shippingSelected === o.type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingSelected === o.type}
                        onChange={() => setShippingSelected(o.type)}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {o.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {o.days === 0
                            ? 'Retire na loja hoje'
                            : `Entrega em até ${o.days} dias úteis`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 shrink-0">
                      {o.cost === 0 ? 'Grátis' : formatCurrency(o.cost)}
                    </p>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Tag size={20} />
              Cupom de desconto
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyCouponFn();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="EX: BEMVINDO10"
                className="input !min-h-[44px] !uppercase"
              />
              <button
                type="submit"
                disabled={loadingCoupon}
                className="btn-secondary !px-4 !min-h-[48px] font-bold"
              >
                {loadingCoupon ? '...' : 'Aplicar'}
              </button>
            </form>
            {couponCode && (
              <div className="flex items-center justify-between bg-green-50 text-green-700 p-3 rounded-xl border border-green-200">
                <div>
                  <p className="text-xs font-semibold">Cupom aplicado</p>
                  <p className="font-extrabold">{couponCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">-{formatCurrency(couponDiscount)}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remover cupom"
                    className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center min-h-[36px] min-w-[36px]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Resumo</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} itens)</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(subtotal)}</dd>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Desconto ({couponCode})</dt>
                  <dd className="font-bold">-{formatCurrency(couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Frete</dt>
                <dd className="font-semibold text-gray-900">
                  {selectedShip
                    ? shippingCost === 0
                      ? 'Grátis'
                      : formatCurrency(shippingCost)
                    : '—'}
                </dd>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                <dt className="text-gray-900 font-bold text-base">Total</dt>
                <dd className="text-gray-900 font-extrabold text-2xl sm:text-3xl">
                  {formatCurrency(total)}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => {
                if (!session?.user) {
                  toast.info('Faça login para continuar');
                  router.push(`/auth/login?callbackUrl=/checkout`);
                  return;
                }
                if (!shippingSelected) {
                  toast.error('Selecione uma opção de frete');
                  return;
                }
                router.push('/checkout');
              }}
              className="btn-primary w-full text-base min-h-[56px]"
            >
              Finalizar compra <ArrowRight size={20} />
            </button>
            <p className="text-xs text-center text-gray-500">
              🔒 Compra 100% segura e protegida
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CartRow({
  item,
  onQty,
  onRemove,
  onSave,
}: {
  item: CartItem;
  onQty: (n: number) => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  return (
    <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        <Link href={`/produto/${item.productId}`}>
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            sizes="120px"
            className="object-cover"
          />
        </Link>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produto/${item.productId}`}
            className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base hover:text-primary-600"
          >
            {item.productName}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover item"
            className="w-9 h-9 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center shrink-0 min-h-[40px] min-w-[40px]"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
            style={{ backgroundColor: item.colorHex || '#CCC' }}
            title={item.color}
          />
          <span className="text-xs text-gray-500">
            {item.color} · Tamanho {item.size}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              aria-label="Diminuir"
              onClick={() => onQty(item.quantity - 1)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 min-h-[44px] min-w-[44px]"
            >
              <Minus size={16} />
            </button>
            <span className="w-9 text-center font-bold text-gray-900 text-sm">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Aumentar"
              onClick={() => onQty(item.quantity + 1)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 min-h-[44px] min-w-[44px]"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400 line-through leading-none">
              {item.quantity > 1 ? formatCurrency(item.unitPrice * item.quantity + 9999) : ''}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 min-h-[36px]"
        >
          <BookmarkPlus size={14} />
          Salvar para depois
        </button>
      </div>
    </div>
  );
}
