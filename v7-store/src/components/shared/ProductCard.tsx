'use client';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { Product } from '@/types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card
      className={cn(
        'product-card flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none',
        className,
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-4 px-4">
        <Link to={`/produto/${product.slug}`} className="product-photo-link aspect-[4/5] overflow-hidden rounded-md" aria-label={`Ver ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image size-full rounded-md object-cover"
            loading="lazy"
            width={400}
            height={500}
          />
        </Link>
        <div className="flex flex-1 flex-col">
          <h2 className="mb-1 font-medium text-balance"><Link to={`/produto/${product.slug}`}>{product.name}</Link></h2>
          <div className="mt-auto flex items-baseline gap-2">
            <p className="font-semibold">
              {product.priceCents !== null ? formatPrice(product.priceCents) : 'Valor a confirmar'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-3 pt-0 bg-transparent border-t-0">
        <Link
          to={`/produto/${product.slug}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 w-full px-3 text-sm')}
        >
          Ver detalhes
        </Link>
      </CardFooter>
    </Card>
  );
}
