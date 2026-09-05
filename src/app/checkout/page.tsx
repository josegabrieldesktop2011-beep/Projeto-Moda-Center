'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Shield,
  Truck,
  Plus,
  Trash2,
  Edit3,
  X,
  Home,
  Pix,
  Barcode,
  FileCheck,
  Loader2,
  ChevronLeft,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store';
import { cn, formatCurrency, maskCep, maskCardNumber, maskPhone, maskCpf } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

const steps = [
  { n: 1, label: 'Endereço e frete', icon: MapPin },
  { n: 2, label: 'Pagamento', icon: CreditCard },
  { n: 3, label: 'Confirmar', icon: CheckCircle2 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = React.useState(1);
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clear);
  const totalItems = useCartStore((s) => s.getTotalItems());

  const [addressId, setAddressId] = React.useState<string | null>(null);
  const [useNew, setUseNew] = React.useState(false);
  const [saveAddr, setSaveAddr] = React.useState(true);
  const [ship, setShip] = React.useState<any>(null);
  const [shippingOptions, setShippingOptions] = React.useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState<'CARTAO_CREDITO' | 'PIX' | 'BOLETO'>('CARTAO_CREDITO');
  const [installments, setInstallments] = React.useState(1);
  const [showForm, setShowForm] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const { data: addresses, mutate: mutateAddr } = useSWR(
    status === 'authenticated' ? '/api/user/addresses' : null,
    fetcher
  );
  const { data: prefs } = useSWR(
    status === 'authenticated' ? '/api/user/profile' : null,
    fetcher
  );

  const [formAddr, setFormAddr] = React.useState<any>({
    recipient: prefs?.name || '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [cardForm, setCardForm] = React.useState<any>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    installments: 1,
    save: false,
  });

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/checkout');
    }
    if (items.length === 0 && status === 'authenticated') {
      toast.warning('Seu carrinho está vazio');
      router.replace('/carrinho');
    }
  }, [status, items.length, router]);

  React.useEffect(() => {
    if (addresses?.length > 0 && !addressId && !useNew) {
      const def = addresses.find((a: any) => a.isDefault) || addresses[0];
      setAddressId(def.id);
      setShip(def);
    }
  }, [addresses, addressId, useNew]);

  const currentAddress = useNew
    ? formAddr
    : addresses?.find((a: any) => a.id === addressId) || null;

  React.useEffect(() => {
    (async () => {
      if (!currentAddress?.zipCode) {
        setShippingOptions([]);
        return;
      }
      try {
        const r = await fetch(
          `/api/shipping/calculate?cep=${currentAddress.zipCode.replace(/\D/g, '')}`
        );
        const d = await r.json();
        if (d.options?.length) {
          setShippingOptions(d.options);
          setShip((s: any) => (s && d.options.find((o: any) => o.type === s.type) ? s : d.options[0]));
        }
      } catch {}
    })();
  }, [currentAddress?.zipCode]);

  const shippingCost = ship?.cost || 0;
  const total = subtotal - couponDiscount + shippingCost;

  const buscaCep = async () => {
    const clean = formAddr.zipCode.replace(/\D/g, '');
    if (clean.length !== 8) return;
    const r = await fetch(`/api/cep/${clean}`);
    const d = await r.json();
    if (d && !d.error) {
      setFormAddr((f: any) => ({
        ...f,
        street: d.street || '',
        neighborhood: d.neighborhood || '',
        city: d.city || '',
        state: d.state || '',
      }));
    }
  };

  const validaStep1 = () => {
    if (useNew) {
      if (
        !formAddr.zipCode?.replace(/\D/g, '').length ||
        !formAddr.street ||
        !formAddr.number ||
        !formAddr.neighborhood ||
        !formAddr.city ||
        !formAddr.state ||
        !formAddr.recipient
      ) {
        toast.error('Preencha todos os campos de endereço');
        return false;
      }
    } else if (!addressId) {
      toast.error('Selecione um endereço');
      return false;
    }
    if (!ship) {
      toast.error('Selecione uma opção de frete');
      return false;
    }
    return true;
  };

  const saveAddress = async () => {
    if (useNew && saveAddr && formAddr.street) {
      try {
        await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formAddr, isDefault: addresses?.length === 0 }),
        });
        mutateAddr();
      } catch {}
    }
  };

  const submitOrder = async () => {
    setProcessing(true);
    try {
      const customAddress = useNew ? formAddr : null;
      const bodyAddr = useNew ? null : addressId;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          couponCode,
          couponDiscount,
          subtotal,
          shippingCost,
          discountTotal: couponDiscount,
          total,
          paymentMethod,
          addressId: bodyAddr,
          customAddress,
          shippingName: ship?.name,
          installments,
          saveAddress: saveAddr,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || 'Erro');
        return;
      }

      if (paymentMethod === 'PIX') {
        toast.success('Pagamento PIX gerado! Aguardando confirmação...');
        setTimeout(() => {
          fetch(`/api/orders/${d.orderId}/mock-approve`, { method: 'POST' });
        }, 3000);
      } else if (paymentMethod === 'BOLETO') {
        toast.success('Boleto gerado! Pagamento confirmado em até 3 dias úteis.');
      } else {
        toast.success('Pagamento aprovado!');
        setTimeout(() => {
          fetch(`/api/orders/${d.orderId}/mock-approve`, { method: 'POST' });
        }, 1500);
      }

      clearCart();
      saveAddress();
      router.replace(`/pedido/${d.orderNumber}/sucesso`);
    } finally {
      setProcessing(false);
    }
  };

  const goNext = () => {
    if (step === 1 && !validaStep1()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  if (status !== 'authenticated' || !session) {
    return (
      <div className="container-pad py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary-500" size={36} />
        <p className="mt-4 text-gray-500">Preparando checkout...</p>
      </div>
    );
  }

  return (
    <div className="container-pad py-6 sm:py-10 max-w-6xl">
      <Link
        href="/carrinho"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 min-h-[44px]"
      >
        <ChevronLeft size={16} />
        Voltar ao carrinho
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Finalizar compra</h1>

      <div className="flex items-center justify-between gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => s.n < step && setStep(s.n)}
                disabled={s.n > step}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 min-h-[48px] font-semibold text-sm transition',
                  step === s.n
                    ? 'bg-primary-500 text-white shadow-md'
                    : step > s.n
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {step > s.n ? <CheckCircle2 size={16} /> : s.n}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">Etapa {s.n}</span>
              </button>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={16} className="text-gray-300 shrink-0 mx-1 sm:mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <MapPin size={20} />
                    Endereço de entrega
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setUseNew((v) => !v);
                      setShowForm((v) => !v);
                    }}
                    className="btn-outline-primary !py-2 !px-3 text-xs min-h-[40px]"
                  >
                    <Plus size={14} />
                    Novo endereço
                  </button>
                </div>

                {!useNew && addresses?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((a: any) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setAddressId(a.id);
                          setShip((s: any) =>
                            s ? shippingOptions.find((o) => o.type === s.type) : null
                          );
                        }}
                        className={cn(
                          'text-left p-4 rounded-xl border-2 transition min-h-[120px] flex flex-col gap-2',
                          addressId === a.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-gray-900 text-sm">{a.recipient}</p>
                          {a.isDefault && (
                            <span className="chip bg-primary-100 text-primary-700 !py-0.5">
                              Padrão
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {a.street}, {a.number}
                          {a.complement ? ` - ${a.complement}` : ''}
                          <br />
                          {a.neighborhood} - {a.city}/{a.state}
                          <br />
                          CEP: {a.zipCode}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {(useNew || showForm || !addresses?.length) && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-gray-100">
                    <AddressForm
                      value={formAddr}
                      onChange={setFormAddr}
                      onCepBlur={buscaCep}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddr}
                        onChange={(e) => setSaveAddr(e.target.checked)}
                        className="w-4 h-4 rounded text-primary-500"
                      />
                      Salvar esse endereço na minha conta
                    </label>
                  </div>
                )}
              </div>

              {shippingOptions.length > 0 && (
                <div className="card p-5 sm:p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Truck size={20} />
                    Opções de envio
                  </h2>
                  <div className="space-y-2.5">
                    {shippingOptions.map((o) => (
                      <label
                        key={o.type}
                        className={cn(
                          'flex items-center justify-between gap-3 p-4 rounded-xl border-2 cursor-pointer transition min-h-[64px]',
                          ship?.type === o.type
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="ship"
                            checked={ship?.type === o.type}
                            onChange={() => setShip(o)}
                            className="w-4 h-4 text-primary-500"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {o.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {o.days === 0
                                ? 'Retire hoje na loja'
                                : `Prazo: ${o.days} dias úteis`}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-gray-900 shrink-0">
                          {o.cost === 0 ? 'Grátis' : formatCurrency(o.cost)}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="card p-5 sm:p-6 space-y-6">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <CreditCard size={20} />
                Forma de pagamento
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'CARTAO_CREDITO',
                    name: 'Cartão de Crédito',
                    desc: 'Até 12x sem juros',
                    icon: CreditCard,
                    color: 'from-blue-500 to-indigo-600',
                  },
                  {
                    id: 'PIX',
                    name: 'Pix',
                    desc: 'Pagamento instantâneo',
                    icon: Pix,
                    color: 'from-green-500 to-emerald-600',
                  },
                  {
                    id: 'BOLETO',
                    name: 'Boleto Bancário',
                    desc: 'Vencimento em 3 dias',
                    icon: Barcode,
                    color: 'from-amber-500 to-orange-600',
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(p.id as any)
                    }
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition min-h-[108px] flex flex-col gap-2',
                      paymentMethod === p.id
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center',
                        p.color
                      )}
                    >
                      <p.icon size={20} />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </button>
                ))}
              </div>

              {paymentMethod === 'CARTAO_CREDITO' && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="label">Número do cartão</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardForm.number}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            number: maskCardNumber(e.target.value).slice(0, 19),
                          })
                        }
                        className="input"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Nome impresso no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMO ESTÁ NO CARTÃO"
                        value={cardForm.name}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Validade</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={cardForm.expiry}
                        onChange={(e) => {
                          const v = e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 4)
                            .replace(/(\d{2})(\d)/, '$1/$2');
                          setCardForm({ ...cardForm, expiry: v });
                        }}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardForm.cvc}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                          })
                        }
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Parcelamento</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(parseInt(e.target.value))}
                      className="input cursor-pointer"
                    >
                      {Array.from({ length: 12 }).map((_, i) => {
                        const n = i + 1;
                        const v = total / n;
                        return (
                          <option key={n} value={n}>
                            {n}x de {formatCurrency(v)}
                            {n <= 6 ? ' sem juros' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardForm.save}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, save: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary-500"
                    />
                    Salvar cartão para futuras compras (máscara PCI)
                  </label>
                </div>
              )}

              {paymentMethod === 'PIX' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    <Pix size={22} />
                    Pagamento via Pix
                  </div>
                  <p className="text-sm text-green-800">
                    Após a confirmação, você receberá um QR Code e o código Copia e Cola.
                    O pagamento é instantâneo, aprovação em segundos.
                  </p>
                </div>
              )}

              {paymentMethod === 'BOLETO' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Barcode size={22} />
                    Boleto Bancário
                  </div>
                  <p className="text-sm text-amber-800">
                    Vencimento em até 3 dias úteis após a emissão. Aprovação do pagamento em até
                    3 dias úteis após pagamento.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-xl text-sm">
                <Shield size={20} />
                Seus dados de pagamento estão protegidos e criptografados de ponta a ponta.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="card p-5 sm:p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  Revise seu pedido
                </h2>

                <div className="space-y-5">
                  <ReviewBlock title="Endereço de entrega" icon={MapPin}>
                    {currentAddress ? (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>{currentAddress.recipient}</strong>
                        <br />
                        {currentAddress.street}, {currentAddress.number}
                        {currentAddress.complement && ` - ${currentAddress.complement}`}
                        <br />
                        {currentAddress.neighborhood} - {currentAddress.city}/
                        {currentAddress.state}
                        <br />
                        CEP {currentAddress.zipCode}
                      </p>
                    ) : (
                      <span className="text-red-500">—</span>
                    )}
                  </ReviewBlock>

                  <ReviewBlock title="Envio" icon={Truck}>
                    {ship ? (
                      <p className="text-sm text-gray-700">
                        <strong>{ship.name}</strong>
                        <br />
                        Prazo: {ship.days === 0 ? 'Retire hoje' : `${ship.days} dias úteis`} ·{' '}
                        {ship.cost === 0 ? 'Grátis' : formatCurrency(ship.cost)}
                      </p>
                    ) : (
                      <span className="text-red-500">—</span>
                    )}
                  </ReviewBlock>

                  <ReviewBlock title="Pagamento" icon={CreditCard}>
                    <p className="text-sm text-gray-700">
                      <strong>
                        {paymentMethod === 'CARTAO_CREDITO'
                          ? `Cartão de Crédito · ${installments}x`
                          : paymentMethod === 'PIX'
                          ? 'Pix · Pagamento instantâneo'
                          : 'Boleto Bancário'}
                      </strong>
                      {paymentMethod === 'CARTAO_CREDITO' && (
                        <>
                          <br />
                          Valor por parcela: {formatCurrency(total / installments)}
                        </>
                      )}
                    </p>
                  </ReviewBlock>
                </div>
              </div>

              <div className="card p-5 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={18} />
                  Produtos ({totalItems})
                </h3>
                <div className="space-y-3">
                  {items.map((i) => (
                    <div
                      key={i.variantId}
                      className="flex gap-3 items-center p-2 -mx-2 rounded-xl hover:bg-gray-50"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={i.productImage}
                          fill
                          sizes="60px"
                          className="object-cover"
                          alt={i.productName}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {i.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {i.color} · {i.size} · Qtd {i.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm shrink-0">
                        {formatCurrency(i.unitPrice * i.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 h-fit space-y-5">
          <div className="card p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Resumo do pedido</h3>

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal ({totalItems})</dt>
                <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Cupom {couponCode}</dt>
                  <dd className="font-bold">-{formatCurrency(couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Frete ({ship?.name || '—'})</dt>
                <dd className="font-semibold">
                  {ship ? (shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)) : '—'}
                </dd>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                <dt className="font-bold text-base">Total</dt>
                <dd className="font-extrabold text-2xl sm:text-3xl text-gray-900">
                  {formatCurrency(total)}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="btn-secondary w-full"
                >
                  <ChevronLeft size={18} />
                  Voltar
                </button>
              )}
              <button
                type="button"
                disabled={processing || (step < 3 && step === 1 && !currentAddress)}
                onClick={() => (step < 3 ? goNext() : submitOrder())}
                className="btn-primary w-full text-base min-h-[56px]"
              >
                {processing && <Loader2 className="animate-spin" size={18} />}
                {step < 3
                  ? `Continuar · Etapa ${step} de 3`
                  : processing
                  ? 'Finalizando pedido...'
                  : `Pagar ${formatCurrency(total)}`}
                {!processing && step < 3 && <ChevronRight size={18} />}
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 pt-1">
              🔒 Compra 100% segura · Dados criptografados
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  const I = icon;
  return (
    <div className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs text-gray-500 font-semibold mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
        <I size={14} />
        {title}
      </p>
      {children}
    </div>
  );
}

function AddressForm({
  value,
  onChange,
  onCepBlur,
}: {
  value: any;
  onChange: (v: any) => void;
  onCepBlur: () => void;
}) {
  const set = (k: string, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-1">
        <label className="label">CEP</label>
        <input
          className="input"
          placeholder="00000-000"
          inputMode="numeric"
          value={value.zipCode}
          onChange={(e) => set('zipCode', maskCep(e.target.value))}
          onBlur={onCepBlur}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">Destinatário</label>
        <input
          className="input"
          placeholder="Nome completo"
          value={value.recipient}
          onChange={(e) => set('recipient', e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Logradouro</label>
        <input
          className="input"
          placeholder="Rua, Av, Trav..."
          value={value.street}
          onChange={(e) => set('street', e.target.value)}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">Número</label>
        <input
          className="input"
          placeholder="123"
          value={value.number}
          onChange={(e) => set('number', e.target.value)}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">Complemento</label>
        <input
          className="input"
          placeholder="Apto 201, Bloco B..."
          value={value.complement}
          onChange={(e) => set('complement', e.target.value)}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">Bairro</label>
        <input
          className="input"
          placeholder="Centro"
          value={value.neighborhood}
          onChange={(e) => set('neighborhood', e.target.value)}
        />
      </div>
      <div className="sm:col-span-1">
        <label className="label">Cidade / UF</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Cidade"
            value={value.city}
            onChange={(e) => set('city', e.target.value)}
          />
          <input
            className="input w-20"
            placeholder="UF"
            maxLength={2}
            value={value.state}
            onChange={(e) => set('state', e.target.value.toUpperCase())}
          />
        </div>
      </div>
    </div>
  );
}
