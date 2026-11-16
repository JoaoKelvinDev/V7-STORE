'use client';

import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import { demoPhoneLabel, storeSettings } from '@/data/settings';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container grid gap-8 py-10 text-sm md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-block rounded-lg bg-black p-2" aria-label="V7 Store — início"><img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" className="w-40" loading="lazy" width={240} height={160} /></Link>
          <p className="mt-3 font-bold">Vista seu estilo.</p>
          <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">Moda masculina. Qualidade em cada detalhe, estilo e confiança.</p>
        </div>
        <nav aria-label="Links do rodapé" className="space-y-3">
          <h2 className="text-sm font-bold">Explore a V7</h2>
          <Link to="/" className="block w-fit text-muted-foreground hover:text-primary">Início</Link>
          <Link to="/catalogo" className="block w-fit text-muted-foreground hover:text-primary">Catálogo</Link>
          <Link to="/carrinho" className="block w-fit text-muted-foreground hover:text-primary">Seu carrinho</Link>
        </nav>
        <div className="space-y-3">
          <h2 className="text-sm font-bold">Fale com a V7</h2>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div><p>{storeSettings.whatsappNumber ? `+${storeSettings.whatsappNumber}` : demoPhoneLabel}</p><p className="mt-1 text-xs">{storeSettings.whatsappNumber ? 'Confirme seu pedido com a loja.' : 'Número fictício · demonstração'}</p></div>
          </div>
          {storeSettings.instagramUrl && <a href={storeSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" aria-hidden="true" />Instagram da loja</a>}
        </div>
      </div>
      <div className="container border-t border-border py-5 text-xs text-muted-foreground">
        V7 Store · Catálogo de demonstração · Moda masculina
      </div>
    </footer>
  );
}
