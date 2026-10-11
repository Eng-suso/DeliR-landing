import type { ReactNode } from 'react';
import DarkAnimatedBackground from '../DarkAnimatedBackground';

// Light tones stay transparent so the page-level PremiumBackground shows through;
// dark tones carry their own animated diagonal lines.
const tones = {
  white: { surface: 'text-ink', dark: false },
  mist: { surface: 'bg-mist/70 text-ink', dark: false },
  navy: { surface: 'bg-navy text-white', dark: true },
  royal: { surface: 'bg-royal text-white', dark: true },
} as const;

type BandProps = {
  tone?: keyof typeof tones;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

export default function Band({ tone = 'white', id, labelledBy, className = '', children }: BandProps) {
  const { surface, dark } = tones[tone];
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative overflow-hidden py-20 sm:py-28 ${surface} ${className}`}>
      {dark ? <DarkAnimatedBackground /> : null}
      <div className="kit-shell relative z-10">{children}</div>
    </section>
  );
}
