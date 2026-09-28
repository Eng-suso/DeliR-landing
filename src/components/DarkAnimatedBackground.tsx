import { motion, useReducedMotion } from 'motion/react';

export default function DarkAnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div data-testid="dark-background" aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        focusable="false"
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dark-gradient-1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dark-gradient-2" x1="80%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dark-gradient-3" x1="100%" y1="20%" x2="0%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g
          initial={false}
          animate={reduceMotion ? undefined : { opacity: [0.82, 1, 0.82], x: [0, 2, 0], y: [0, -1.5, 0], scale: [1, 1.01, 1] }}
          transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <path fill="url(#dark-gradient-1)" d="M 100 0 C 60 20, 40 60, 0 100 L 100 100 Z" />
          <path fill="url(#dark-gradient-2)" d="M 80 -20 C 50 30, 20 70, -20 90 L -20 -20 Z" />
          <path fill="url(#dark-gradient-3)" d="M 120 0 C 80 40, 50 90, 20 120 L 120 120 Z" />
          <path fill="none" stroke="#ffffff" strokeWidth="0.15" opacity="0.8" d="M 100 0 C 60 20, 40 60, 0 100" />
          <path fill="none" stroke="#ffffff" strokeWidth="0.1" opacity="0.6" d="M 90 -20 C 50 30, 20 70, -10 110" />
          <path fill="none" stroke="#ffffff" strokeWidth="0.2" opacity="0.5" d="M 110 -10 C 70 30, 50 80, 10 120" />
          <path fill="none" stroke="#ffffff" strokeWidth="0.1" opacity="0.4" d="M 60 -20 C 60 30, 10 60, -20 80" />
        </motion.g>
      </svg>
    </div>
  );
}
