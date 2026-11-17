'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSizePicker, createVariantOptions, findMatchingVariant } from '@/components/shared/VariantSelect';
import { categories, getProductBySlug } from '@/data/catalog';
import type { Product } from '@/types';
import { NotFoundPage } from '@/features/catalog/NotFoundPage';
import { useCart } from '@/app/providers/CartProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { formatPrice, hapticTap } from '@/utils/helpers';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  return product ? <ProductDetails key={product.id} product={product} /> : <NotFoundPage />;
}

function ProductDetails({ product }: { product: Product }) {
  const { state: navigationState } = useLocation();
  const catalogUrl = typeof navigationState?.catalogUrl === 'string' && /^\/catalogo(?:\?|$)/.test(navigationState.catalogUrl)
    ? navigationState.catalogUrl : '/catalogo';
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();

  const initialVariant = product.variants.find(v => v.availability === 'available') ?? product.variants[0];
  const [selectedColor, setSelectedColor] = useState(initialVariant?.color ?? '');
  const [selectedSize, setSelectedSize] = useState(initialVariant?.size ?? '');
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [colorError, setColorError] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(0);

  // Mantém o "Adicionado" visível por um instante e depois volta ao normal.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(0), 1400);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const { colors, sizes } = useMemo(() => createVariantOptions(product.variants), [product.variants]);
  const matchedVariant = useMemo(
    () => findMatchingVariant(product.variants, selectedColor, selectedSize),
    [product.variants, selectedColor, selectedSize]
  );
  const isVariantAvailable = matchedVariant?.availability === 'available';
  const inCartQuantity = matchedVariant ? getItemQuantity(product.id, matchedVariant.id) : 0;
  const category = categories.find(c => c.id === product.categoryId)?.name;
  const sizeOptions = sizes.map(size => ({
    ...size,
    disabled: !product.variants.some(v => (v.color ?? '') === selectedColor && v.size === size.value && v.availability === 'available'),
  }));

  const handleAddToCart = async () => {
    setColorError('');
    setSizeError('');

    if (!selectedColor && colors.length > 0) {
      setColorError('Selecione uma cor');
      return;
    }
    if (!selectedSize && sizes.length > 0) {
      setSizeError('Selecione um tamanho');
      return;
    }
    if (!matchedVariant || matchedVariant.availability === 'unavailable') {
      showToast({ type: 'error', message: 'Esta combinação não está disponível' });
      return;
    }

    setIsAdding(true);
    try {
      addItem(product.id, matchedVariant.id, quantity);
      setJustAdded(n => n + 1);
      hapticTap();
      showToast({
        type: 'success',
        message: `${product.name} adicionado ao carrinho`,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-details container">
      <Link to={catalogUrl} className="back-link pressable mb-4 min-h-11">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar ao catálogo
      </Link>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 md:grid-rows-[auto_1fr] md:items-start md:gap-x-8 md:gap-y-6">
        <div className="min-w-0 md:col-start-1 md:row-span-2 md:row-start-1">
          <div className="product-gallery-frame">
            <img key={selectedImage} src={selectedImage} alt={product.name} className="gallery-photo" width={800} height={1000} loading="eager" />
          </div>
          {product.images.length > 1 && (
            <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto pb-1 [justify-content:safe_center]" aria-label="Galeria do produto">
              {product.images.map((image, index) => (
                <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`Ver foto ${index + 1}`} aria-pressed={selectedImage === image} className="shrink-0 overflow-hidden rounded-lg border border-border p-1 opacity-70 hover:opacity-100 aria-pressed:border-primary aria-pressed:opacity-100 aria-pressed:ring-2 aria-pressed:ring-primary/30">
                  <img src={image} alt="" className="h-12 w-10 bg-black/20 object-contain md:h-20 md:w-16" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="order-first min-w-0 md:order-none md:col-start-2 md:row-start-1">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{category}</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{formatPrice(product.priceCents)}</p>
          <p className={`mt-1 text-sm ${isVariantAvailable ? 'text-green-400' : 'text-destructive'}`}>{isVariantAvailable ? '● Disponível' : 'Indisponível'}</p>
        </div>
        <div className="min-w-0 space-y-5 md:col-start-2 md:row-start-2 md:space-y-6">
          <ColorSizePicker
            colors={colors}
            sizes={sizeOptions}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={(color: string) => {
              setSelectedColor(color);
              setColorError('');
              if (sizes.length > 0) {
                const variant = findMatchingVariant(product.variants, color, selectedSize);
                if (!variant || variant.availability === 'unavailable') {
                  const availableSize = sizes.find(s => {
                    const v = findMatchingVariant(product.variants, color, s.value);
                    return v && v.availability === 'available';
                  });
                  if (availableSize) setSelectedSize(availableSize.value);
                }
              }
            }}
            onSizeChange={(size: string) => {
              setSelectedSize(size);
              setSizeError('');
            }}
            colorError={colorError}
            sizeError={sizeError}
          />
          <div>
            <p className="mb-2 text-sm font-bold">Quantidade</p>
            <div className="inline-flex items-center rounded-lg border border-border">
              <button
                type="button"
                aria-label="Diminuir"
                className="grid h-11 w-11 place-items-center rounded-l-lg hover:bg-secondary disabled:opacity-40"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-10 overflow-hidden text-center font-bold tabular-nums" aria-live="polite">
                <span key={quantity} className="qty-tick">{quantity}</span>
              </span>
              <button
                type="button"
                aria-label="Aumentar"
                className="grid h-11 w-11 place-items-center rounded-r-lg hover:bg-secondary disabled:opacity-40"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                disabled={quantity >= 99}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="product-purchase-bar">
          <Button
            size="lg"
            className={`min-h-12 w-full gap-2 whitespace-normal px-3 py-3 text-sm font-bold leading-tight sm:text-base ${justAdded ? 'bg-[hsl(var(--success))] text-background hover:bg-[hsl(var(--success))]' : ''}`}
            onClick={handleAddToCart}
            disabled={!isVariantAvailable || isAdding}
          >
            {justAdded ? (
              <span key={justAdded} className="animate-pop inline-flex items-center gap-2">
                <Check className="check-draw h-5 w-5" strokeWidth={3} aria-hidden="true" />
                Adicionado ao carrinho
              </span>
            ) : isAdding ? 'Adicionando...' : inCartQuantity > 0 ? 'Adicionar mais ao carrinho' : 'Adicionar ao carrinho'}
          </Button>
          <Link to="/carrinho" aria-label="Ver carrinho" className="pressable grid h-12 w-12 place-items-center rounded-lg border border-border hover:border-primary hover:bg-secondary"><ShoppingBag className="h-5 w-5" aria-hidden="true" /></Link>
          </div>
          <section className="product-description min-w-0 border-t border-border pt-4" aria-labelledby="product-description-title">
            <h2 id="product-description-title" className="mb-2 text-base font-bold">Sobre a peça</h2>
            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
