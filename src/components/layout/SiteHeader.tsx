'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Package,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronDown,
  Phone,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useFilterStore } from '@/lib/store';

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const setFilterSearch = useFilterStore((s) => s.setSearch);

  const isAdminOrSeller =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'VENDEDOR';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterSearch(search);
    setSearchOpen(false);
    router.push(`/produtos${search ? `?q=${encodeURIComponent(search)}` : ''}`);
  };

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/produtos?categoria=feminino', label: 'Feminino' },
    { href: '/produtos?categoria=masculino', label: 'Masculino' },
    { href: '/produtos?categoria=infantil', label: 'Infantil' },
    { href: '/produtos?categoria=acessorios', label: 'Acessórios' },
    { href: '/promocoes', label: 'Promoções', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container-pad">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[48px] min-w-[48px]"
            aria-label="Ir para página inicial"
          >
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-white">
              <Image
                src="/logo.png"
                alt="Logo Moda Center Santa Cruz do Capibaribe"
                width={44}
                height={44}
                priority
                unoptimized
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">Moda Center</span>
              <span className="text-xs font-medium text-primary-600">Santa Cruz do Capibaribe</span>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            className={cn(
              'hidden lg:flex flex-1 max-w-xl mx-4',
              searchOpen && '!fixed !inset-0 !z-[60] !max-w-none !flex-col !p-4 !bg-white !mx-0'
            )}
          >
            {searchOpen && (
              <div className="flex items-center justify-between mb-3 lg:hidden">
                <span className="font-semibold">Buscar produtos</span>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="min-h-[48px] px-4 text-gray-600"
                  aria-label="Fechar busca"
                >
                  <X size={22} />
                </button>
              </div>
            )}
            <div className="relative w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar roupas, marcas, tamanhos..."
                className="input pl-12 pr-4 min-h-[48px]"
                aria-label="Pesquisar produtos"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Abrir busca"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden btn-ghost !p-2.5 !min-h-[44px] !min-w-[44px]"
            >
              <Search size={22} />
            </button>

            <Link
              href="/lista-desejos"
              aria-label="Lista de desejos"
              className="btn-ghost !p-2.5 relative !min-h-[44px] !min-w-[44px]"
            >
              <Heart size={22} />
            </Link>

            <Link
              href="/carrinho"
              aria-label="Carrinho de compras"
              className="btn-ghost !p-2.5 relative !min-h-[44px] !min-w-[44px]"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {status === 'authenticated' ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="Abrir menu do usuário"
                  className="btn-ghost !p-2 !min-h-[44px] !min-w-[44px]"
                >
                  {session.user.avatarUrl ? (
                    <Image
                      src={session.user.avatarUrl}
                      width={32}
                      height={32}
                      className="rounded-full object-cover w-8 h-8"
                      alt="Foto"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-brand-600 text-white flex items-center justify-center text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <ChevronDown size={16} className="hidden sm:block text-gray-500" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden animate-fade-in z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-primary-50 to-brand-50">
                      <p className="font-bold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{session.user.email}</p>
                    </div>
                    <div className="py-2">
                      {isAdminOrSeller && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 min-h-[48px]"
                        >
                          <LayoutDashboard size={18} className="text-brand-600" />
                          <span className="font-medium">Painel Administrativo</span>
                        </Link>
                      )}
                      <Link
                        href="/minha-conta"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 min-h-[48px]"
                      >
                        <User size={18} className="text-primary-600" />
                        <span className="font-medium">Minha Conta</span>
                      </Link>
                      <Link
                        href="/minha-conta/pedidos"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 min-h-[48px]"
                      >
                        <Package size={18} className="text-blue-600" />
                        <span className="font-medium">Meus Pedidos</span>
                      </Link>
                      <Link
                        href="/minha-conta/configuracoes"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 min-h-[48px]"
                      >
                        <Settings size={18} className="text-gray-600" />
                        <span className="font-medium">Configurações</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut().then(() => toast.success('Deslogado com sucesso!'));
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 min-h-[48px] border-t border-gray-100"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                aria-label="Entrar na conta"
                className="btn-ghost !p-2.5 sm:!px-4 !min-h-[44px] sm:!gap-2"
              >
                <User size={22} />
                <span className="hidden sm:inline font-semibold">Entrar</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="lg:hidden btn-ghost !p-2.5 !min-h-[44px] !min-w-[44px]"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 h-12 -mt-2 overflow-x-auto hide-scrollbar">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-4 h-10 rounded-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors',
                l.highlight
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 -mx-4 px-4 py-3 animate-slide-up">
            <nav className="flex flex-col gap-1 pb-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'px-3 py-3.5 rounded-xl text-base font-semibold flex items-center justify-between min-h-[48px]',
                    l.highlight
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50 text-gray-800'
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-gray-100">
              <a
                href="tel:08000800800"
                className="flex items-center gap-3 px-3 py-3.5 text-sm font-medium min-h-[48px]"
              >
                <Phone size={18} className="text-green-600" />
                0800 080 0800
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
