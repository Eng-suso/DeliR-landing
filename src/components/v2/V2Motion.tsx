import { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/** One entrance vocabulary, with no scroll loop, hidden prerender or animation library. */
export default function V2Motion() {
  const { language } = useLanguage();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.landing-hybrid');
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let observer: IntersectionObserver | undefined;
    const selector = '.hero-heading, .hero-description, .hero-actions, .hybrid-journey-heading, .hybrid-benefit-copy, .hybrid-product-media, .hybrid-problem-intro, .premium-pilot [data-reveal], .premium-trust [data-reveal]';
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    const update = () => {
      observer?.disconnect();
      targets.forEach(target => target.removeAttribute('data-v2-entered'));
      root.dataset.motion = preference.matches || saveData ? 'reduced' : 'full';
      if (preference.matches || saveData || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const linked = document.getElementById(window.location.hash.slice(1))?.closest('section');
          if (linked?.contains(entry.target) || entry.target.contains(document.activeElement)) { observer?.unobserve(entry.target); continue; }
          entry.target.setAttribute('data-v2-entered', 'true');
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      targets.forEach(target => observer?.observe(target));
    };
    update();
    const focus = (event: FocusEvent) => {
      targets.filter(target => event.target instanceof Node && target.contains(event.target)).forEach(target => target.removeAttribute('data-v2-entered'));
    };
    root.addEventListener('focusin', focus);
    const header = root.querySelector<HTMLElement>('.premium-navigation');
    const progress = root.querySelector<HTMLElement>('[data-v2-scroll-progress]');
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.premium-navigation ul a[href^="#"]'));
    const sections = links.map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }));
    let frame = 0;
    const readPosition = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0})`;
      if (header) header.dataset.scrolled = String(window.scrollY > 32);
      const line = (header?.getBoundingClientRect().bottom ?? 0) + 100;
      const current = sections.filter(item => item.target?.getClientRects().length).map(item => ({ ...item, top: item.target!.getBoundingClientRect().top })).filter(item => item.top <= line).sort((a, b) => b.top - a.top)[0]?.target;
      for (const item of sections) {
        if (item.target === current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(readPosition); };
    const layout = new ResizeObserver(schedule);
    layout.observe(root);
    readPosition();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    preference.addEventListener('change', update);
    return () => {
      observer?.disconnect();
      layout.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      links.forEach(link => link.removeAttribute('aria-current'));
      delete root.dataset.motion;
      preference.removeEventListener('change', update);
      root.removeEventListener('focusin', focus);
      targets.forEach(target => target.removeAttribute('data-v2-entered'));
    };
  }, [language]);
  return null;
}
