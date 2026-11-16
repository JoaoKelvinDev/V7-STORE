'use client';

import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { RichNavigationMenu } from './RichNavigationMenu';

export function Header() {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2">
        <Link to="/" className="pressable flex min-w-0 items-center gap-3" aria-label="V7 Store — início">
          <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" className="h-11 w-auto shrink-0 rounded-md" />
          <span className="truncate text-sm font-extrabold tracking-widest sm:hidden">V7 STORE</span>
        </Link>
        <nav className="flex items-center gap-1">
          <RichNavigationMenu />
          <Link to="/catalogo" aria-label="Buscar" className="pressable rounded-full p-2.5 hover:bg-secondary">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/carrinho" aria-label={`Carrinho${cartCount > 0 ? `, ${cartCount} itens` : ' vazio'}`} className="pressable relative rounded-full p-2.5 hover:bg-secondary">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span key={cartCount} className="cart-count absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
