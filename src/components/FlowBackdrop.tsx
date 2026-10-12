import { useEffect, useId, useRef, useState } from 'react';
import '../styles/flow-backdrop.css';

// The landing uses diffuse clouds; local dark surfaces retain their ribbons.
// Move the containing layer, and pause off-screen, hidden or reduced-motion scenes.
export default function FlowBackdrop({ dark = false, fixed = false }: { dark?: boolean; fixed?: boolean }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden && !reducedMotion.matches && !saveData);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
    };
  }, []);
  const color = dark ? '#ffffff' : '#004580';
  return <div ref={ref} data-testid={fixed ? 'page-background' : 'dark-background'} data-running={running} aria-hidden="true" className={`flow-background ${fixed ? 'flow-background-fixed' : 'flow-background-local'} ${dark ? 'flow-background-dark' : ''}`}>
    <div className="flow-motion">
      {fixed ? <div className="cloud-field" /> : <svg focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${id}-1`} x1="100%" y1="0%" x2="0%" y2="100%"><stop stopColor={color} stopOpacity="0.06" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>
          <linearGradient id={`${id}-2`} x1="80%" y1="0%" x2="20%" y2="100%"><stop stopColor={color} stopOpacity="0.045" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>
          <linearGradient id={`${id}-3`} x1="100%" y1="20%" x2="0%" y2="80%"><stop stopColor={color} stopOpacity="0.035" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>
        </defs>
        <path fill={`url(#${id}-1)`} d="M 100 0 C 60 20, 40 60, 0 100 L 100 100 Z" />
        <path fill={`url(#${id}-2)`} d="M 80 -20 C 50 30, 20 70, -20 90 L -20 -20 Z" />
        <path fill={`url(#${id}-3)`} d="M 120 0 C 80 40, 50 90, 20 120 L 120 120 Z" />
        <g fill="none" stroke={color}>
          <path strokeWidth="0.1" opacity="0.18" d="M 100 0 C 60 20, 40 60, 0 100" />
          <path strokeWidth="0.075" opacity="0.15" d="M 90 -20 C 50 30, 20 70, -10 110" />
          <path strokeWidth="0.12" opacity="0.13" d="M 110 -10 C 70 30, 50 80, 10 120" />
          <path strokeWidth="0.075" opacity="0.15" d="M 60 -20 C 60 30, 10 60, -20 80" />
        </g>
      </svg>}
    </div>
  </div>;
}
