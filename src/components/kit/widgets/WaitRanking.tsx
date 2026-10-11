import { useLanguage } from '../../../i18n/LanguageContext';

// Average wait per activity from the Purchase-to-Pay demo heatmap (minutes).
const rows = [
  { it: 'Emetti ordine', en: 'Issue order', minutes: 165, label: '2h 45min' },
  { it: 'Integra informazioni', en: 'Add information', minutes: 130, label: '2h 10min' },
  { it: 'Verifica richiesta', en: 'Review request', minutes: 95, label: '1h 35min' },
  { it: 'Compila richiesta', en: 'Fill in request', minutes: 60, label: '1h' },
];

const copy = {
  it: { title: 'Classifica per attesa', bottleneck: 'Collo di bottiglia' },
  en: { title: 'Ranking by wait time', bottleneck: 'Bottleneck' },
} as const;

export default function WaitRanking() {
  const { language } = useLanguage();
  const t = copy[language];
  const max = rows[0].minutes;
  return (
    <div className="w-[15.5rem]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-medium text-muted">{t.title}</p>
        <p className="flex items-center gap-1 text-[12px] font-medium text-signal-wait">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal-wait" />
          {t.bottleneck}
        </p>
      </div>
      <ol className="mt-3 space-y-2.5">
        {rows.map((row, index) => (
          <li key={row.en} className="text-[12px]">
            <div className="flex items-center justify-between gap-2">
              <span className={index === 0 ? 'font-medium' : 'text-muted'}>{row[language]}</span>
              <span className="font-medium tabular-nums">{row.label}</span>
            </div>
            <div aria-hidden="true" className="mt-1 h-1 rounded-full bg-mist">
              <div
                className={`h-full rounded-full ${index === 0 ? 'bg-signal-wait' : 'bg-royal'}`}
                style={{ width: `${(row.minutes / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
