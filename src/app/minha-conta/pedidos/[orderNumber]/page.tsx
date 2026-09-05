'use client';

import * as React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  ChevronRight,
  CheckCircle2,
  Clock,
  Box,
  HandshakeIcon,
  FileText,
  Star,
  Send,
  MessageSquare,
  Download,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateOnly,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  maskCep,
} from '@/lib/utils';
import { StarsRating } from '@/components/ui/StarsRating';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

const timelineSteps = [
  { key: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando pagamento', icon: CreditCard },
  { key: 'PAGO', label: 'Pagamento aprovado', icon: CheckCircle2 },
  { key: 'PROCESSANDO', label: 'Em separação', icon: Box },
  { key: 'ENVIADO', label: 'Enviado', icon: Truck },
  { key: 'ENTREGUE', label: 'Entregue', icon: HandshakeIcon },
];

export default function DetalhePedidoPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const { data, mutate } = useSWR(`/api/orders/by-number/${orderNumber}`, fetcher);
  const [reviewRatings, setReviewRatings] = React.useState<Record<string, number>>({});
  const [reviewComments, setReviewComments] = React.useState<Record<string, string>>({});
  const [msg, setMsg] = React.useState('');

  const order = data?.order;
  const items = data?.items || [];
  const history = data?.statusHistory || [];

  if (!order) {
    return (
      <div className="card p-10 text-center space-y-3">
        <Package size={44} className="mx-auto text-gray-300" />
        <h3 className="font-bold text-gray-900">Pedido não encontrado</h3>
        <Link href="/minha-conta/pedidos" className="btn-outline-primary inline-flex">
          Voltar
        </Link>
      </div>
    );
  }

  const statusIndex = timelineSteps.findIndex((s) => s.key === order.status);
  const currentIdx = statusIndex === -1 ? 0 : statusIndex;

  const submitReview = async (productId: string, productSlug?: string) => {
    const rating = reviewRatings[productId];
    if (!rating) {
      toast.error('Selecione uma nota');
      return;
    }
    try {
      const res = await fetch(
        `/api/products/${productSlug || productId}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating,
            comment: reviewComments[productId],
          }),
        }
      );
      const d = await res.json();
      if (res.ok) {
        toast.success('Avaliação enviada!');
        mutate();
      } else toast.error(d.error || 'Erro');
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/minha-conta/pedidos"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 min-h-[32px]"
          >
            ← Voltar para pedidos
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 mt-1">
            <Package size={24} />
            Pedido #{order.orderNumber}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(order.orderNumber);
            toast.success('Copiado!');
          }}
          className="btn-secondary !py-2 !px-3 text-xs min-h-[40px]"
        >
          <Copy size={14} />
          Copiar pedido
        </button>
      </div>

      <div className="card p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 mb-5">Status do pedido</h3>
        <div className="relative">
          <div className="hidden sm:block absolute top-6 left-0 right-0 h-1 bg-gray-200 mx-6" />
          <div
            className="hidden sm:block absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-6 transition-all"
            style={{ width: `calc(${currentIdx * 25}% - ${currentIdx > 0 ? 0 : 0}px)` }}
          />
          <div className="grid grid-cols-5 gap-2 sm:gap-4 relative z-10">
            {timelineSteps.slice(0, 5).map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div key={s.key} className="flex flex-col items-center text-center gap-2">
                  <div
                    className={cn(
                      'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0',
                      done
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    <s.icon size={18} />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs font-bold leading-tight',
                      done ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <FileText size={14} />
            Situação
          </p>
          <span className={cn('chip border', getOrderStatusColor(order.status))}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <CreditCard size={14} />
            Pagamento
          </p>
          <p className="font-bold text-sm text-gray-900">
            {getPaymentMethodLabel(order.paymentMethod)}
          </p>
          <p className="text-xs font-bold text-green-600 mt-0.5">
            {order.paymentStatus === 'APROVADO'
              ? 'Aprovado'
              : order.paymentStatus === 'PENDENTE'
              ? 'Pendente'
              : order.paymentStatus}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Clock size={14} />
            Data
          </p>
          <p className="font-bold text-sm text-gray-900">{formatDateOnly(order.createdAt)}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt).split(' ')[1]}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Truck size={14} />
            Rastreio
          </p>
          {order.trackingCode || order.trackingUrl ? (
            <p className="font-bold text-sm text-primary-600 truncate">
              {order.trackingCode || order.trackingUrl}
            </p>
          ) : (
            <p className="font-bold text-sm text-gray-500">Ainda não enviado</p>
          )}
        </div>
      </div>

      {order.shippingAddress && (
        <div className="card p-5 sm:p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={18} />
            Endereço de entrega
          </h3>
          <p className="font-semibold text-gray-900">{order.shippingAddress.recipient}</p>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            {order.shippingAddress.street}, {order.shippingAddress.number}
            {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
            <br />
            {order.shippingAddress.neighborhood} · {order.shippingAddress.city}/
            {order.shippingAddress.state}
            <br />
            CEP: {maskCep(order.shippingAddress.zipCode)}
          </p>
        </div>
      )}

      <div className="card p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={18} />
          Produtos ({items.length})
        </h3>
        <div className="divide-y divide-gray-100 -mx-5 sm:-mx-6">
          {items.map((it: any) => (
            <div key={it.id} className="px-5 sm:px-6 py-4 sm:py-5 space-y-4">
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-brand-100 shrink-0 flex items-center justify-center text-primary-600 font-black text-xs">
                  {it.variantSize}/{it.variantColor[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {it.productName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tamanho {it.variantSize} · Cor {it.variantColor} · Qtd {it.quantity}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-500">
                        Unit. {formatCurrency(it.unitPrice)}
                      </p>
                      <p className="font-extrabold text-gray-900 text-base">
                        {formatCurrency(it.subtotal)}
                      </p>
                    </div>
                    {order.status === 'ENTREGUE' && !order.reviews?.some((r: any) => r.productId === it.productId) && (
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                          <Star size={14} className="text-gold-500" />
                          Avalie este produto
                        </p>
                        <StarsRating
                          rating={reviewRatings[it.productId] || 0}
                          onChange={(n) =>
                            setReviewRatings({ ...reviewRatings, [it.productId]: n })
                          }
                          size={18}
                        />
                        <textarea
                          placeholder="Comentário (opcional, até 500 caracteres)"
                          rows={2}
                          maxLength={500}
                          value={reviewComments[it.productId] || ''}
                          onChange={(e) =>
                            setReviewComments({
                              ...reviewComments,
                              [it.productId]: e.target.value,
                            })
                          }
                          className="input !min-h-[40px] !py-1.5 !text-xs mt-2 resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => submitReview(it.productId, it.productId)}
                          className="btn-outline-primary !py-1.5 !px-3 text-xs mt-2 min-h-[40px]"
                        >
                          <Send size={12} />
                          Enviar avaliação
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 sm:p-6 space-y-3">
          <h3 className="font-bold text-gray-900">Resumo financeiro</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
          </div>
          {Number(order.discountTotal) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descontos</span>
              <span className="font-bold">-{formatCurrency(order.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frete</span>
            <span className="font-semibold">{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
            <span className="font-bold">Total</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="card p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} />
            Atendimento
          </h3>
          <div className="h-40 bg-gray-50 rounded-xl p-3 overflow-y-auto space-y-2 text-xs border border-gray-100">
            {history.map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-[10px] font-black">
                  A
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">
                    Status alterado: {getOrderStatusLabel(h.status)}
                  </p>
                  {h.note && <p className="text-gray-600 mt-0.5">{h.note}</p>}
                  <p className="text-gray-400 mt-1 text-[10px]">{formatDate(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!msg.trim()) return;
              toast.success('Mensagem enviada para o atendente!');
              setMsg('');
            }}
            className="flex gap-2"
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="input !min-h-[44px] !text-sm"
            />
            <button type="submit" className="btn-primary !px-4 !min-h-[48px]">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
