import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // The lazy-loaded page restores section anchors once its content is mounted.
    if (window.location.hash) return;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    const resetScroll = () => {
      // A link can be followed before the initial animation frame runs.
      if (window.location.hash) return;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
