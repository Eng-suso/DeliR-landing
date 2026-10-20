import { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/** One entrance vocabulary, with no scroll loop, hidden prerender or animation library. */
export default function V2Motion() {
  const { language } = useLanguage();
  useEffect(() => {
    const root = document.querySelector('.landing-hybrid');
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const selector = '.hero-heading, .hero-description, .hero-actions, .hero-visual, .hybrid-path-heading, .hybrid-path-steps, .hybrid-journey-heading, .hybrid-benefit-copy, .hybrid-benefit > [data-reveal], [data-reveal]:not(.hybrid-extra-benefit [data-reveal])';
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const update = () => {
      observer?.disconnect();
      targets.forEach(target => target.removeAttribute('data-v2-entered'));
      if (preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-v2-entered', 'true');
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      targets.forEach(target => observer?.observe(target));
    };
    update();
    preference.addEventListener('change', update);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', update);
      targets.forEach(target => target.removeAttribute('data-v2-entered'));
    };
  }, [language]);
  return null;
}
