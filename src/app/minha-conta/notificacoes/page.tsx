'use client';

import * as React from 'react';
import useSWR from 'swr';
import {
  Bell,
  Package,
  Tag,
  Heart,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null));

const tipoMap: any = {
  pedido: { icon: Package, color: 'bg-blue-100 text-blue-700' },
  promocao: { icon: Tag, color: 'bg-primary-100 text-primary-700' },
  estoque: { icon: Heart, color: 'bg-rose-100 text-rose-700' },
  sistema: { icon: Bell, color: 'bg-amber-100 text-amber-700' },
};

const mockNotifications = [
  {
    id: '1',
    tipo: 'pedido',
    title: 'Pedido #MCSC-20240905-8472 foi enviado!',
    desc: 'Seu pedido saiu para entrega e chegará em até 3 dias úteis.',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    link: '/minha-conta/pedidos/MCSC-20240905-8472',
  },
  {
    id: '2',
    tipo: 'promocao',
    title: '🔥 Black Friday começou!',
    desc: 'Até 70% de desconto em peças selecionadas. Vai perder essa?',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    link: '/promocoes',
  },
  {
    id: '3',
    tipo: 'estoque',
    title: 'Produto da sua lista voltou!',
    desc: 'Jaqueta de Couro Masculina voltou ao estoque no tamanho G.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
    link: '/produto/jaqueta-couro-masculina',
  },
  {
    id: '4',
    tipo: 'pedido',
    title: 'Pedido entregue com sucesso!',
    desc: 'Seu pedido #MCSC-20240903-2211 foi entregue. Obrigado pela preferência 💜',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    read: true,
    link: '/minha-conta/pedidos/MCSC-20240903-2211',
  },
  {
    id: '5',
    tipo: 'sistema',
    title: 'Sua conta está quase completa!',
    desc: 'Ative a verificação em duas etapas para mais segurança.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
    link: '/minha-conta/configuracoes',
  },
];

export default function NotificacoesPage() {
  const { data: prefs, mutate } = useSWR('/api/user/prefs', fetcher, { onErrorRetry: () => {} });
  const [filter, setFilter] = React.useState<string>('TODAS');
  const [notifications, setNotifications] = React.useState<any[]>(mockNotifications);

  const filtros = ['TODAS', 'NAO_LIDAS', 'pedido', 'promocao', 'estoque'];
  const filtroLabel: any = {
    TODAS: 'Todas',
    NAO_LIDAS: 'Não lidas',
    pedido: 'Pedidos',
    promocao: 'Promoções',
    estoque: 'Estoque',
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'TODAS') return true;
    if (filter === 'NAO_LIDAS') return !n.read;
    return n.tipo === filter;
  });

  const naoLidas = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('Todas marcadas como lidas!');
  };
  const limpar = () => {
    if (!confirm('Limpar todas as notificações?')) return;
    setNotifications([]);
    toast.success('Notificações limpas!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Bell size={24} />
          Notificações
          {naoLidas > 0 && (
            <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-sm font-black flex items-center justify-center">
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {naoLidas > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="btn-secondary !py-2 !px-3 text-xs min-h-[40px]"
            >
              <CheckCheck size={14} />
              Marcar todas lidas
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={limpar}
              className="btn-danger !py-2 !px-3 text-xs min-h-[40px]"
            >
              <Trash2 size={14} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {prefs && (
        <div className="card p-4 sm:p-5 bg-blue-50/50 border-blue-200 space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Filter size={16} className="text-blue-600" />
            Preferências de notificações
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { key: 'pushStatus', label: 'Push: status de pedidos' },
              { key: 'pushPromos', label: 'Push: promoções' },
              { key: 'pushWishlist', label: 'Push: produtos da lista de desejos' },
              { key: 'emailStatus', label: 'E-mail: status de pedidos' },
              { key: 'emailPromos', label: 'E-mail: promoções e novidades' },
            ].map((t) => (
              <label
                key={t.key}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-gray-100 cursor-pointer min-h-[56px]"
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{t.label}</span>
                <input
                  type="checkbox"
                  checked={(prefs as any)[t.key] ?? true}
                  onChange={(e) => {
                    fetch('/api/user/prefs', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ [t.key]: e.target.checked }),
                    }).then(() => {
                      mutate();
                      toast.success('Preferência atualizada');
                    });
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded text-primary-500 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {filtros.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition min-h-[44px] ${
              filter === f
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {filtroLabel[f]}
            {f === 'NAO_LIDAS' && naoLidas > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {naoLidas}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card p-10 text-center space-y-3">
            <Bell size={44} className="mx-auto text-gray-300" />
            <h3 className="font-bold text-gray-900">Nada por aqui ainda</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Assim que houverem novidades (atualizações de pedido, promoções, estoque),
              você verá aqui.
            </p>
          </div>
        )}
        {filtered.map((n) => {
          const tipo = tipoMap[n.tipo] || tipoMap.sistema;
          const Icon = tipo.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`card p-4 sm:p-5 flex gap-3 sm:gap-4 cursor-pointer transition hover:shadow-md ${
                !n.read ? 'ring-2 ring-primary-100 border-primary-200 bg-primary-50/30' : ''
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${tipo.color} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <p className="font-bold text-gray-900">{n.title}</p>
                  <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                    {timeAgo(n.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.desc}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-500"
                  >
                    {n.read ? (
                      <>
                        <CheckCheck size={12} /> Lida
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-primary-500" /> Não lida
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}
