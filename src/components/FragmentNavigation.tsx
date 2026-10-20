import { useEffect, useLayoutEffect, useRef } from 'react';
import { useFragment } from '../lib/useFragment';

export default function FragmentNavigation({ smooth = false }: { smooth?: boolean }) {
  const fragment = useFragment();
  const userNavigation = useRef(false);
  useEffect(() => {
    if (!smooth) return;
    const followAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) userNavigation.current = true;
    };
    document.addEventListener('click', followAnchor);
    return () => document.removeEventListener('click', followAnchor);
  }, [smooth]);
  useLayoutEffect(() => {
    if (!fragment) return;
    const animate = smooth && userNavigation.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    userNavigation.current = false;
    let frame = 0;
    let disposed = false;
    const scrollToTarget = () => {
      if (disposed || window.location.hash.slice(1) !== fragment) return;
      const target = document.getElementById(fragment);
      if (!target) return;
      let ancestor: HTMLElement | null = target.parentElement;
      while (ancestor) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      target.scrollIntoView({ block: 'start', behavior: animate ? 'smooth' : 'instant' });
    };
    // Restore before paint, then correct any font-driven layout shift.
    // Do not hold direct links behind font loading or override user input.
    const cancel = () => { disposed = true; cancelAnimationFrame(frame); };
    const schedule = () => {
      if (disposed) return;
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(scrollToTarget); });
    };
    scrollToTarget();
    if (!animate) void document.fonts.ready.then(schedule);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel);
    window.addEventListener('keydown', cancel);
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [fragment, smooth]);
  return null;
}
