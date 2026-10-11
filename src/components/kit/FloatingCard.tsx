import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionTokens } from './motion';

type FloatingCardProps = {
  children: ReactNode;
  className?: string;
  order?: number;
};

// White UI fragment that overlaps an image edge. Enters once, after the media.
export default function FloatingCard({ children, className = '', order = 0 }: FloatingCardProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: motionTokens.reveal, delay: 0.35 + order * motionTokens.stagger, ease: motionTokens.easeOut }}
      className={`absolute rounded-2xl border border-slate-200/70 bg-white p-4 text-ink shadow-[0_18px_40px_-18px_rgba(11,36,97,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
