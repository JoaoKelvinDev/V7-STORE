'use client';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { Product } from '@/types';
import { Link, useLocation } from 'react-router-dom';
import type { CSSProperties } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Posição na grade, usada para a entrada em cascata. */
  index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const { pathname, search } = useLocation();
  const catalogUrl = pathname === '/catalogo' ? `${pathname}${search}` : '/catalogo';

  return (
    <Link
      to={`/produto/${product.slug}`}
      state={{ catalogUrl }}
      aria-label={`Ver detalhes de ${product.name}`}
      className="product-card-link block min-w-0 rounded-lg"
    >
    <Card
      className={cn(
        'product-card stagger-in flex h-full min-w-0 flex-col gap-3 overflow-hidden rounded-xl py-0 shadow-none sm:gap-4',
        className,
      )}
      style={{ '--i': index } as CSSProperties}
    >
      <CardContent className="flex flex-1 flex-col gap-3 px-0 sm:gap-4">
        <div className="product-photo-link aspect-square shrink-0 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image"
            style={{ objectPosition: product.cardImagePosition ?? 'center' }}
            loading="lazy"
            width={400}
            height={400}
          />
        </div>
        <div className="flex flex-1 flex-col px-3 sm:px-4">
          <h2 className="mb-2 min-h-[2.5rem] text-sm font-medium leading-snug text-balance sm:text-base">{product.name}</h2>
          <div className="mt-auto flex items-baseline gap-2">
            <p className="text-sm font-semibold sm:text-base">
              {product.priceCents !== null ? formatPrice(product.priceCents) : 'Valor a confirmar'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
        <span
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11 w-full rounded-lg px-3 text-sm group-hover/card:border-primary/60')}
        >
          Ver detalhes
        </span>
      </CardFooter>
    </Card>
    </Link>
  );
}
