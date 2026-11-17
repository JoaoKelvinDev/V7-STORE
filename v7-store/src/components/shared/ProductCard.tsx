import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatPrice } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  className?: string;
  headingLevel?: 2 | 3;
}

const tags: Record<string, string> = {
  'polo-verde-oliva': 'Novo',
  'camiseta-amarela': 'Estampa',
  'camiseta-caramelo': 'Básico',
};

export function ProductCard({ product, className, headingLevel = 2 }: ProductCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const { pathname, search } = useLocation();
  const catalogUrl = pathname === '/catalogo' ? `${pathname}${search}` : '/catalogo';
  const available = product.variants.some(variant => variant.availability === 'available');
  const tag = available ? tags[product.slug] : 'Indisponível';

  return (
    <Link to={`/produto/${product.slug}`} state={{ catalogUrl }} aria-label={`Ver detalhes de ${product.name}`} className={cn('refresh-product-card', className)}>
      <div className="refresh-product-media">
        <img src={product.images[0]} alt={product.name} width={600} height={750} loading="lazy" style={{ objectPosition: product.cardImagePosition ?? 'center' }} />
        {tag && <span className="refresh-product-tag">{tag}</span>}
        <span className="refresh-product-cta">Ver detalhes<ArrowUpRight size={17} aria-hidden="true" /></span>
      </div>
      <div className="refresh-product-meta">
        <Heading>{product.name}</Heading>
        <p className="refresh-display">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
