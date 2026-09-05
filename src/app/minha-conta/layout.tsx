'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  Heart,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/minha-conta', label: 'Início', icon: Home, exact: true },
  { href: '/minha-conta/pedidos', label: 'Meus Pedidos', icon: Package },
  { href: '/minha-conta/enderecos', label: 'Endereços', icon: MapPin },
  { href: '/minha-conta/cartoes', label: 'Cartões', icon: CreditCard },
  { href: '/lista-desejos', label: 'Lista de Desejos', icon: Heart },
  { href: '/minha-conta/notificacoes', label: 'Notificações', icon: Bell },
  { href: '/minha-conta/configuracoes', label: 'Configurações', icon: Settings },
];

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=' + pathname);
    }
  }, [status, pathname, router]);

  if (status !== 'authenticated' || !session) {
    return (
      <div className="container-pad py-20 text-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)]">
      <div className="container-pad py-6 lg:py-10">
        <div className="flex lg:hidden items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <User size={22} />
            Minha Conta
          </h1>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="btn-secondary !p-2.5 min-h-[44px] min-w-[44px]"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <aside className="hidden lg:block card h-fit sticky top-28 overflow-hidden">
            <div className="p-5 bg-gradient-to-br from-primary-500 to-brand-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black shrink-0">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold truncate">{session.user.name}</p>
                  <p className="text-xs opacity-90 truncate">{session.user.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition min-h-[48px] mb-1',
                    isActive(it.href, it.exact)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <it.icon size={18} />
                  {it.label}
                  <ChevronRight
                    size={14}
                    className="ml-auto text-gray-400"
                  />
                </Link>
              ))}
              <div className="mt-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 min-h-[48px]"
                >
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </div>
            </nav>
          </aside>

          {menuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={() => setMenuOpen(false)}
              />
              <aside className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slide-up overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
                  <h2 className="font-bold text-gray-900 text-lg">Minha Conta</h2>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center min-h-[48px] min-w-[48px]"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 bg-gradient-to-br from-primary-500 to-brand-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-black">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold truncate">{session.user.name}</p>
                      <p className="text-xs opacity-90 truncate">{session.user.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {navItems.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition min-h-[48px]',
                        isActive(it.href, it.exact)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <it.icon size={18} />
                      {it.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 min-h-[48px]"
                  >
                    <LogOut size={18} />
                    Sair da conta
                  </button>
                </nav>
              </aside>
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
