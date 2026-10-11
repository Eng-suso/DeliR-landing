import { useLanguage } from '../../../i18n/LanguageContext';

// Share of throughput time spent waiting in the AS-IS simulation of the demo engagement.
const SHARE = 65;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const copy = {
  it: { caption: 'del tempo di attraversamento è attesa', source: 'Simulazione AS-IS · stima' },
  en: { caption: 'of throughput time is waiting', source: 'AS-IS simulation · estimate' },
} as const;

export default function WaitShareRing() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <div className="flex w-[14rem] items-center gap-3">
      <svg aria-hidden="true" focusable="false" width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90">
        <circle cx="32" cy="32" r={RADIUS} fill="none" strokeWidth="6" className="stroke-mist" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - SHARE / 100)}
          className="stroke-royal"
        />
      </svg>
      <div>
        <p className="font-grotesk text-[22px] font-medium leading-none tabular-nums">{SHARE}%</p>
        <p className="mt-1 text-[12px] leading-snug">{t.caption}</p>
        <p className="mt-1 text-[12px] text-muted">{t.source}</p>
      </div>
    </div>
  );
}
