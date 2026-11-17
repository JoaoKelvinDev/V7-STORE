'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { RichNavigationMenu } from './RichNavigationMenu';

export function Header({ compact = false }: { compact?: boolean }) {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const previousCount = useRef(cartCount);
  const [bumpKey, setBumpKey] = useState(0);

  // A sacola só "salta" quando o cliente adiciona algo, não ao abrir a página.
  useEffect(() => {
    if (cartCount > previousCount.current) setBumpKey(key => key + 1);
    previousCount.current = cartCount;
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2">
        <Link to="/" className="pressable flex min-w-0 items-center gap-3" aria-label="V7 Store — início">
          <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" className="h-11 w-auto shrink-0 rounded-md" />
          <span className="hidden truncate text-sm font-extrabold tracking-widest min-[420px]:inline sm:hidden">V7 STORE</span>
        </Link>
        <nav className="flex items-center gap-1">
          {compact ? <Link to="/catalogo" className="pressable flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-secondary">Catálogo</Link> : <RichNavigationMenu />}
          {!compact && <Link to="/catalogo" aria-label="Buscar" className="pressable grid h-11 w-11 place-items-center rounded-full hover:bg-secondary">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>}
          <Link to="/carrinho" aria-label={`Carrinho${cartCount > 0 ? `, ${cartCount} itens` : ' vazio'}`} className="pressable relative grid h-11 w-11 place-items-center rounded-full hover:bg-secondary">
            <span key={`bag-${bumpKey}`} className={bumpKey > 0 ? 'cart-bump' : 'inline-flex'}>
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </span>
            {cartCount > 0 && (
              <span key={`count-${cartCount}`} className="cart-count absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
