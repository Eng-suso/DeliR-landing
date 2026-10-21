import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFragment } from '../lib/useFragment';

export default function FragmentNavigation({ smooth = false }: { smooth?: boolean }) {
  const fragment = useFragment();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [request, repeat] = useReducer(value => value + 1, 0);
  const userNavigation = useRef(false);
  // Router pushes update the URL without the browser's hashchange event.
  // Notify native fragment subscribers without triggering a native scroll.
  useLayoutEffect(() => { window.dispatchEvent(new Event('hashchange')); }, [hash]);
  useEffect(() => {
    if (!smooth) return;
    const followAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      // Own this one movement: the native anchor and a later layout effect
      // must not start competing scrolls around a video change or menu close.
      event.preventDefault();
      userNavigation.current = true;
      if (url.hash !== location.hash) navigate(`${url.pathname}${url.search}${url.hash}`, { preventScrollReset: true });
      repeat();
    };
    document.addEventListener('click', followAnchor, true);
    return () => document.removeEventListener('click', followAnchor, true);
  }, [smooth, navigate]);
  useLayoutEffect(() => {
    if (!fragment) return;
    const animate = smooth && userNavigation.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    userNavigation.current = false;
    let frame = 0;
    let disposed = false;
    let focused = false;
    let lastDestination: number | undefined;
    const scrollToTarget = () => {
      if (disposed || window.location.hash.slice(1) !== fragment) return;
      const target = document.getElementById(fragment);
      if (!target) return;
      let ancestor: HTMLElement | null = target.parentElement;
      while (ancestor) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      if (smooth && !focused) {
        focused = true;
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
      }
      if (smooth) {
        // Use layout coordinates for the document destination, independently
        // of entrance transforms and the current viewport position.
        const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        let documentTop = 0;
        let element: HTMLElement | null = target;
        while (element) {
          documentTop += element.offsetTop;
          element = element.offsetParent instanceof HTMLElement ? element.offsetParent : null;
        }
        const destination = Math.max(0, documentTop - margin);
        if (lastDestination !== undefined && Math.abs(destination - lastDestination) < 1) return;
        lastDestination = destination;
        window.scrollTo({ top: destination, behavior: animate ? 'smooth' : 'instant' });
      } else target.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    // Restore before paint, then correct any font-driven layout shift.
    // Do not hold direct links behind font loading or override user input.
    const cancel = () => { disposed = true; cancelAnimationFrame(frame); };
    const cancelOnFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !document.getElementById(fragment)?.contains(event.target)) cancel();
    };
    const schedule = () => {
      if (disposed) return;
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(scrollToTarget); });
    };
    scrollToTarget();
    void document.fonts.ready.then(schedule);
    if (smooth) document.fonts.addEventListener('loadingdone', schedule);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel);
    window.addEventListener('keydown', cancel);
    window.addEventListener('focusin', cancelOnFocus);
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
      window.removeEventListener('focusin', cancelOnFocus);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [fragment, smooth, request]);
  return null;
}
