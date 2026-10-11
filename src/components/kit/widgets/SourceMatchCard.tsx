import { CircleCheck } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';

// Values mirror the Purchase-to-Pay demo engagement shown in the product screenshots.
const copy = {
  it: {
    title: 'Confronto con le fonti',
    status: 'Il disegno coincide con le fonti',
    meta: '4 fonti confrontate',
    rows: [['Citati parola per parola', '4'], ['Riformulati', '1'], ['Da confermare', '0']],
  },
  en: {
    title: 'Source comparison',
    status: 'The model matches its sources',
    meta: '4 sources compared',
    rows: [['Quoted verbatim', '4'], ['Paraphrased', '1'], ['To confirm', '0']],
  },
} as const;

export default function SourceMatchCard() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <div className="w-[15.5rem]">
      <p className="text-[12px] font-medium text-muted">{t.title}</p>
      <p className="mt-2 flex items-start gap-1.5 text-[14px] font-medium leading-snug">
        <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-signal-ok" />
        {t.status}
      </p>
      <p className="mt-1 pl-[1.375rem] text-[12px] text-muted">{t.meta}</p>
      <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[12px]">
        {t.rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
