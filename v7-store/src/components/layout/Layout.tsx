'use client';

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith('/produto/');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-dvh flex flex-col">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <Header compact={isProductPage} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div key={pathname} className={pathname === '/' ? undefined : isProductPage ? 'animate-fade-in' : 'route-enter'}><Outlet /></div>
      </main>
      {pathname === '/' && <Footer />}
    </div>
  );
}
