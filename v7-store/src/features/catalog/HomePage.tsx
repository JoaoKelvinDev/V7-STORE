'use client';

import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Footprints, Wallet, BadgeCheck, Handshake } from 'lucide-react';
import { getFeaturedProducts } from '@/data/catalog';
import { ProductCard } from '@/components/shared/ProductCard';

export function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const cats = [{ n: "Camisetas", slug: 'camisetas', i: Shirt }, { n: "Calçados", slug: 'calcados', i: Footprints }, { n: "Acessórios", slug: 'acessorios', i: Wallet }];

  return (
    <>
      <section className="bg-hero border-b border-border/60">
        <div className="container grid max-w-6xl items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div className="space-y-5">
            <p className="text-sm font-semibold text-primary">V7 Store · Moda masculina</p>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">Vista seu<br />estilo.</h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">Novos modelos, novas cores. Encontre a peça que combina com você e monte seu pedido no seu ritmo.</p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/catalogo" className="btn-primary pressable">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#novidades" className="btn-secondary pressable">Explorar novidades</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-black p-3 sm:p-5">
            <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store — Vista seu estilo. Qualidade em cada detalhe, moda masculina, estilo e confiança." className="w-full" width={1536} height={1024} fetchPriority="high" />
          </div>
        </div>
      </section>
      {featuredProducts.length > 0 && (
        <section id="novidades" className="container scroll-mt-24 py-10 md:py-14" aria-labelledby="novidades-title">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="novidades-title" className="text-2xl font-extrabold md:text-3xl">Novidades</h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">Polo verde-oliva, camiseta estampada e caramelo. Veja as fotos e escolha seu estilo.</p>
            </div>
            <Link to="/catalogo" className="back-link pressable">Ver tudo <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}
      <section className="container pb-12" aria-labelledby="categories-title">
        <h2 id="categories-title" className="mb-4 text-xl font-extrabold">Explore o catálogo</h2>
        <div className="grid grid-cols-3 gap-3">
          {cats.map(({ n, slug, i: I }) => (
            <Link key={n} to={`/catalogo?categoria=${slug}`} className="category-link pressable flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-semibold hover:border-primary sm:p-5">
              <I className="h-6 w-6 text-primary" />
              {n}
            </Link>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-card/40" aria-labelledby="brand-title">
        <div className="container py-10 md:py-12">
          <div className="mb-8 max-w-xl">
            <p className="mb-2 text-sm font-semibold text-primary">V7 Store</p>
            <h2 id="brand-title" className="text-2xl font-extrabold md:text-3xl">O começo de uma grande história.</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Da escolha da peça ao seu próximo look: vista seu estilo.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: BadgeCheck, title: 'Qualidade em cada detalhe', text: 'Conheça cada peça pelas fotos e pelos detalhes do catálogo.' },
              { icon: Shirt, title: 'Moda masculina', text: 'Camisetas e polos para você escolher cor e tamanho.' },
              { icon: Handshake, title: 'Estilo e confiança', text: 'Monte seu pedido e confirme os detalhes com a loja.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div><h3 className="text-base font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
