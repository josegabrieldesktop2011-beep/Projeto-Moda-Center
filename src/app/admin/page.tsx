'use client';

import * as React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package2,
  ChevronRight,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency, formatDateOnly } from '@/lib/utils';
import { toast } from 'sonner';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

const vendasMock = Array.from({ length: 14 }).map((_, i) => ({
  dia: `${i + 17}/08`,
  vendas: Math.floor(2000 + Math.random() * 6000),
  pedidos: Math.floor(8 + Math.random() * 30),
}));

const top5 = [
  { name: 'Camiseta Básica Feminina', qtd: 142, receita: 6791 },
  { name: 'Calça Jeans Slim Masculina', qtd: 98, receita: 9794 },
  { name: 'Vestido Floral Midi', qtd: 76, receita: 10140 },
  { name: 'Jaqueta Couro Masculina', qtd: 58, receita: 14490 },
  { name: 'Boné Baseball Unissex', qtd: 231, receita: 9216 },
];

const categoriasMock = [
  { name: 'Feminino', value: 48, color: '#f43f5e' },
  { name: 'Masculino', value: 32, color: '#c026d3' },
  { name: 'Infantil', value: 12, color: '#22c55e' },
  { name: 'Acessórios', value: 8, color: '#eab308' },
];

const estoqueBaixo = [
  { id: '1', sku: 'JCK-01', name: 'Jaqueta Couro Masculina', variante: 'Preto / G', stock: 2 },
  { id: '2', sku: 'VST-01', name: 'Blusa Tricô Feminina', variante: 'Bordô / M', stock: 3 },
  { id: '3', sku: 'BLU-03', name: 'Blusa de Tricô Feminina', variante: 'Bege / GG', stock: 4 },
  { id: '4', sku: 'VST-09', name: 'Vestido Floral Midi', variante: 'Rosa / P', stock: 4 },
];

export default function AdminDashboard() {
  const [periodo, setPeriodo] = React.useState('30');
  const { data, isLoading, mutate } = useSWR(
    `/api/admin/dashboard?periodo=${periodo}`,
    fetcher,
    { refreshInterval: 5 * 60 * 1000 }
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const faturamento = data?.faturamento || 248954.9;
  const pedidos = data?.pedidosTotal || 412;
  const pendentes = data?.pendentes || 18;
  const clientes = data?.clientes || 1238;
  const ticketMedio = data?.ticketMedio || faturamento / pedidos;

  const doRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
    toast.success('Dados atualizados!');
  };

  const cards = [
    {
      title: 'Faturamento do período',
      value: formatCurrency(faturamento),
      delta: '+12.4%',
      positive: true,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total de pedidos',
      value: pedidos.toLocaleString('pt-BR'),
      delta: '+8.2%',
      positive: true,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Pedidos pendentes',
      value: pendentes,
      delta: '-3.1%',
      positive: false,
      icon: Package,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Ticket médio',
      value: formatCurrency(ticketMedio),
      delta: '+5.9%',
      positive: true,
      icon: TrendingUp,
      color: 'from-primary-500 to-brand-600',
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar size={26} />
            Visão geral
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Última atualização:{' '}
            {new Date().toLocaleString('pt-BR')} · Atualiza a cada 5 min.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="input !py-2 !pl-4 !pr-10 text-sm cursor-pointer !min-h-[44px] w-auto"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Este ano</option>
          </select>
          <button
            type="button"
            onClick={doRefresh}
            disabled={refreshing}
            className="btn-secondary !py-2 !px-3 text-sm min-h-[44px]"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="card p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-sm`}
              >
                <c.icon size={20} />
              </div>
              <span
                className={`chip ${
                  c.positive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                } !py-0.5`}
              >
                {c.positive ? (
                  <ArrowUp size={12} />
                ) : (
                  <ArrowDown size={12} />
                )}
                {c.delta}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {c.title}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <TrendingUp size={18} />
              Faturamento vs Pedidos
            </h3>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasMock} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v: any, n: string) => [
                    n === 'vendas' ? formatCurrency(v) : v,
                    n === 'vendas' ? 'Vendas' : 'Pedidos',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="pedidos"
                  stroke="#c026d3"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Package2 size={18} />
              Por categoria
            </h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriasMock}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoriasMock.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
            {categoriasMock.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-gray-700 font-medium truncate">
                  {c.name}
                </span>
                <span className="ml-auto font-bold text-gray-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <TrendingUp size={18} />
              Top 5 produtos mais vendidos
            </h3>
            <Link
              href="/admin/produtos"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 min-h-[40px]"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <Tooltip />
                <Bar dataKey="qtd" fill="#f43f5e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="py-2.5 px-2">Produto</th>
                  <th className="py-2.5 px-2 text-right">Qtd</th>
                  <th className="py-2.5 px-2 text-right">Receita</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 px-2 text-right font-bold text-primary-600">{p.qtd}</td>
                    <td className="py-3 px-2 text-right font-extrabold text-gray-900">
                      {formatCurrency(p.receita)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Alerta de estoque baixo
            </h3>
            <span className="chip bg-red-50 text-red-700 border border-red-200 !py-0.5">
              {estoqueBaixo.length} itens
            </span>
          </div>
          <div className="space-y-2">
            {estoqueBaixo.map((e) => (
              <Link
                key={e.id}
                href="/admin/produtos"
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {e.sku}
                  </p>
                  <p className="font-bold text-gray-900 text-sm line-clamp-1">
                    {e.name}
                  </p>
                  <p className="text-xs text-gray-500">Variante: {e.variante}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 font-bold uppercase">Estoque</p>
                  <p
                    className={`text-2xl font-black ${
                      e.stock <= 2
                        ? 'text-red-600'
                        : e.stock <= 4
                        ? 'text-amber-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {e.stock}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/admin/produtos?filter=lowstock"
            className="btn-outline-primary w-full mt-4 !py-2.5"
          >
            Gerenciar estoque
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Users size={18} />
            Clientes recentes
          </h3>
          <div className="divide-y divide-gray-50 -mx-2">
            {[
              {
                name: 'Ana Carolina Silva',
                email: 'ana@email.com',
                total: 8,
                spent: 2450,
              },
              {
                name: 'Bruno Oliveira',
                email: 'bruno@email.com',
                total: 5,
                spent: 1890,
              },
              {
                name: 'Carla Mendes',
                email: 'carla@email.com',
                total: 12,
                spent: 4320,
              },
              {
                name: 'Diego Souza',
                email: 'diego@email.com',
                total: 3,
                spent: 670,
              },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-brand-500 text-white font-bold flex items-center justify-center shrink-0">
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-gray-900">
                    {formatCurrency(c.spent)}
                  </p>
                  <p className="text-xs text-gray-500">{c.total} pedidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <ShoppingCart size={18} />
            Últimos pedidos
          </h3>
          <div className="space-y-2">
            {[
              {
                num: 'MCSC-20240905-8472',
                cliente: 'Ana Silva',
                total: 429.7,
                status: 'AGUARDANDO_PAGAMENTO',
              },
              {
                num: 'MCSC-20240905-7721',
                cliente: 'Bruno Oliveira',
                total: 249.9,
                status: 'PAGO',
              },
              {
                num: 'MCSC-20240905-6612',
                cliente: 'Carla Mendes',
                total: 890.4,
                status: 'ENVIADO',
              },
              {
                num: 'MCSC-20240905-1299',
                cliente: 'Diego Souza',
                total: 189.9,
                status: 'ENTREGUE',
              },
            ].map((p, i) => (
              <Link
                key={i}
                href="/admin/pedidos"
                className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm">#{p.num}</p>
                  <p className="text-xs text-gray-500">{p.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-gray-900">
                    {formatCurrency(p.total)}
                  </p>
                  <p className="text-xs text-gray-500">{p.status.replace(/_/g, ' ')}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/admin/pedidos"
            className="btn-outline-primary w-full mt-4 !py-2.5"
          >
            Ver todos os pedidos <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}
