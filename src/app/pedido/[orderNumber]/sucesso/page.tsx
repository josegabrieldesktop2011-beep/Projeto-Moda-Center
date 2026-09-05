'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Home,
  ShoppingBag,
  Download,
  Clock,
  Copy,
  Barcode,
  Share2,
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

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

export default function SucessoPage({ params }: { params: { orderNumber: string } }) {
  const { data, error, isLoading } = useSWR(
    `/api/orders/by-number/${params.orderNumber}`,
    fetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  const order = data?.order;
  const items = data?.items || [];
  const shipping = order?.shippingAddress;

  if (isLoading || !order) {
    return (
      <div className="container-pad py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 animate-pulse flex items-center justify-center">
          <Package size={32} className="text-primary-500" />
        </div>
        <p className="text-gray-500">Buscando informações do pedido...</p>
      </div>
    );
  }

  return (
    <div className="container-pad py-6 sm:py-10 max-w-4xl">
      <div className="card overflow-hidden mb-6">
        <div
          className={cn(
            'p-6 sm:p-8 text-center',
            order.paymentStatus === 'APROVADO'
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
              : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
          )}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
            {order.paymentStatus === 'APROVADO' ? (
              <CheckCircle2 size={44} />
            ) : (
              <Clock size={44} />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5">
            {order.paymentStatus === 'APROVADO'
              ? 'Pedido confirmado! 🎉'
              : 'Pedido recebido!'}
          </h1>
          <p className="opacity-90 text-sm sm:text-base max-w-xl mx-auto">
            {order.paymentStatus === 'APROVADO'
              ? `Pagamento aprovado. Recebemos seu pedido ${order.orderNumber} e já estamos preparando para envio.`
              : `Estamos aguardando a confirmação do pagamento do pedido ${order.orderNumber}.`}
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Número do pedido
              </p>
              <p className="font-extrabold text-lg text-gray-900">{order.orderNumber}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(order.orderNumber);
                toast.success('Número copiado!');
              }}
              className="btn-secondary !py-2 !px-3 text-xs min-h-[40px]"
            >
              <Copy size={14} />
              Copiar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Package size={14} />
                Situação
              </p>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
                  getOrderStatusColor(order.status)
                )}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <div className="p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CreditCard size={14} />
                Pagamento
              </p>
              <p className="font-bold text-sm text-gray-900">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              <p className={cn(
                'text-xs font-bold mt-0.5',
                order.paymentStatus === 'APROVADO' ? 'text-green-600' :
                order.paymentStatus === 'RECUSADO' ? 'text-red-600' : 'text-amber-600'
              )}>
                {order.paymentStatus === 'APROVADO' ? 'Aprovado' :
                 order.paymentStatus === 'RECUSADO' ? 'Recusado' :
                 order.paymentStatus === 'PENDENTE' ? 'Pendente' : 'Estornado'}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Clock size={14} />
                Data
              </p>
              <p className="font-bold text-sm text-gray-900">
                {formatDateOnly(order.createdAt)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(order.createdAt).split(' ')[1]}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Truck size={14} />
                Entrega
              </p>
              <p className="font-bold text-sm text-gray-900">
                {order.trackingUrl || 'Em processamento'}
              </p>
            </div>
          </div>

          {order.paymentMethod === 'PIX' && order.paymentStatus === 'PENDENTE' && (
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl space-y-3 text-center">
              <div className="w-20 h-20 bg-white p-2 rounded-xl mx-auto shadow-sm border border-gray-100">
                <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-green-800">Escaneie o QR Code com seu app de banco</p>
                <p className="text-xs text-green-700 mt-1">
                  Ou copie o código "Copia e Cola" abaixo
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  className="btn-primary !py-2.5 !px-4 text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      '00020126830014BR.GOV.BCB.PIX... (mock-copia-e-cola)'
                    );
                    toast.success('Código Pix copiado!');
                  }}
                >
                  <Barcode size={16} />
                  Copiar código Pix
                </button>
              </div>
            </div>
          )}

          {order.paymentMethod === 'BOLETO' && order.paymentStatus === 'PENDENTE' && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-3">
              <Barcode size={34} className="mx-auto text-amber-700" />
              <div>
                <p className="font-bold text-amber-800">Boleto gerado com sucesso!</p>
                <p className="text-xs text-amber-700 mt-1">
                  O prazo de vencimento é de até 3 dias úteis.
                </p>
              </div>
              <button type="button" className="btn-secondary !py-2.5 !px-4 text-sm">
                <Download size={16} />
                Baixar boleto (PDF)
              </button>
            </div>
          )}

          {shipping && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Endereço de entrega
              </h3>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="font-semibold text-sm text-gray-900">{shipping.recipient}</p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {shipping.street}, {shipping.number}
                  {shipping.complement && ` - ${shipping.complement}`}
                  <br />
                  {shipping.neighborhood} · {shipping.city}/{shipping.state}
                  <br />
                  CEP: {maskCep(shipping.zipCode)}
                </p>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingBag size={18} />
              Produtos do pedido ({items.length})
            </h3>
            <div className="card divide-y divide-gray-100 overflow-hidden">
              {items.map((i: any) => (
                <div key={i.id} className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-center">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {/* placeholder - no image fetch for simplicity on order page */}
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-brand-100 flex items-center justify-center text-primary-600 font-black text-xs">
                      {i.variantSize}/{i.variantColor?.[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/minha-conta/pedidos/${order.orderNumber}`}
                      className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600"
                    >
                      {i.productName}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Tam. {i.variantSize} · {i.variantColor} · Qtd {i.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      unit. {formatCurrency(i.unitPrice)}
                    </p>
                    <p className="font-extrabold text-gray-900">
                      {formatCurrency(i.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-gray-900 mb-1">Resumo financeiro</h3>
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
              <span className="font-bold text-base text-gray-900">Total pago</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/" className="btn-secondary !py-3 w-full">
          <Home size={18} />
          Voltar para o início
        </Link>
        <Link href="/minha-conta/pedidos" className="btn-outline-primary !py-3 w-full">
          <Package size={18} />
          Acompanhar pedidos
        </Link>
        <Link href="/produtos" className="btn-primary !py-3 w-full">
          <ShoppingBag size={18} />
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
