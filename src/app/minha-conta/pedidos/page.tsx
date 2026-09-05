'use client';

import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Package,
  Search,
  ChevronRight,
  MapPin,
  CreditCard,
  Eye,
  Clock,
} from 'lucide-react';
import {
  cn,
  formatCurrency,
  formatDateOnly,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

export default function PedidosPage() {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState<string>('TODOS');
  const [page, setPage] = React.useState(1);

  const { data, isLoading, mutate } = useSWR(`/api/orders?page=${page}`, fetcher);
  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 0;

  const filtros = ['TODOS', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];

  const filtered = orders.filter((o: any) => {
    const byStatus = filter === 'TODOS' || o.status === filter;
    const byQ =
      !q ||
      o.orderNumber.toLowerCase().includes(q.toLowerCase());
    return byStatus && byQ;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Package size={24} />
          Meus Pedidos
        </h2>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por número..."
            className="input !min-h-[44px] !pl-10 !text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {filtros.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition min-h-[44px]',
              filter === f
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
            )}
          >
            {f === 'TODOS' ? 'Todos' : getOrderStatusLabel(f)}
          </button>
        ))}
      </div>

      {isLoading && !orders.length && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-16 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="card p-10 text-center space-y-3">
          <Package size={44} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-900">Nenhum pedido encontrado</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Ajuste os filtros ou comece sua primeira compra.
          </p>
          <Link href="/produtos" className="btn-primary inline-flex !py-2.5 !px-5 text-sm">
            Começar a comprar
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((o: any) => (
          <Link
            key={o.id}
            href={`/minha-conta/pedidos/${o.orderNumber}`}
            className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all block group"
          >
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 flex-wrap">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
                  Pedido
                </p>
                <p className="font-extrabold text-gray-900 text-lg">#{o.orderNumber}</p>
              </div>
              <span
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-bold border',
                  getOrderStatusColor(o.status)
                )}
              >
                {getOrderStatusLabel(o.status)}
              </span>
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-primary-500 transition hidden sm:block"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={12} /> Data
                </p>
                <p className="font-semibold text-gray-900">{formatDateOnly(o.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <CreditCard size={12} /> Pagamento
                </p>
                <p className="font-semibold text-gray-900">
                  {getPaymentMethodLabel(o.paymentMethod)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Itens</p>
                <p className="font-semibold text-gray-900">{o._count.items} produto(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="font-extrabold text-gray-900 text-lg">{formatCurrency(o.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  mutate();
                }}
                className={cn(
                  'w-11 h-11 rounded-xl text-sm font-bold transition min-h-[44px]',
                  page === p
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
