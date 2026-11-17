'use client';

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Clock, MapPin, Home, LayoutGrid, ShoppingBag, Shirt, Layers, Footprints, Wallet, Compass, Headset, Tag, type LucideIcon } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '@/components/shared/BrandIcons';
import { categories } from '@/data/catalog';
import { storeSettings } from '@/data/settings';
import { cn, isValidWhatsAppNumber, prefersReducedMotion } from '@/utils/helpers';

const whatsappUrl = storeSettings.whatsappNumber && isValidWhatsAppNumber(storeSettings.whatsappNumber)
  ? `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}`
  : null;

const instagramHandle = storeSettings.instagramUrl
  ? `@${storeSettings.instagramUrl.replace(/\/+$/, '').split('/').pop()}`
  : null;

interface SocialLink {
  name: string;
  detail: string;
  href: string | null;
  icon: (props: { className?: string }) => ReactNode;
  hoverClass: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    detail: instagramHandle ?? 'Em breve',
    href: storeSettings.instagramUrl,
    icon: InstagramIcon,
    hoverClass: 'hover:border-[#E1306C]/60 hover:bg-[#E1306C]/10 hover:text-[#F56A9A]',
  },
  {
    name: 'WhatsApp',
    detail: whatsappUrl ? `+${storeSettings.whatsappNumber}` : 'Em breve',
    href: whatsappUrl,
    icon: WhatsAppIcon,
    hoverClass: 'hover:border-[#25D366]/60 hover:bg-[#25D366]/10 hover:text-[#4ADE80]',
  },
];

const navLinks = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/catalogo', label: 'Catálogo', icon: LayoutGrid },
  { to: '/carrinho', label: 'Seu carrinho', icon: ShoppingBag },
];

const categoryIcons: Record<string, LucideIcon> = {
  camisetas: Shirt,
  polos: Layers,
  calcados: Footprints,
  acessorios: Wallet,
};

const linkClass = 'pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary';

function FooterHeading({ id, icon: Icon, children }: { id?: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-3 flex flex-col items-center gap-3 text-sm font-bold text-foreground">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /></span>
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const hasWhatsApp = whatsappUrl !== null;

  return (
    <footer className="mt-16 border-t border-border bg-card/30">
      <div className="wrap mx-auto max-w-6xl px-4 py-10 text-center md:py-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
          {/* Marca + redes sociais */}
          <div className="flex max-w-md flex-col items-center">
            <Link to="/" className="pressable inline-block rounded-xl bg-black p-2" aria-label="V7 Store — início">
              <img src="/assets/brand/logo-v7.jpeg" alt="V7 Store" className="w-36 md:w-40" loading="lazy" width={240} height={160} />
            </Link>
            <p className="mt-4 text-base font-extrabold">Vista seu estilo.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Moda masculina com qualidade em cada detalhe. Escolha suas peças e finalize o pedido direto com a loja.
            </p>

            <ul className="mt-5 flex flex-wrap justify-center gap-3" aria-label="Redes sociais">
              {socialLinks.map(({ name, href, icon: Icon, hoverClass }) => (
                <li key={name}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} da V7 Store (abre em nova aba)`}
                      className={cn(
                        'pressable grid h-11 w-11 place-items-center rounded-full border border-border bg-background text-foreground transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5',
                        hoverClass,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : (
                    <span
                      role="img"
                      aria-label={`${name} da V7 Store em breve`}
                      title={`${name} em breve`}
                      className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-full border border-dashed border-border text-muted-foreground/60"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 border-t border-border pt-8 md:grid-cols-3 md:gap-8">
            <nav aria-labelledby="footer-nav-title">
              <FooterHeading id="footer-nav-title" icon={Compass}>Navegação</FooterHeading>
              <ul className="text-sm">
                {navLinks.map(link => (
                  <li key={link.to}><Link to={link.to} className={linkClass}><link.icon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden="true" />{link.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="footer-collections-title">
              <FooterHeading id="footer-collections-title" icon={Shirt}>Coleções</FooterHeading>
              <ul className="text-sm">
                {categories.map(category => {
                  const Icon = categoryIcons[category.slug] ?? Tag;
                  return (
                  <li key={category.id}>
                    <Link to={`/catalogo?categoria=${category.slug}`} className={linkClass}><Icon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden="true" />{category.name}</Link>
                  </li>
                  );
                })}
              </ul>
            </nav>
          {/* Atendimento */}
          <section className="col-span-2 min-w-0 border-t border-border pt-8 md:col-span-1 md:border-t-0 md:pt-0" aria-labelledby="footer-contact-title">
            <FooterHeading id="footer-contact-title" icon={Headset}>Atendimento</FooterHeading>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm text-muted-foreground md:grid-cols-1 md:gap-y-4">
              {socialLinks.map(({ name, detail, href, icon: Icon }) => (
                <li key={name} className="min-w-0">
                  <div className="min-w-0">
                    <p className="mb-1 inline-flex items-center justify-center gap-2 font-semibold text-foreground"><Icon className="h-4 w-4 shrink-0 text-primary" />{name}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center break-all rounded-lg px-1 hover:text-primary">{detail}</a>
                    ) : (
                      hasWhatsApp ? null : (
                        <p className="leading-relaxed">{name === 'WhatsApp' ? 'Em breve' : detail}</p>
                      )
                    )}
                  </div>
                </li>
              ))}
              <li>
                <div>
                  <p className="mb-1 inline-flex items-center justify-center gap-2 font-semibold text-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Retirada</p>
                  <p className="leading-relaxed">Local combinado com a loja</p>
                </div>
              </li>
              <li>
                <div>
                  <p className="mb-1 inline-flex items-center justify-center gap-2 font-semibold text-foreground"><Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Pedidos</p>
                  <p className="leading-relaxed">Confirmados pela loja antes da entrega</p>
                </div>
              </li>
            </ul>
          </section>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="wrap mx-auto max-w-6xl px-4 flex flex-col items-center justify-center gap-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
          >
            Voltar ao topo
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
          <p className="max-w-sm leading-relaxed">© {year} V7 Store · Moda masculina<br />Catálogo de demonstração</p>
        </div>
      </div>
    </footer>
  );
}
