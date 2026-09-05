'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  cta?: string;
  bg: string;
  text: string;
}

export function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s) => (
          <div
            key={s.id}
            className={cn(
              'relative w-full shrink-0 aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7] overflow-hidden',
              s.bg
            )}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="100vw"
                className="object-cover opacity-75 sm:opacity-100"
                priority
              />
            </div>
            <div className="relative z-10 h-full w-full flex flex-col justify-end p-5 sm:p-10 lg:p-14 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/50 sm:via-black/20 sm:to-transparent">
              <div className="max-w-lg">
                <h2 className={cn('text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 drop-shadow-md', s.text)}>
                  {s.title}
                </h2>
                {s.subtitle && (
                  <p className={cn('text-sm sm:text-xl mb-4 sm:mb-6 drop-shadow max-w-md', s.text, 'text-white/90')}>
                    {s.subtitle}
                  </p>
                )}
                {s.cta && (
                  <Link
                    href={s.href}
                    className="btn-primary sm:px-8 !py-3 sm:!py-3.5 text-sm sm:text-base w-full sm:w-auto min-h-[52px]"
                  >
                    {s.cta}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center z-20 transition min-h-[48px] min-w-[48px]"
      >
        <ChevronLeft size={22} className="text-gray-900" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center z-20 transition min-h-[48px] min-w-[48px]"
      >
        <ChevronRight size={22} className="text-gray-900" />
      </button>

      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all min-h-[32px] min-w-[32px] flex items-center justify-center',
              i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </div>
  );
}
