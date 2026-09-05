'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart, badge: 3 },
  { href: '/admin/cupons', label: 'Cupons', icon: Tag },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isStaff =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'VENDEDOR';

  React.useEffect(() => {
    if (status === 'authenticated' && !isStaff) {
      router.replace('/');
    } else if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/admin');
    }
  }, [status, isStaff, router]);

  if (status !== 'authenticated' || !isStaff) {
    return (
      <div className="container-pad py-20 text-center">
        <p className="text-gray-500">Verificando permissões...</p>
      </div>
    );
  }

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)]">
      <div className="container-pad py-4 lg:py-6">
        <div className="flex lg:hidden items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Store size={22} className="text-primary-500" />
            Painel Admin
          </h1>
          <div className="flex items-center gap-2">
            <button className="relative btn-ghost !p-2.5 min-h-[44px] min-w-[44px]">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="btn-secondary !p-2.5 min-h-[44px] min-w-[44px]"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 lg:gap-8">
          <aside className="hidden lg:block card h-fit sticky top-28 overflow-hidden">
            <div className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-brand-600 flex items-center justify-center text-xl font-black shadow-lg">
                  M
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold truncate leading-tight">
                    {session.user.name}
                  </p>
                  <p className="text-[11px] opacity-80 uppercase tracking-wide font-semibold">
                    {session.user.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}
                  </p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition min-h-[48px] mb-1 relative',
                    isActive(it.href, it.exact)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <it.icon size={18} />
                  {it.label}
                  {it.badge ? (
                    <span className="ml-auto w-6 h-6 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center">
                      {it.badge}
                    </span>
                  ) : null}
                  <ChevronRight
                    size={14}
                    className="ml-auto text-gray-400 sm:hidden"
                  />
                </Link>
              ))}
              <div className="mt-2 pt-3 border-t border-gray-100 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 min-h-[48px]"
                >
                  <Store size={18} />
                  Ver loja
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 min-h-[48px]"
                >
                  <LogOut size={18} />
                  Sair
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
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Store size={20} />
                    Painel Admin
                  </h2>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center min-h-[48px] min-w-[48px]"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <p className="font-extrabold">{session.user.name}</p>
                  <p className="text-[11px] opacity-80 uppercase tracking-wide font-semibold">
                    {session.user.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}
                  </p>
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
                  <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 min-h-[48px]"
                    >
                      <Store size={18} />
                      Ver loja
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 min-h-[48px]"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </div>
                </nav>
              </aside>
            </div>
          )}

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
