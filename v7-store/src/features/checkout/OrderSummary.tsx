import { Link } from 'react-router-dom';
import { Check, ChevronDown, Copy, Pencil, ShoppingBag } from 'lucide-react';
import { getVariant, products } from '@/data/catalog';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface OrderSummaryProps {
  items: CartItem[];
  subtotalCents: number | null;
  message: string;
  copied: boolean;
  copyFailed: boolean;
  onCopy: () => void;
}

export function OrderSummary({ items, subtotalCents, message, copied, copyFailed, onCopy }: OrderSummaryProps) {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="checkout-summary" aria-labelledby="summary-title">
      <div className="checkout-summary-card">
        <div className="checkout-summary-heading">
          <h2 id="summary-title">Resumo do pedido</h2>
          <Link to="/carrinho"><Pencil size={15} aria-hidden="true" />Editar</Link>
        </div>
        <p className="checkout-item-count">{quantity} {quantity === 1 ? 'peça no seu pedido' : 'peças no seu pedido'}</p>
        <ul className="checkout-items">
          {items.map(item => {
            const product = products.find(entry => entry.id === item.productId);
            const variant = getVariant(item.productId, item.variantId);
            const unavailable = !product?.active || !variant || variant.availability === 'unavailable';
            const lineTotal = product?.priceCents != null ? product.priceCents * item.quantity : null;
            return (
              <li key={`${item.productId}-${item.variantId}`}>
                {product?.images[0] ? <img src={product.images[0]} alt="" width={64} height={80} loading="lazy" style={{ objectPosition: product.cardImagePosition }} /> : <span className="checkout-missing-image"><ShoppingBag size={23} aria-hidden="true" /></span>}
                <div className="checkout-item-info">
                  <h3>{product?.name ?? 'Produto indisponível'}</h3>
                  <p>{[variant?.color, variant?.size].filter(Boolean).join(' · ')}</p>
                  <p>Quantidade: {item.quantity}</p>
                  <strong>{formatPrice(lineTotal)}</strong>
                  {unavailable && <p className="text-destructive">Indisponível. Remova no carrinho.</p>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="checkout-subtotal">
          <span>Subtotal das peças</span>
          <strong>{subtotalCents === null ? 'A confirmar com a loja' : formatPrice(subtotalCents)}</strong>
        </div>
        <p className="checkout-summary-note">A loja confirma a disponibilidade e o valor final pelo WhatsApp.</p>
        <details className="checkout-message" open={copyFailed || undefined}>
          <summary>Ver mensagem do pedido<ChevronDown size={17} aria-hidden="true" /></summary>
          {copyFailed && <p id="checkout-copy-help" className="checkout-copy-error" role="alert">Não foi possível copiar automaticamente. Selecione o texto abaixo e copie manualmente.</p>}
          <textarea
            readOnly
            value={message}
            aria-label="Prévia da mensagem do WhatsApp"
            aria-describedby={copyFailed ? 'checkout-copy-help' : undefined}
            spellCheck={false}
          />
        </details>
        <button type="button" className="checkout-copy" onClick={onCopy}>
          {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
          {copied ? 'Mensagem copiada' : 'Copiar mensagem'}
        </button>
      </div>
    </section>
  );
}
