import type { Category, Product } from '@/types';

export const categories: Category[] = [
  { id: 'cat-1', slug: 'camisetas', name: 'Camisetas' },
  { id: 'cat-2', slug: 'polos', name: 'Polos' },
  { id: 'cat-3', slug: 'acessorios', name: 'Acessórios' },
  { id: 'cat-4', slug: 'calcados', name: 'Calçados' },
];

// Originais preservados em assets/originals/products/<slug>/.
// Imagens servidas pelo site em public/assets/products/<slug>/01.jpeg, 02.jpeg...
// Correspondência com os nomes recebidos: docs/MANUTENCAO.md.
// As fotos com vários artigos ilustram a camiseta; não representam um kit.

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'polo-verde-oliva',
    name: 'Polo Verde Oliva',
    description: 'Polo masculina em tom verde-oliva, corte reto e tecido confortável. Peça versátil para compor looks casuais ou esportivos.',
    categoryId: 'cat-2',
    priceCents: 8990, // R$ 89,90
    images: [
      '/assets/products/polo-verde-oliva/01.jpeg',
    ],
    featured: true,
    active: true,
    variants: [
      { id: 'var-1-1', color: 'Verde Oliva', size: 'P', availability: 'available' },
      { id: 'var-1-2', color: 'Verde Oliva', size: 'M', availability: 'available' },
      { id: 'var-1-3', color: 'Verde Oliva', size: 'G', availability: 'available' },
      { id: 'var-1-4', color: 'Verde Oliva', size: 'GG', availability: 'unavailable' },
    ],
  },
  {
    id: 'prod-2',
    slug: 'camiseta-amarela',
    name: 'Camiseta Amarela Estampada',
    description: 'Camiseta amarela com estampa exclusiva. Modelagem regular, algodão macio. Foto mostra composição com acessórios (não inclusos).',
    categoryId: 'cat-1',
    priceCents: 5990, // R$ 59,90
    images: [
      '/assets/products/camiseta-amarela/01.jpeg',
      '/assets/products/camiseta-amarela/02.jpeg',
    ],
    featured: true,
    active: true,
    variants: [
      { id: 'var-2-1', color: 'Amarelo', size: 'P', availability: 'available' },
      { id: 'var-2-2', color: 'Amarelo', size: 'M', availability: 'available' },
      { id: 'var-2-3', color: 'Amarelo', size: 'G', availability: 'unavailable' },
      { id: 'var-2-4', color: 'Amarelo', size: 'GG', availability: 'unavailable' },
    ],
  },
  {
    id: 'prod-3',
    slug: 'camiseta-caramelo',
    name: 'Camiseta Caramelo',
    description: 'Camiseta em tom caramelo/marrom, tecido premium. Visual clean e atemporal. Foto inclui calçados e acessórios (vendidos separadamente).',
    categoryId: 'cat-1',
    priceCents: 6990, // R$ 69,90
    images: [
      '/assets/products/camiseta-caramelo/01.jpeg',
    ],
    featured: true,
    active: true,
    variants: [
      { id: 'var-3-1', color: 'Caramelo', size: 'P', availability: 'available' },
      { id: 'var-3-2', color: 'Caramelo', size: 'M', availability: 'available' },
      { id: 'var-3-3', color: 'Caramelo', size: 'G', availability: 'available' },
      { id: 'var-3-4', color: 'Caramelo', size: 'GG', availability: 'available' },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug && p.active);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId && p.active);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured && p.active);
}

export function searchProducts(query: string): Product[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return products.filter(p => p.active);
  return products.filter(p =>
    p.active &&
    (p.name.toLowerCase().includes(normalized) ||
      p.description?.toLowerCase().includes(normalized) ||
      p.categoryId.toLowerCase().includes(normalized))
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getVariant(productId: string, variantId: string): Product['variants'][0] | undefined {
  const product = products.find(p => p.id === productId);
  return product?.variants.find(v => v.id === variantId);
}
