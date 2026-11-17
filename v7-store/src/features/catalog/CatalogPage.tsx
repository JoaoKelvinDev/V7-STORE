'use client';

import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/shared/ProductCard';
import { products, categories, searchProducts, getCategoryBySlug } from '@/data/catalog';
import { ArrowLeft, Search, PackageSearch } from 'lucide-react';

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
    <div className="store-shell store-flow">
      <Link to="/" className="back-link pressable"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao início</Link>
      <div className="store-page-heading">
        <h1>Catálogo {activeCategory ? `— ${activeCategory.name}` : ''}</h1>
        <p>Encontre a peça que combina com você. Escolha para ver fotos, cores e tamanhos.</p>
      </div>
      <div className="store-catalog-tools">
      <label className="store-search">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          aria-label="Buscar produtos"
          placeholder="Buscar produtos"
          inputMode="search"
          enterKeyHint="search"
          className="py-3 placeholder:text-muted-foreground"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </label>
      <div className="store-filter-row" role="group" aria-label="Filtrar catálogo">
        {["Todos", ...categories.map(c => c.name)].map((c, i) => (
          <button
            key={c}
            type="button"
            aria-pressed={i === 0 ? !selectedCategory : selectedCategory === categories[i - 1]?.slug}
            onClick={() => handleCategoryChange(i === 0 ? '' : categories[i - 1]?.slug || '')}
            className="store-filter"
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={showAvailableOnly}
          onClick={() => handleAvailabilityChange(!showAvailableOnly)}
          className="store-filter"
        >
          Disponíveis
        </button>
      </div>
      </div>
      <p className="store-results-count mb-5" role="status">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'peça encontrada' : 'peças encontradas'}
      </p>
      <div className="store-product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="store-empty-state">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          <h2>Nenhum produto encontrado</h2>
          <p>
            {searchQuery || selectedCategory || showAvailableOnly
              ? 'Tente ajustar os filtros ou a busca.'
              : 'O catálogo está vazio no momento.'}
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="store-button store-button-primary">
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
