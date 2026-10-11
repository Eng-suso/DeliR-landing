import { ArrowRight, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Un contesto che non si spezza',
    title: 'Dallo stack frammentato a un incarico coerente.',
    before: 'Stack frammentato',
    after: 'DeliR',
    rows: [
      ['Il contesto viene ricostruito a ogni fase', 'Il contesto accompagna l’intero incarico'],
      ['Fonti, modelli e analisi vivono separati', 'Evidenze, processi e KPI rimangono collegati'],
      ['Le decisioni restano in slide, email e memoria', 'Assunzioni e decisioni sono esplicite e verificabili'],
      ['Il deliverable chiude il progetto', 'Metodo e conoscenza restano disponibili nel tempo'],
      ['Ogni incarico riparte da una pagina vuota', 'La practice parte dal proprio metodo consolidato'],
    ],
    closing: 'Non serve aggiungere un altro passaggio allo stack. Serve mantenere coerenti quelli che già compongono l’incarico.',
  },
  en: {
    eyebrow: 'Context that does not break',
    title: 'From a fragmented stack to a coherent engagement.',
    before: 'Fragmented stack',
    after: 'DeliR',
    rows: [
      ['Context is rebuilt at every stage', 'Context follows the entire engagement'],
      ['Sources, models and analysis live separately', 'Evidence, processes and KPIs remain connected'],
      ['Decisions stay in slides, email and memory', 'Assumptions and decisions are explicit and verifiable'],
      ['The deliverable closes the project', 'Method and knowledge remain available over time'],
      ['Every engagement starts from a blank page', 'The practice starts from its consolidated method'],
    ],
    closing: 'You do not need another step in the stack. You need to keep the steps that already make up the engagement coherent.',
  },
} as const;

export default function Differentiation() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section className="section-defer relative bg-white py-24 sm:py-28" aria-labelledby="comparison-title">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center"><p className="section-kicker justify-center">{t.eyebrow}</p><h2 id="comparison-title" className="section-title mt-6">{t.title}</h2></div>
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-52px_rgba(15,23,42,0.55)]">
          <div className="grid grid-cols-[1fr_auto_1fr] border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold sm:px-6"><span className="text-slate-500">{t.before}</span><span aria-hidden="true" /><span className="text-blue-700">{t.after}</span></div>
          {t.rows.map(([before, after]) => <div key={before} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-slate-200 px-4 py-5 last:border-b-0 sm:gap-6 sm:px-6"><p className="flex items-start gap-2 text-sm leading-6 text-slate-500"><X aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-400" />{before}</p><ArrowRight aria-hidden="true" className="h-4 w-4 text-slate-300" /><p className="flex items-start gap-2 text-sm font-medium leading-6 text-slate-900"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-blue-700" />{after}</p></div>)}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-balance text-xl font-semibold leading-8 text-slate-900">{t.closing}</p>
      </div>
    </section>
  );
}
