'use client';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" aria-hidden="true" />
              Voltar ao início
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" aria-hidden="true" />
              Ver catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}