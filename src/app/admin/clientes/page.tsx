"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Users,
  ShoppingBag,
  Calendar,
  ChevronRight,
  Loader2,
  DollarSign,
  Star,
  Crown,
  Mail,
  Phone,
  Filter,
} from "lucide-react";
import useSWR from "swr";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  createdAt: string;
  _count: { orders: number; reviews: number; addresses: number };
  orders: Array<{ totalAmount: number; status: string }>;
}

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminClientesPage() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"recent" | "spent" | "orders">(
    "recent"
  );

  const { data, isLoading } = useSWR("/api/admin/clients", fetcher, {
    refreshInterval: 60000,
  });

  let clients: Cliente[] = data?.clients || [];

  clients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || "").replace(/\D/g, "").includes(search.replace(/\D/g, ""))
  );

  clients = clients.sort((a, b) => {
    if (orderBy === "recent")
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    if (orderBy === "orders") return b._count.orders - a._count.orders;
    const ta = a.orders.reduce((s, o) => s + (o.status === "ENTREGUE" || o.status === "PAGO" ? o.totalAmount : 0), 0);
    const tb = b.orders.reduce((s, o) => s + (o.status === "ENTREGUE" || o.status === "PAGO" ? o.totalAmount : 0), 0);
    return tb - ta;
  });

  const totalSpent = (c: Cliente) =>
    c.orders.reduce(
      (s, o) =>
        s + (o.status === "ENTREGUE" || o.status === "PAGO" ? o.totalAmount : 0),
      0
    );

  const tier = (total: number) => {
    if (total >= 5000) return { label: "VIP Ouro", color: "!bg-gold/20 !text-amber-700", icon: Crown };
    if (total >= 1000) return { label: "Prata", color: "!bg-slate-200 !text-slate-700", icon: Star };
    return { label: "Bronze", color: "!bg-orange-100 !text-orange-700", icon: User };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Gestão de Clientes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado
            {clients.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Clientes",
            value: clients.length,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Novos (30 dias)",
            value: clients.filter(
              (c) =>
                +new Date(c.createdAt) >
                Date.now() - 30 * 24 * 3600 * 1000
            ).length,
            icon: Calendar,
            color: "text-green-500",
          },
          {
            label: "Pedidos Totais",
            value: clients.reduce((a, c) => a + c._count.orders, 0),
            icon: ShoppingBag,
            color: "text-blue-500",
          },
          {
            label: "Receita Total",
            value: formatCurrency(
              clients.reduce((a, c) => a + totalSpent(c), 0)
            ),
            icon: DollarSign,
            color: "text-gold",
          },
        ].map((k) => (
          <div key={k.label} className="card p-5 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${k.color}`}
            >
              <k.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                {k.label}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white break-words">
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="card p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400 hidden sm:block" />
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as any)}
            className="input w-full sm:w-auto"
          >
            <option value="recent">Mais recentes</option>
            <option value="spent">Maior gasto</option>
            <option value="orders">Mais pedidos</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="card p-12 text-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
          Carregando...
        </div>
      ) : clients.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-1">Nenhum cliente encontrado</h3>
          <p className="text-slate-500 text-sm">
            Ajuste os filtros de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((c) => {
            const spent = totalSpent(c);
            const t = tier(spent);
            const TierIcon = t.icon;
            return (
              <div key={c.id} className="card p-5 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">
                        {c.name}
                      </h3>
                      <span className={`chip !py-1 !px-2 text-[10px] ${t.color}`}>
                        <TierIcon className="w-3 h-3" />
                        {t.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      {c.email}
                    </p>
                    {c.phone && (
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {c.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {c._count.orders}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Pedidos
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <DollarSign className="w-4 h-4 mx-auto mb-1 text-gold" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {formatCurrency(spent)}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Total Gasto
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <Star className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {c._count.reviews}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Avaliações
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Cliente desde {formatDate(c.createdAt)}
                  </p>
                  <Link
                    href={`/admin/pedidos?q=${encodeURIComponent(c.email)}`}
                    className="btn btn-ghost !py-2 !px-3 min-h-[40px]"
                  >
                    Ver Pedidos
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
