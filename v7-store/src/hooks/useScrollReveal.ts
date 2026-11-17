import { useEffect, type RefObject } from 'react';

/** Conteúdo visível por padrão; o observer só aprimora a entrada desta página. */
export function useScrollReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === 'undefined') return;
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (preference?.matches) return;

    const elements = Array.from(root.current.querySelectorAll<HTMLElement>('[data-refresh-reveal]'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-reveal-state', 'visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: .15 });

    for (const element of elements) {
      element.setAttribute('data-reveal-state', 'pending');
      observer.observe(element);
    }
    const showEverything = () => {
      observer.disconnect();
      for (const element of elements) element.removeAttribute('data-reveal-state');
    };
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) showEverything();
    };
    preference?.addEventListener('change', onPreferenceChange);
    return () => {
      showEverything();
      preference?.removeEventListener('change', onPreferenceChange);
    };
  }, [root]);
}
