import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import type Lenis from 'lenis';
import { registerDocumentScroll } from '../lib/documentScroll';

// Native scrolling stays in place for touch devices and people requesting reduced motion.
export default function SmoothScroll({ controlledAnchors = false }: { controlledAnchors?: boolean }) {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let revision = 0;
    let lenis: Lenis | undefined;
    let unregister: (() => void) | undefined;
    const dialogs = () => {
      if (!controlledAnchors || !lenis) return;
      if (document.querySelector('dialog[open]')) lenis.stop();
      else lenis.start();
    };
    const interrupt = () => {
      if (!controlledAnchors || !lenis || lenis.isStopped) return;
      lenis.stop(); lenis.start();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interrupt();
    };

    const sync = async () => {
      const currentRevision = ++revision;
      unregister?.();
      unregister = undefined;
      lenis?.destroy();
      lenis = undefined;
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      if (!desktop.matches || reducedMotion.matches || saveData) return;

      const { default: Lenis } = await import('lenis');
      if (disposed || currentRevision !== revision || !desktop.matches || reducedMotion.matches) return;
      lenis = new Lenis({ autoRaf: true, anchors: controlledAnchors ? false : { offset: -88 }, smoothWheel: true, syncTouch: false, duration: .95, stopInertiaOnNavigate: true });
      if (controlledAnchors) unregister = registerDocumentScroll(lenis);
      dialogs();
    };

    void sync();
    desktop.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    const modalObserver = new MutationObserver(dialogs);
    if (controlledAnchors) {
      // History can unmount an open scene dialog without a close-attribute event.
      modalObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
      document.addEventListener('keydown', keyboard, true);
      document.addEventListener('pointerdown', interrupt, true);
    }

    return () => {
      disposed = true;
      desktop.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      modalObserver.disconnect();
      document.removeEventListener('keydown', keyboard, true);
      document.removeEventListener('pointerdown', interrupt, true);
      unregister?.();
      lenis?.destroy();
    };
  }, [controlledAnchors]);

  return null;
}
