'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowRight,
  Grid3X3,
  SearchX,
} from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useFilterStore } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProdutosPageClient() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const filters = useFilterStore();

  const queryCategoria = search.get('categoria');
  const q = search.get('q') || filters.search;
  const order = search.get('order') || filters.orderBy;

  const { data: meta, error: mErr } = useSWR('/api/catalog/meta', fetcher);
  const onSale = pathname.includes('promocoes');

  const buildQuery = (page = 1) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (queryCategoria) params.set('categoria', queryCategoria);
    if (filters.sizes.length) params.set('sizes', filters.sizes.join(','));
    if (filters.colors.length) params.set('colors', filters.colors.join(','));
    if (filters.brands.length) params.set('brands', filters.brands.join(','));
    if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin));
    if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax));
    if (order) params.set('orderBy', order);
    if (onSale) params.set('onSale', 'true');
    params.set('page', String(page));
    params.set('perPage', '24');
    return `/api/products?${params.toString()}`;
  };

  const { data, isLoading, error } = useSWR(buildQuery(), fetcher);

  const [page, setPage] = React.useState(1);
  React.useEffect(() => setPage(1), [q, queryCategoria, order, filters.sizes, filters.colors, filters.brands, filters.priceMin, filters.priceMax, onSale]);

  const ordenacoes = [
    { value: 'relevance', label: 'Mais relevantes' },
    { value: 'newest', label: 'Lançamentos' },
    { value: 'best_selling', label: 'Mais vendidos' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
  ];

  const totalAtivos =
    filters.sizes.length +
    filters.colors.length +
    filters.brands.length +
    (filters.priceMin != null ? 1 : 0) +
    (filters.priceMax != null ? 1 : 0);

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(mobile && 'p-4 space-y-6 overflow-y-auto h-full pb-20')}>
      <div className="flex items-center justify-between sm:mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Filtros
        </h3>
        {totalAtivos > 0 && (
          <button
            type="button"
            onClick={() => filters.reset()}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 min-h-[32px]"
          >
            Limpar ({totalAtivos})
          </button>
        )}
      </div>

      {meta?.sizes?.length && (
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Tamanho</h4>
          <div className="flex flex-wrap gap-2">
            {meta.sizes.map((s: string) => (
              <button
                key={s}
                type="button"
                onClick={() => filters.toggleSize(s)}
                className={cn(
                  'min-w-[44px] min-h-[44px] px-3 rounded-xl border-2 text-sm font-semibold transition',
                  filters.sizes.includes(s)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {meta?.brands?.length && (
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Marcas</h4>
          <div className="flex flex-wrap gap-2">
            {meta.brands.map((b: string) => (
              <button
                key={b}
                type="button"
                onClick={() => filters.toggleBrand(b)}
                className={cn(
                  'px-3 py-2 rounded-xl border-2 text-xs font-semibold transition min-h-[44px]',
                  filters.brands.includes(b)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Faixa de preço</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mínimo"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              filters.setPriceMin(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="input !min-h-[44px] !text-sm"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máximo"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              filters.setPriceMax(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="input !min-h-[44px] !text-sm"
          />
        </div>
      </div>

      {mobile && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-gray-200 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full"
          >
            Ver {data?.products?.length || 0} produtos
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-pad py-6 lg:py-8">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          {onSale ? '🔥 Promoções' : queryCategoria ? meta?.categories?.find((c: any) => c.slug === queryCategoria)?.name + ' - Moda Center' : 'Todos os Produtos'}
        </h1>
        <p className="text-sm text-gray-500">
          {!isLoading && data?.products?.length >= 0
            ? `${data?.pagination?.total || 0} produtos encontrados`
            : 'Carregando produtos...'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-secondary lg:hidden !py-2.5 !px-4 text-sm"
        >
          <Filter size={18} />
          Filtros
          {totalAtivos > 0 && (
            <span className="bg-primary-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">
              {totalAtivos}
            </span>
          )}
        </button>

        <div className="flex-1 min-w-[200px] max-w-sm ml-auto">
          <div className="relative">
            <select
              value={order}
              onChange={(e) => {
                filters.setOrderBy(e.target.value);
                const p = new URLSearchParams(search);
                if (e.target.value === 'relevance') p.delete('order');
                else p.set('order', e.target.value);
                router.replace(`${pathname}${p.toString() ? '?' + p.toString() : ''}`, { scroll: false });
              }}
              className="input !py-2 !pl-4 !pr-10 appearance-none text-sm cursor-pointer"
            >
              {ordenacoes.map((o) => (
                <option key={o.value} value={o.value}>
                  Ordenar por: {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="hidden lg:block card p-5 h-fit sticky top-28">
          <FilterPanel />
        </aside>

        <div>
          {isLoading && !data && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!isLoading || data) && error && (
            <div className="card p-10 text-center space-y-3">
              <p className="text-red-500 font-semibold">Erro ao carregar produtos.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && data?.products?.length === 0 && (
            <div className="card p-10 text-center space-y-3">
              <SearchX size={48} className="mx-auto text-gray-300" />
              <h3 className="font-bold text-gray-900">Nenhum produto encontrado</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Tente limpar os filtros ou buscar outros termos.
              </p>
              <button
                type="button"
                onClick={() => {
                  filters.reset();
                  router.push('/produtos');
                }}
                className="btn-outline-primary"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {data?.products?.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {data.products.map((p: any) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>

              {data.pagination?.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map(
                    (_, i) => {
                      const pg = Math.max(
                        1,
                        Math.min(
                          data.pagination.totalPages - 4,
                          page - 2
                        )
                      ) + i;
                      if (pg > data.pagination.totalPages) return null;
                      return (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setPage(pg)}
                          className={cn(
                            'w-11 h-11 rounded-xl text-sm font-bold transition min-h-[44px]',
                            pg === page
                              ? 'bg-primary-500 text-white shadow-sm'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-600'
                          )}
                        >
                          {pg}
                        </button>
                      );
                    }
                  )}
                  <button
                    type="button"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Filtrar produtos</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar"
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center min-h-[48px] min-w-[48px]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterPanel mobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
