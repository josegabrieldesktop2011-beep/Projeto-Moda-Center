'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarsRating({
  rating,
  size = 16,
  onChange,
  readOnly = false,
  className = '',
}: {
  rating: number;
  size?: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(rating);
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className={cn(
              'p-0.5 transition-transform',
              !readOnly && 'hover:scale-110 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center'
            )}
            aria-label={`${n} estrelas`}
          >
            <Star
              size={size}
              fill={filled ? '#eab308' : 'transparent'}
              className={filled ? 'text-gold-500' : 'text-gray-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
