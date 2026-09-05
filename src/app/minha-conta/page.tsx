'use client';

import * as React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Package,
  MapPin,
  CreditCard,
  Heart,
  Star,
  ChevronRight,
  ShoppingBag,
  User as UserIcon,
  Calendar,
  BadgePercent,
  Receipt,
} from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

export default function MinhaContaHome() {
  const { data: profile } = useSWR('/api/user/profile', fetcher);
  const { data: orders } = useSWR('/api/orders', fetcher);
  const { data: addresses } = useSWR('/api/user/addresses', fetcher);

  const ultimosPedidos = orders?.orders?.slice(0, 3) || [];
  const totalGasto = orders?.total >= 0 ? (orders.orders || []).reduce((acc: number, o: any) => acc + (o.paymentStatus === 'APROVADO' ? Number(o.total) : 0), 0) : 0;
  const pedidosEntregues = (orders?.orders || []).filter(
    (o: any) => o.status === 'ENTREGUE' || o.paymentStatus === 'APROVADO'
  ).length;

  const stats = [
    {
      icon: Package,
      label: 'Pedidos Realizados',
      value: orders?.total || 0,
      href: '/minha-conta/pedidos',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Receipt,
      label: 'Pedidos Aprovados',
      value: pedidosEntregues,
      href: '/minha-conta/pedidos',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: MapPin,
      label: 'Endereços',
      value: addresses?.length || 0,
      href: '/minha-conta/enderecos',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: BadgePercent,
      label: 'Total Gasto',
      value: formatCurrency(totalGasto),
      href: '/minha-conta/pedidos',
      color: 'from-primary-500 to-brand-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-5 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-300 mb-1 flex items-center gap-1.5">
              <Calendar size={14} />
              Último acesso: Hoje
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Olá, {profile?.name?.split(' ')[0] || 'Cliente'}! 👋
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Seja bem-vindo(a) de volta ao Moda Center Santa Cruz.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-brand-500 flex items-center justify-center text-3xl font-black shadow-lg">
              {profile?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <Link href="/minha-conta/pedidos" className="p-3 bg-white/10 rounded-xl hover:bg-white/15 transition min-h-[56px] flex items-center gap-2.5">
            <Package size={20} />
            <div>
              <p className="text-xs text-gray-300">Total de pedidos</p>
              <p className="font-extrabold">{orders?.total || 0}</p>
            </div>
          </Link>
          <Link href="/lista-desejos" className="p-3 bg-white/10 rounded-xl hover:bg-white/15 transition min-h-[56px] flex items-center gap-2.5">
            <Heart size={20} />
            <div>
              <p className="text-xs text-gray-300">Lista de desejos</p>
              <p className="font-extrabold">0 itens</p>
            </div>
          </Link>
          <Link href="/minha-conta/configuracoes" className="p-3 bg-white/10 rounded-xl hover:bg-white/15 transition min-h-[56px] flex items-center gap-2.5">
            <UserIcon size={20} />
            <div>
              <p className="text-xs text-gray-300">Perfil completo</p>
              <p className="font-extrabold">{profile?.emailVerified ? '100%' : '70%'}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className="card p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-sm mb-3`}
            >
              <s.icon size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              {s.label}
            </p>
            <p className="font-extrabold text-gray-900 text-lg sm:text-xl truncate">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Package size={20} />
              Últimos pedidos
            </h3>
            <Link
              href="/minha-conta/pedidos"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 min-h-[40px]"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag size={40} className="mx-auto text-gray-300" />
              <p className="text-gray-500 text-sm">Você ainda não fez nenhum pedido.</p>
              <Link href="/produtos" className="btn-outline-primary !py-2 !px-4 text-sm inline-flex">
                Começar a comprar
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {ultimosPedidos.map((o: any) => (
                <Link
                  key={o.id}
                  href={`/minha-conta/pedidos/${o.orderNumber}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-bold text-sm text-gray-900">#{o.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateOnly(o.createdAt)} · {o._count.items} itens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gray-900">{formatCurrency(o.total)}</p>
                    <p className="text-xs text-gray-500">{o.status.replace(/_/g, ' ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5 sm:p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Star size={20} className="text-gold-500" />
              Aproveite benefícios
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Cupom BEMVINDO10', desc: '10% OFF na sua primeira compra acima de R$100' },
                { title: 'Frete grátis para RS', desc: 'Em compras acima de R$199' },
                { title: 'Troca fácil', desc: '30 dias para trocar suas peças' },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-sm font-black">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <UserIcon size={20} />
              Dados pessoais
            </h3>
            <div className="space-y-2.5 text-sm">
              <Row label="Nome" value={profile?.name} />
              <Row label="E-mail" value={profile?.email} />
              <Row label="CPF" value={profile?.cpf || 'Não cadastrado'} />
              <Row label="Telefone" value={profile?.phone || 'Não cadastrado'} />
            </div>
            <Link
              href="/minha-conta/configuracoes"
              className="btn-outline-primary w-full mt-4 !py-2.5 text-sm"
            >
              Editar dados
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-start gap-3 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right">{value || '—'}</span>
    </div>
  );
}
