import { useEffect } from 'react';

// Scroll-linked effects run in the compositor. Reveals use native Web Animations;
// content remains readable before JavaScript loads and if animation is unavailable.
export default function ScrollExperience() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.landing-page');
    const progress = root?.querySelector<HTMLElement>('[data-scroll-progress]');
    if (!root || !progress) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const seen = new WeakSet<Element>();
    const observed = new WeakSet<Element>();
    const animations = new Map<HTMLElement, Animation>();
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
    };
    const scheduleProgress = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting || element.closest('[hidden]')) continue;
        observer.unobserve(element);
        if (seen.has(element)) continue;
        seen.add(element);
        // Deep links, focus and reduced motion must never wait for a reveal.
        const linkedSection = document.getElementById(window.location.hash.slice(1))?.closest('section');
        if (motion.matches || saveData || linkedSection?.contains(element) || element.contains(document.activeElement)) continue;
        const animation = element.animate([
          { opacity: 1, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], {
          duration: 620, delay: Math.min(180, Number(element.dataset.revealDelay) || 0),
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
        animations.set(element, animation);
        animation.onfinish = () => animations.delete(element);
      }
    }, { threshold: 0.12 });
    const scan = () => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        if (!observed.has(element)) { observed.add(element); observer.observe(element); }
      });
    };
    const mutations = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes].some(node => node instanceof HTMLElement))) scan();
    });
    const cancelAnimations = () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const onMotionChange = () => {
      root.dataset.motion = motion.matches || saveData ? 'reduced' : 'full';
      if (motion.matches) cancelAnimations();
    };
    const onFocus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>('[data-reveal]');
      if (element) { animations.get(element)?.cancel(); animations.delete(element); }
    };
    const onVisibility = () => animations.forEach(animation => document.hidden ? animation.pause() : animation.play());

    onMotionChange();
    scan();
    updateProgress();
    mutations.observe(root, { childList: true, subtree: true });
    const resize = new ResizeObserver(scheduleProgress);
    resize.observe(root);
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    window.addEventListener('hashchange', cancelAnimations);
    root.addEventListener('focusin', onFocus);
    motion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect(); mutations.disconnect(); resize.disconnect();
      cancelAnimationFrame(frame); cancelAnimations(); delete root.dataset.motion;
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleProgress);
      window.removeEventListener('hashchange', cancelAnimations);
      root.removeEventListener('focusin', onFocus);
      motion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return null;
}
