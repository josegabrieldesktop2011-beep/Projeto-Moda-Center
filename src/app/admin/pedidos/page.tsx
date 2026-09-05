"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  PackageCheck,
} from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  OrderStatus,
  getOrderStatusLabel,
  getOrderStatusColor,
  formatCurrency,
  formatDate,
} from "@/lib/utils";

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  user: { name: string; email: string } | null;
  itemsCount: number;
}

const statusFilters = [
  { value: "all", label: "Todos", icon: Package },
  { value: "AGUARDANDO_PAGAMENTO", label: "Aguardando Pag.", icon: Clock },
  { value: "PAGO", label: "Pagos", icon: CheckCircle2 },
  { value: "PROCESSANDO", label: "Processando", icon: Loader2 },
  { value: "ENVIADO", label: "Enviados", icon: Truck },
  { value: "ENTREGUE", label: "Entregues", icon: PackageCheck },
  { value: "CANCELADO", label: "Cancelados", icon: XCircle },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPedidosPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) query.set("q", search);
  if (statusFilter !== "all") query.set("status", statusFilter);
  if (dateFrom) query.set("dateFrom", dateFrom);
  if (dateTo) query.set("dateTo", dateTo);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/orders?${query.toString()}`,
    fetcher,
    { refreshInterval: 300000 }
  );

  const orders: OrderSummary[] = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestão de Pedidos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalCount} pedido{totalCount !== 1 ? "s" : ""} encontrado
            {totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nº pedido, cliente ou e-mail..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-10 w-full"
            />
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="input w-full"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="input w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => {
            const Icon = f.icon;
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => {
                  setStatusFilter(f.value);
                  setPage(1);
                }}
                className={`chip min-h-[40px] transition-all ${
                  active
                    ? "!bg-primary !text-white !border-primary"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Pedidos */}
      {isLoading ? (
        <div className="card p-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-3" />
          <p>Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="card p-8 text-center text-red-500">
          Erro ao carregar pedidos. Tente novamente.
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-16 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Nenhum pedido encontrado
          </h3>
          <p className="text-slate-500 text-sm">
            Ajuste os filtros ou volte mais tarde.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Tabela */}
          <div className="hidden lg:block card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs uppercase">
                <tr>
                  <th className="text-left p-4 font-semibold">Pedido</th>
                  <th className="text-left p-4 font-semibold">Cliente</th>
                  <th className="text-left p-4 font-semibold">Data</th>
                  <th className="text-left p-4 font-semibold">Itens</th>
                  <th className="text-left p-4 font-semibold">Total</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        #{o.orderNumber}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {o.paymentMethod?.replace("_", " ")}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {o.user?.name || "Cliente Convidado"}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[220px]">
                        {o.user?.email || "—"}
                      </p>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="p-4">
                      <span className="chip !py-1">
                        <Package className="w-3.5 h-3.5" />
                        {o.itemsCount} {o.itemsCount === 1 ? "item" : "itens"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`chip !py-1 font-medium ${getOrderStatusColor(
                          o.status
                        )}`}
                      >
                        {getOrderStatusLabel(o.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/pedidos/${o.orderNumber}`}
                        className="btn btn-ghost !py-2 !px-3 inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="lg:hidden space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      #{o.orderNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(o.createdAt)} • {o.itemsCount}{" "}
                      {o.itemsCount === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <span
                    className={`chip !py-1 text-xs ${getOrderStatusColor(
                      o.status
                    )}`}
                  >
                    {getOrderStatusLabel(o.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {o.user?.name || "Convidado"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {o.paymentMethod?.replace("_", " ")}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(o.totalAmount)}
                  </p>
                </div>
                <Link
                  href={`/admin/pedidos/${o.orderNumber}`}
                  className="btn btn-primary w-full min-h-[48px]"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Página <b>{page}</b> de <b>{totalPages}</b>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-ghost !p-2 min-w-[48px] min-h-[48px]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const n = start + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`min-w-[40px] min-h-[40px] rounded-lg font-medium transition ${
                        n === page
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-ghost !p-2 min-w-[48px] min-h-[48px]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
