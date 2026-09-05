import { prisma } from '@/lib/prisma';
import { HeroCarousel, type CarouselSlide } from '@/components/ui/HeroCarousel';
import { ProductCard } from '@/components/products/ProductCard';
import {
  Shirt,
  Baby,
  Tag,
  ArrowRight,
  Sparkles,
  Gift,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

const bgPrompt = (p: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    p
  )}&image_size=landscape_16_9`;

export default async function HomePage() {
  const [categorias, produtos] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 20,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        images: { take: 1, orderBy: { position: 'asc' } },
        variants: true,
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true }, take: 50 },
      },
    }),
  ]);

  const slides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Black Friday Moda Center',
      subtitle: 'Até 70% de desconto em peças selecionadas. Corre que acabam!',
      cta: 'Ver Ofertas',
      href: '/promocoes',
      image: bgPrompt('black friday moda feminina masculina fundo vermelho e dourado fotografia profissional'),
      bg: 'bg-gradient-to-r from-primary-700 to-brand-700',
      text: 'text-white',
    },
    {
      id: '2',
      title: 'Nova Coleção Verão',
      subtitle: 'Cores vibrantes, tecidos leves. Tudo para arrasar no calor.',
      cta: 'Conferir Coleção',
      href: '/produtos?categoria=feminino',
      image: bgPrompt('colecao verao moda praia roupas coloridas fundo tropical fotografia de campanha'),
      bg: 'bg-gradient-to-r from-brand-500 to-primary-500',
      text: 'text-white',
    },
    {
      id: '3',
      title: 'Frete Grátis para RS',
      subtitle: 'Em compras acima de R$ 199. Entrega rápida para todo o estado.',
      cta: 'Comprar Agora',
      href: '/produtos',
      image: bgPrompt('caixa de entrega de encomenda caminhao entrega sorriso fundo azul claro'),
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      text: 'text-white',
    },
  ];

  const categoriaIcons = [Shirt, TrendingUp, Baby, Tag, Sparkles, Gift];

  const produtosDestaque = produtos
    .map((p: any) => {
      const avg = p.reviews.length
        ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length
        : 0;
      const colorsMap = new Map();
      p.variants.forEach((v: any) => {
        if (!colorsMap.has(v.color)) colorsMap.set(v.color, v.colorHex);
      });
      const firstAvailable =
        p.variants.find((v: any) => v.stock > 0) || p.variants[0];
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        image: p.images[0]?.url || '',
        rating: avg,
        reviewsCount: p._count.reviews,
        colors: Array.from(colorsMap.entries()).map(([color, hex]) => ({
          color,
          hex: (hex as string) || '#CCC',
        })),
        firstVariant: firstAvailable
          ? {
              variantId: firstAvailable.id,
              size: firstAvailable.size,
              color: firstAvailable.color,
              colorHex: firstAvailable.colorHex,
              stock: firstAvailable.stock,
            }
          : undefined,
      };
    })
    .filter((p) => !!p);

  const emPromocao = produtosDestaque.filter((p) => p.discountPrice).slice(0, 8);

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-20 pb-10">
      <section className="container-pad pt-4 sm:pt-6">
        <HeroCarousel slides={slides} />
      </section>

      <section className="container-pad">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categorias.map((cat, i) => {
            const Icon = categoriaIcons[i % categoriaIcons.length];
            return (
              <Link
                key={cat.id}
                href={`/produtos?categoria=${cat.slug}`}
                className="card p-4 sm:p-5 flex flex-col items-center justify-center gap-2 text-center hover:-translate-y-0.5 hover:shadow-md transition-all group min-h-[100px] sm:min-h-[120px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-brand-100 text-primary-600 flex items-center justify-center group-hover:from-primary-500 group-hover:to-brand-600 group-hover:text-white transition-all">
                  <Icon size={24} />
                </div>
                <span className="font-bold text-gray-900 text-sm sm:text-base">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-500">
                  {cat._count.products} produtos
                </span>
              </Link>
            );
          })}
          <Link
            href="/promocoes"
            className="card p-4 sm:p-5 flex flex-col items-center justify-center gap-2 text-center hover:-translate-y-0.5 hover:shadow-md transition-all group bg-gradient-to-br from-primary-50 to-brand-50 border-primary-200 min-h-[100px] sm:min-h-[120px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-brand-600 text-white flex items-center justify-center group-hover:scale-110 transition-all">
              <Tag size={24} />
            </div>
            <span className="font-bold text-primary-700 text-sm sm:text-base">
              Promoções
            </span>
            <span className="text-xs text-primary-600/80">Ofertas do dia</span>
          </Link>
        </div>
      </section>

      <section className="container-pad">
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-primary-500" size={20} />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Em Destaque
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              As peças mais amadas dos nossos clientes
            </p>
          </div>
          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 min-h-[44px]"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {produtosDestaque.slice(0, 10).map((p) => (
            <ProductCard key={p.id} {...(p as any)} />
          ))}
        </div>
        <Link
          href="/produtos"
          className="sm:hidden mt-6 btn-secondary w-full"
        >
          Ver todos os produtos <ArrowRight size={18} />
        </Link>
      </section>

      {emPromocao.length > 0 && (
        <section className="bg-gradient-to-br from-primary-50 via-white to-brand-50 py-10 sm:py-14">
          <div className="container-pad">
            <div className="flex items-end justify-between mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="text-primary-500" size={20} />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Produtos em Promoção
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Descontos imperdíveis por tempo limitado
                </p>
              </div>
              <Link
                href="/promocoes"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 min-h-[44px]"
              >
                Todas as ofertas <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {emPromocao.map((p) => (
                <ProductCard key={p.id} {...(p as any)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-pad">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Gift,
              title: 'Surpresas para membros',
              desc: 'Cadastre-se e ganhe 10% OFF na primeira compra com o cupom BEMVINDO10',
              cta: 'Cadastrar',
              href: '/auth/cadastro',
            },
            {
              icon: Sparkles,
              title: 'Novidades todas as semanas',
              desc: 'Fique por dentro das últimas tendências de moda do Brasil e do mundo.',
              cta: 'Ver novidades',
              href: '/produtos?order=newest',
            },
            {
              icon: TrendingUp,
              title: 'Os mais vendidos',
              desc: 'Confira o top 10 das peças que todo mundo está usando no momento.',
              cta: 'Ver ranking',
              href: '/produtos?order=best_selling',
            },
          ].map((c, i) => (
            <div
              key={i}
              className="card p-6 flex flex-col gap-4 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-brand-600 text-white flex items-center justify-center shadow-md">
                <c.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
              <Link
                href={c.href}
                className="btn-outline-primary !py-2.5 w-fit mt-auto"
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
