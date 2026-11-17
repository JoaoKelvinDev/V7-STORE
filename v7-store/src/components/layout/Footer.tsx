import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Footprints, Home, Layers, LayoutGrid, MapPin, Phone, Shirt, ShoppingBag, Sparkles, Watch, type LucideIcon } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/shared/BrandIcons';
import { categories } from '@/data/catalog';
import { demoPhoneLabel, storePhoneLabel, storeSettings } from '@/data/settings';
import { getWhatsAppUrl, isValidWhatsAppNumber, prefersReducedMotion } from '@/utils/helpers';

const collectionIcons: Record<string, LucideIcon> = {
  camisetas: Shirt,
  polos: Layers,
  calcados: Footprints,
  acessorios: Watch,
};

export function Footer() {
  const whatsapp = storeSettings.whatsappNumber && isValidWhatsAppNumber(storeSettings.whatsappNumber)
    ? getWhatsAppUrl(storeSettings.whatsappNumber, 'Olá! Gostaria de conhecer as peças da V7 Store.')
    : null;

  return (
    <footer className="refresh-footer">
      <div className="refresh-footer-inner">
        <div className="refresh-footer-brand">
          <Link to="/" aria-label="V7 Store — início">
            <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" width={150} height={100} loading="lazy" />
          </Link>
          <p className="refresh-footer-tagline refresh-display">Vista seu estilo.</p>
          <p className="refresh-footer-description">Moda masculina para o seu dia a dia.</p>
          <div className="refresh-footer-socials">
            {storeSettings.instagramUrl && (
              <a href={storeSettings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram da V7 Store">
                <InstagramIcon width={20} height={20} />
              </a>
            )}
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da V7 Store">
                <WhatsAppIcon width={20} height={20} />
              </a>
            ) : (
              <span className="refresh-footer-social-disabled" title="WhatsApp ainda não configurado">
                <WhatsAppIcon width={20} height={20} />
                <span className="sr-only">WhatsApp ainda não configurado</span>
              </span>
            )}
          </div>
        </div>

        <div className="refresh-footer-grid">
          <nav aria-labelledby="footer-navigation-title">
            <h2 id="footer-navigation-title">Explore a V7</h2>
            <Link to="/"><Home size={17} aria-hidden="true" />Início</Link>
            <a href="#novidades"><Sparkles size={17} aria-hidden="true" />Novidades</a>
            <Link to="/catalogo"><LayoutGrid size={17} aria-hidden="true" />Catálogo</Link>
            <Link to="/carrinho"><ShoppingBag size={17} aria-hidden="true" />Seu carrinho</Link>
          </nav>

          <nav aria-labelledby="footer-collections-title">
            <h2 id="footer-collections-title">Coleções</h2>
            {categories.map(category => {
              const Icon = collectionIcons[category.slug] ?? Shirt;
              return <Link key={category.id} to={`/catalogo?categoria=${category.slug}`}><Icon size={17} aria-hidden="true" />{category.name}</Link>;
            })}
          </nav>

          <section className="refresh-footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">Fale com a gente</h2>
            {storeSettings.instagramUrl && (
              <a href={storeSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="refresh-footer-action"><InstagramIcon width={17} height={17} />Instagram da loja<ArrowUpRight size={16} aria-hidden="true" /></a>
            )}
            {whatsapp ? (
              <>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="refresh-footer-action refresh-footer-whatsapp"><WhatsAppIcon width={18} height={18} />Chamar no WhatsApp<ArrowUpRight size={16} aria-hidden="true" /></a>
                <small>{storePhoneLabel}</small>
              </>
            ) : (
              <>
                <p><Phone size={17} aria-hidden="true" />{demoPhoneLabel}</p>
                <small>Contato de demonstração</small>
              </>
            )}
            {storeSettings.fulfillmentModes.includes('pickup') && <p><MapPin size={17} aria-hidden="true" />Retirada a combinar</p>}
          </section>
        </div>

        <div className="refresh-footer-bottom">
          <p>© {new Date().getFullYear()} {storeSettings.storeName}. Catálogo de demonstração.</p>
          <button type="button" className="refresh-footer-top" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })}>
            Voltar ao topo <ArrowUp size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
