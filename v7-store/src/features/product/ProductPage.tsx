'use client';

import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSizePicker, createVariantOptions, findMatchingVariant } from '@/components/shared/VariantSelect';
import { categories, getProductBySlug } from '@/data/catalog';
import type { Product } from '@/types';
import { NotFoundPage } from '@/features/catalog/NotFoundPage';
import { useCart } from '@/app/providers/CartProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { formatPrice } from '@/utils/helpers';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  return product ? <ProductDetails key={product.id} product={product} /> : <NotFoundPage />;
}

function ProductDetails({ product }: { product: Product }) {
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
      showToast({
        type: 'success',
        message: `${product.name} adicionado ao carrinho`,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container py-6">
      <Link to="/catalogo" className="back-link pressable mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img key={selectedImage} src={selectedImage} alt={product.name} className="gallery-photo aspect-[4/5] w-full rounded-2xl border border-border bg-secondary object-cover" />
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3" aria-label="Galeria do produto">
              {product.images.map((image, index) => (
                <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`Ver foto ${index + 1}`} aria-pressed={selectedImage === image} className="overflow-hidden rounded-lg border border-border p-1 aria-pressed:border-primary">
                  <img src={image} alt="" className="h-20 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{category}</p>
            <h1 className="mt-1 text-3xl font-extrabold">{product.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{formatPrice(product.priceCents)}</p>
            <p className={`mt-1 text-sm ${isVariantAvailable ? 'text-green-400' : 'text-destructive'}`}>{isVariantAvailable ? '● Disponível' : 'Indisponível'}</p>
          </div>
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
                className="p-3"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button
                type="button"
                aria-label="Aumentar"
                className="p-3"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!isVariantAvailable || isAdding}
          >
            {isAdding ? 'Adicionando...' : inCartQuantity > 0 ? 'Adicionar mais ao carrinho' : 'Adicionar ao carrinho'}
          </Button>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
