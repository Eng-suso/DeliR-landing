import { motion, useReducedMotion } from 'motion/react';

export default function PremiumBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div data-testid="page-background" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#FAFAF8]">
      <svg
        focusable="false"
        className="absolute -left-[25vw] -top-[25vh] min-h-[150vh] min-w-[150vw] opacity-[0.85]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="premium-gradient-1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="premium-gradient-2" x1="80%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="premium-gradient-3" x1="100%" y1="20%" x2="0%" y2="80%">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g
          initial={false}
          animate={reduceMotion ? undefined : { opacity: [0.88, 1, 0.88], x: [0, -3, 0], y: [0, 2, 0], scale: [1, 1.012, 1] }}
          transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <path fill="url(#premium-gradient-1)" d="M 100 0 C 60 20, 40 60, 0 100 L 100 100 Z" />
          <path fill="url(#premium-gradient-2)" d="M 80 -20 C 50 30, 20 70, -20 90 L -20 -20 Z" />
          <path fill="url(#premium-gradient-3)" d="M 120 0 C 80 40, 50 90, 20 120 L 120 120 Z" />
          <path fill="none" stroke="#2563eb" strokeWidth="0.15" opacity="0.6" d="M 100 0 C 60 20, 40 60, 0 100" />
          <path fill="none" stroke="#1d4ed8" strokeWidth="0.1" opacity="0.5" d="M 90 -20 C 50 30, 20 70, -10 110" />
          <path fill="none" stroke="#3b82f6" strokeWidth="0.2" opacity="0.4" d="M 110 -10 C 70 30, 50 80, 10 120" />
          <path fill="none" stroke="#60a5fa" strokeWidth="0.1" opacity="0.5" d="M 60 -20 C 60 30, 10 60, -20 80" />
        </motion.g>
      </svg>
    </div>
  );
}
