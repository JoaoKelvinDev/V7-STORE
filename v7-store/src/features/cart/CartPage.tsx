import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { QuantityStepper } from '@/components/shared/QuantityStepper';
import { useCart } from '@/app/providers/CartProvider';
import { products, getVariant } from '@/data/catalog';
import { formatPrice, cn } from '@/utils/helpers';

export function CartPage() {
  const { state, removeItem, updateQuantity, getSubtotalCents, hasUnavailableItems } = useCart();
  const subtotalCents = getSubtotalCents();
  const unavailable = hasUnavailableItems();

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/catalogo" className="back-link pressable mb-5"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Voltar ao catálogo</Link>
        <h1 className="mb-6 text-2xl font-extrabold">Seu carrinho</h1>
        {state.items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="mb-2 text-lg font-bold">Carrinho vazio</h2>
            <p className="mb-6 text-muted-foreground">Adicione produtos para começar seu pedido</p>
            <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4" role="list" aria-label="Itens do carrinho">
              {state.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                const variant = getVariant(item.productId, item.variantId);
                const isUnavailable = !product?.active || !variant || variant.availability === 'unavailable';
                const lineTotal = product?.priceCents != null ? product.priceCents * item.quantity : null;

                return (
                  <article key={`${item.productId}-${item.variantId}`} role="listitem" className={cn('flex gap-3 rounded-xl border border-border bg-card p-3 sm:gap-4 sm:p-4', isUnavailable && 'border-destructive/50')}>
                    {product && <Link to={`/produto/${product.slug}`} className="shrink-0"><img src={product.images[0]} alt={product.name} className="h-24 w-16 rounded-lg object-cover sm:w-20" /></Link>}
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-bold">{product?.name ?? 'Produto removido do catálogo'}</p>
                      <p className="text-sm text-muted-foreground">{[variant?.color, variant?.size].filter(Boolean).join(' · ')}</p>
                      <p className="text-sm">{formatPrice(lineTotal)}</p>
                      {isUnavailable && <p className="text-sm text-destructive">Indisponível. Remova este item para continuar.</p>}
                      <QuantityStepper value={item.quantity} onChange={quantity => updateQuantity(item.productId, item.variantId, quantity)} disabled={isUnavailable} ariaLabel={`Quantidade de ${product?.name ?? 'produto'}`} />
                    </div>
                    <button type="button" className="self-start rounded-lg p-2 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.productId, item.variantId)} aria-label={`Remover ${product?.name ?? 'produto'}`}><Trash2 className="h-4 w-4" /></button>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">{subtotalCents === null ? 'Valor a confirmar com a loja' : formatPrice(subtotalCents)}</span>
              </div>
              {unavailable ? <p role="alert" className="text-sm text-destructive">Remova os itens indisponíveis antes de finalizar.</p> : (
                <Link to="/finalizar" className={cn(buttonVariants({ size: 'lg' }), 'w-full gap-2')}>Continuar pedido <ArrowRight className="h-4 w-4" /></Link>
              )}
            </div>
            <Link to="/catalogo" className="mt-4 block text-center text-sm font-semibold text-primary">Continuar comprando</Link>
          </>
        )}
      </div>
    </div>
  );
}
