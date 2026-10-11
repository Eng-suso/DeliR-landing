import type { ReactNode } from 'react';

type EyebrowProps = {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
};

export default function Eyebrow({ children, tone = 'light', className = '' }: EyebrowProps) {
  const color = tone === 'dark' ? 'text-haze' : 'text-muted';
  return (
    <p className={`text-[13px] font-medium uppercase tracking-[0.08em] ${color} ${className}`}>
      <span aria-hidden="true">/ </span>
      {children}
    </p>
  );
}
