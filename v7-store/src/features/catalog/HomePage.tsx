import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play } from 'lucide-react';
import { getFeaturedProducts } from '@/data/catalog';
import { ProductCard } from '@/components/shared/ProductCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Visual e movimentos importados de JoaoKelvinDev/v7-storefront-refresh.
// As ações usam as rotas e os dados reais deste projeto.
const collections = [
  { name: 'Camisetas', slug: 'camisetas' },
  { name: 'Calçados', slug: 'calcados' },
  { name: 'Acessórios', slug: 'acessorios' },
];
const pillars = [
  ['01', 'Qualidade em cada detalhe', 'Conheça cada peça pelas fotos e pelos detalhes do catálogo.'],
  ['02', 'Moda masculina', 'Camisetas e polos para você escolher cor e tamanho.'],
  ['03', 'Estilo e confiança', 'Monte seu pedido e confirme os detalhes com a loja.'],
];
const marqueeLabels = ['Vista seu estilo', 'Polos', 'Camisetas', 'Calçados', 'Acessórios', 'Qualidade em cada detalhe'];

export function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  useScrollReveal(root);

  return (
    <div ref={root} className="refresh-home" data-motion-paused={motionPaused}>
      <section className="refresh-hero" aria-labelledby="hero-title">
        <div>
          <p className="refresh-fade-up refresh-eyebrow">V7 Store · Moda masculina</p>
          <h1 id="hero-title" className="refresh-fade-up refresh-display refresh-hero-title" style={{ animationDelay: '.15s' }}>
            <span className="refresh-text-chrome">Vista seu</span><br />
            <em className="refresh-script">estilo.</em>
          </h1>
          <p className="refresh-fade-up refresh-hero-description" style={{ animationDelay: '.3s' }}>
            Novos modelos, novas cores. Encontre a peça que combina com você e monte seu pedido no seu ritmo.
          </p>
          <div className="refresh-fade-up refresh-hero-actions" style={{ animationDelay: '.45s' }}>
            <Link to="/catalogo" className="refresh-button refresh-button-primary">Ver catálogo</Link>
            <a href="#novidades" className="refresh-button refresh-button-outline">Explorar novidades <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="refresh-fade-up refresh-hero-art" style={{ animationDelay: '.3s' }}>
          <div className="refresh-blob refresh-continuous" aria-hidden="true" />
          <div className="refresh-badge refresh-continuous" aria-hidden="true">Novos modelos ✦</div>
          <Link to="/catalogo" className="refresh-logo-link" aria-label="Conhecer o catálogo da V7 Store">
            <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" width={1536} height={1024} loading="eager" className="refresh-floating-logo refresh-continuous" />
          </Link>
        </div>
      </section>

      <div className="refresh-marquee-band">
        <div className="refresh-marquee-window">
          <div className="refresh-marquee refresh-continuous refresh-display">
            {[0, 1].map(copy => (
              <div key={copy} className="refresh-marquee-group" aria-hidden={copy === 1 ? true : undefined}>
                {marqueeLabels.map(label => <span key={label}>{label}<span aria-hidden="true">✦</span></span>)}
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="refresh-motion-toggle" aria-label={motionPaused ? 'Retomar animações' : 'Pausar animações'} aria-pressed={motionPaused} onClick={() => setMotionPaused(paused => !paused)}>
          {motionPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
      </div>

      <section id="novidades" className="refresh-section" aria-labelledby="novidades-title">
        <div className="refresh-reveal refresh-section-heading" data-refresh-reveal>
          <div>
            <h2 id="novidades-title" className="refresh-display">Novidades</h2>
            <p>Polo verde-oliva, camiseta estampada e caramelo.</p>
          </div>
          <Link to="/catalogo" className="refresh-all-link">Ver tudo</Link>
        </div>
        <div className="refresh-featured-grid">
          {getFeaturedProducts().map((product, index) => (
            <div key={product.id} className="refresh-reveal" data-refresh-reveal style={{ '--refresh-delay': `${index * .15}s` } as CSSProperties}>
              <ProductCard product={product} headingLevel={3} />
            </div>
          ))}
        </div>
      </section>

      <section id="catalogo" className="refresh-section" aria-labelledby="categories-title">
        <h2 id="categories-title" className="refresh-reveal refresh-display refresh-section-title" data-refresh-reveal>Explore o catálogo</h2>
        <div className="refresh-collection-grid">
          {collections.map((category, index) => (
            <div key={category.slug} className="refresh-reveal" data-refresh-reveal style={{ '--refresh-delay': `${index * .12}s` } as CSSProperties}>
              <Link to={`/catalogo?categoria=${category.slug}`} className="refresh-collection">
                <span className="refresh-collection-fill" aria-hidden="true" />
                <span className="refresh-collection-number" aria-hidden="true">0{index + 1}</span>
                <span className="refresh-display refresh-collection-name">{category.name}<span aria-hidden="true">→</span></span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="refresh-about" aria-labelledby="brand-title">
        <div className="refresh-about-inner">
          <p className="refresh-reveal refresh-eyebrow" data-refresh-reveal>V7 Store</p>
          <h2 id="brand-title" className="refresh-reveal refresh-display" data-refresh-reveal>O começo de uma grande história.</h2>
          <p className="refresh-about-intro">Da escolha da peça ao seu próximo look: vista seu estilo.</p>
          <div className="refresh-pillar-grid">
            {pillars.map(([number, title, description], index) => (
              <div key={number} className="refresh-reveal refresh-pillar" data-refresh-reveal style={{ '--refresh-delay': `${index * .15}s` } as CSSProperties}>
                <span className="refresh-display" aria-hidden="true">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
