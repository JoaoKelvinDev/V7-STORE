import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { cn } from '@/utils/helpers';

const collectionLinks = [
  { label: 'Catálogo', to: '/catalogo', category: '' },
  { label: 'Camisetas', to: '/catalogo?categoria=camisetas', category: 'camisetas' },
  { label: 'Polos', to: '/catalogo?categoria=polos', category: 'polos' },
];

export function Header({ compact = false }: { compact?: boolean }) {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const selectedCategory = new URLSearchParams(location.search).get('categoria') ?? '';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <header className={cn('refresh-header', isHome && 'refresh-header-home', isHome && scrolled && 'is-scrolled')}>
      <div className="refresh-header-inner">
        <Link to="/" className="refresh-wordmark refresh-display" aria-label="V7 Store — início">V7<span>.</span></Link>
        {!compact && (
          <nav className="refresh-desktop-nav" aria-label="Navegação principal">
            {isHome ? <>
              <a href="#novidades" className="refresh-link-underline">Novidades</a>
              <a href="#catalogo" className="refresh-link-underline">Catálogo</a>
              <a href="#sobre" className="refresh-link-underline">Sobre</a>
            </> : collectionLinks.map(link => (
              <Link key={link.to} to={link.to} aria-current={location.pathname === '/catalogo' && selectedCategory === link.category ? 'page' : undefined} className="refresh-link-underline">{link.label}</Link>
            ))}
          </nav>
        )}
        <div className="refresh-header-actions">
          {isHome && <a href="#novidades" className="refresh-button refresh-button-primary refresh-buy-link">Comprar</a>}
          {compact ? <Link to="/catalogo" className="refresh-compact-catalog">Catálogo</Link> : !isHome && (
            <Link to="/catalogo" aria-label="Buscar" className="refresh-icon-button"><Search size={21} strokeWidth={1.6} aria-hidden="true" /></Link>
          )}
          {!compact && (
            <details key={location.key} className="refresh-mobile-menu" onKeyDown={event => {
              if (event.key === 'Escape') {
                event.currentTarget.open = false;
                event.currentTarget.querySelector('summary')?.focus();
              }
            }}>
              <summary className="refresh-icon-button" aria-label="Abrir menu"><Menu size={22} strokeWidth={1.6} aria-hidden="true" /></summary>
              <nav className="refresh-mobile-menu-panel" aria-label="Menu mobile">
                <Link to="/">Início <ArrowUpRight size={18} aria-hidden="true" /></Link>
                {collectionLinks.map(link => <Link to={link.to} key={link.to}>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
              </nav>
            </details>
          )}
          <Link to="/carrinho" aria-label={`Carrinho${cartCount > 0 ? `, ${cartCount} itens` : ' vazio'}`} className="refresh-icon-button refresh-cart-link">
            <ShoppingBag size={21} strokeWidth={1.6} aria-hidden="true" />
            {cartCount > 0 && <span key={cartCount} className="refresh-cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
