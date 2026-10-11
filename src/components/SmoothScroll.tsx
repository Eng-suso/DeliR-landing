import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

// Native scrolling stays in place for touch devices and people requesting reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let revision = 0;
    let lenis: { destroy: () => void } | undefined;

    const sync = async () => {
      const currentRevision = ++revision;
      lenis?.destroy();
      lenis = undefined;
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      if (!desktop.matches || reducedMotion.matches || saveData) return;

      const { default: Lenis } = await import('lenis');
      if (disposed || currentRevision !== revision || !desktop.matches || reducedMotion.matches) return;
      lenis = new Lenis({ autoRaf: true, anchors: { offset: -88 }, smoothWheel: true, duration: 0.95, stopInertiaOnNavigate: true });
    };

    void sync();
    desktop.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);

    return () => {
      disposed = true;
      desktop.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      lenis?.destroy();
    };
  }, []);

  return null;
}
