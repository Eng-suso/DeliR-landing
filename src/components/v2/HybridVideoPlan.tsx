import { useLanguage } from '../../i18n/LanguageContext';
import { hybridDemoClips } from '../../content/hybridMedia';

export default function HybridVideoPlan() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <section id="piano-video" className="hybrid-video-plan border-y border-slate-200 bg-brand-mist py-10" aria-labelledby="video-plan-title">
    <div className="section-shell">
      <p className="landing-eyebrow">{it ? 'Piano di produzione' : 'Production plan'}</p>
      <h2 id="video-plan-title" className="mt-3 font-display text-2xl font-semibold">{it ? 'Le demo sono già disponibili.' : 'The demos are already available.'}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{it ? 'La versione ibrida riutilizza queste quattro registrazioni e le scene di approfondimento della V1. Nessun nuovo video è obbligatorio per completarla. Prima di registrare altro, verifica che il dettaglio sia leggibile sul telefono e nel video completo.' : 'The hybrid reuses these four recordings and V1’s supporting scenes. No new video is required to complete it. Before recording more, check that the detail is readable on a phone and in the full video.'}</p>
      <ol className="mt-6 grid gap-4 md:grid-cols-2">{hybridDemoClips.map(clip => {
        const localized = clip.localizedMedia?.[language];
        const source = localized?.mp4 ?? `/product-clips/${clip.id}.mp4`;
        return <li key={clip.id} className="hybrid-plan-card rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold">{clip.title[language]}</h3>
          <p className="mt-2 text-sm text-slate-600">{clip.width} × {clip.height} · {clip.duration}s</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{clip.description[language]}</p>
          <a href={source} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center break-all text-sm font-semibold text-brand-blue underline underline-offset-4">{it ? 'Apri registrazione esistente' : 'Open existing recording'}</a>
          <code className="mt-2 block break-all text-xs leading-6 text-slate-600">{source}</code>
        </li>;
      })}</ol>
      <p className="mt-5 max-w-3xl text-xs leading-6 text-slate-600">{it ? 'Il precedente registro Figma a sette slot rimane disponibile nel repository per eventuali nuovi export. Non è un requisito della versione ibrida. La hero ha registrazioni IT/EN; nelle altre scene la descrizione cambia lingua, mentre la UI registrata resta quella originale.' : 'The previous seven-slot Figma registry remains in the repository for optional future exports. It is not a hybrid requirement. The hero has IT/EN recordings; other scenes translate their descriptions while the recorded UI retains its original language.'}</p>
    </div>
  </section>;
}
