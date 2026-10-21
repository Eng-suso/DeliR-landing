import { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/** Reversible viewport reveals; document scrolling and prerender stay native. */
export default function V2Motion() {
  const { language } = useLanguage();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.landing-hybrid');
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let observer: IntersectionObserver | undefined;
    let revision = 0;
    const selector = '.hero-heading, .hero-description, .hero-actions, .hero-visual, .hybrid-path-steps li, .hybrid-problem-intro, .hybrid-problem-sequence li, .hybrid-problem-conclusion, .hybrid-journey-heading, .hybrid-benefit-copy, main [data-reveal]';
    // A component gets one transform, never a second animated ancestor.
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(target => !target.parentElement?.closest(selector));
    const header = root.querySelector<HTMLElement>('.premium-navigation');
    const update = () => {
      const currentRevision = ++revision;
      observer?.disconnect();
      root.dataset.motion = preference.matches || saveData ? 'reduced' : 'full';
      if (preference.matches || saveData || !('IntersectionObserver' in window)) {
        targets.forEach(target => target.removeAttribute('data-v2-visibility'));
        return;
      }
      observer = new IntersectionObserver(entries => {
        // WebKit can deliver a queued callback from a disconnected observer.
        if (currentRevision !== revision || preference.matches) return;
        for (const entry of entries) {
          // Outgoing elements move away from the viewport, avoiding threshold
          // feedback when transforms affect the observed bounding rectangle.
          const state = entry.isIntersecting ? 'visible' : entry.boundingClientRect.top < window.innerHeight / 2 ? 'above' : 'below';
          (entry.target as HTMLElement).dataset.v2Visibility = state;
        }
      }, { threshold: 0, rootMargin: `-${(Number.parseFloat(getComputedStyle(root).getPropertyValue('--delir-nav-height')) || 72) + 24}px 0px -${Math.min(80, window.innerHeight * .1)}px 0px` });
      targets.forEach(target => observer?.observe(target));
    };
    update();
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
    window.addEventListener('resize', update, { passive: true });
    preference.addEventListener('change', update);
    return () => {
      revision++;
      observer?.disconnect();
      layout.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('resize', update);
      links.forEach(link => link.removeAttribute('aria-current'));
      delete root.dataset.motion;
      preference.removeEventListener('change', update);
      targets.forEach(target => target.removeAttribute('data-v2-visibility'));
    };
  }, [language]);
  return null;
}
