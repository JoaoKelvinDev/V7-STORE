'use client';

import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/shared/ProductCard';
import { products, categories, searchProducts, getCategoryBySlug } from '@/data/catalog';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/utils/helpers';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('busca') || '';
  const selectedCategory = searchParams.get('categoria') || '';
  const showAvailableOnly = searchParams.get('disponivel') === 'true';

  const setSearchQuery = (query: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (query) next.set('busca', query);
      else next.delete('busca');
      return next;
    }, { replace: true });
  };

  const handleCategoryChange = (slug: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (slug) next.set('categoria', slug);
      else next.delete('categoria');
      return next;
    });
  };

  const handleAvailabilityChange = (value: boolean) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set('disponivel', 'true');
      else next.delete('disponivel');
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || showAvailableOnly;

  const filteredProducts = useMemo(() => {
    let result = searchQuery.trim() ? searchProducts(searchQuery) : products.filter(p => p.active);

    if (selectedCategory) {
      const cat = getCategoryBySlug(selectedCategory);
      result = result.filter(p => p.categoryId === cat?.id);
    }

    if (showAvailableOnly) {
      result = result.filter(p => p.variants.some(v => v.availability === 'available'));
    }

    return result;
  }, [selectedCategory, searchQuery, showAvailableOnly]);

  const activeCategory = selectedCategory ? getCategoryBySlug(selectedCategory) : null;

  return (
    <div className="container py-5 sm:py-8">
      <Link to="/" className="back-link pressable mb-5"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao início</Link>
      <h1 className="text-2xl font-extrabold sm:text-3xl">
        Catálogo {activeCategory ? `— ${activeCategory.name}` : ''}
      </h1>
      <label className="mt-5 flex items-center gap-2 rounded-lg border border-input bg-card px-3 focus-within:border-primary">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          aria-label="Buscar produtos"
          placeholder="Buscar produtos"
          inputMode="search"
          enterKeyHint="search"
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </label>
      <div className="scrollbar-hide -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {["Todos", ...categories.map(c => c.name)].map((c, i) => (
          <button
            key={c}
            type="button"
            aria-pressed={i === 0 ? !selectedCategory : selectedCategory === categories[i - 1]?.slug}
            onClick={() => handleCategoryChange(i === 0 ? '' : categories[i - 1]?.slug || '')}
            className={cn(
              'pressable min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
              (i === 0 ? !selectedCategory : selectedCategory === categories[i - 1]?.slug)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={showAvailableOnly}
          onClick={() => handleAvailabilityChange(!showAvailableOnly)}
          className={cn(
            'pressable min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
            showAvailableOnly
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          Disponíveis
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="reveal card p-12 text-center mt-6">
          <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedCategory || showAvailableOnly
              ? 'Tente ajustar os filtros ou a busca.'
              : 'O catálogo está vazio no momento.'}
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="pressable min-h-11 rounded-lg px-4 text-sm font-semibold text-primary hover:bg-primary/10">
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
