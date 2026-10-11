import { useLayoutEffect } from 'react';
import { useFragment } from '../lib/useFragment';

export default function FragmentNavigation() {
  const fragment = useFragment();
  useLayoutEffect(() => {
    if (!fragment) return;
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
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    // Restore before paint, then correct any font-driven layout shift.
    // Do not hold direct links behind font loading or override user input.
    const cancel = () => { disposed = true; cancelAnimationFrame(frame); };
    const schedule = () => {
      if (disposed) return;
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(scrollToTarget); });
    };
    scrollToTarget();
    void document.fonts.ready.then(schedule);
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
  }, [fragment]);
  return null;
}
