import { BarChart3, BookOpenCheck, ClipboardList, FileCheck2, Gauge, Route, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    chapter: '05 · Il valore consegnato',
    title: 'Il cliente non compra un diagramma. Compra un risultato utilizzabile.',
    body: 'DeliR aiuta la practice a produrre risultati distinti o combinati, mantenendo visibile il percorso che li sostiene.',
    outcomes: [
      ['Processo compreso e verificato', 'Una rappresentazione condivisa del lavoro reale, collegata alle fonti.'],
      ['Baseline e criticità quantificate', 'Tempi, code, varianti e vincoli resi leggibili per la decisione.'],
      ['Scenario futuro valutato', 'Alternative To-Be confrontate con assunzioni e trade-off espliciti.'],
      ['Business case e raccomandazione', 'Una decisione sostenuta da evidenze, KPI e condizioni di successo.'],
      ['Requisiti e piano di implementazione', 'Responsabilità, dipendenze, SOP, roadmap e automazioni da progettare.'],
      ['Sistema di gestione', 'Requisiti, rischi, controlli, audit e azioni correttive mantenuti coerenti.'],
      ['Governance e memoria organizzativa', 'Cambiamenti, versioni e impatti conservati oltre la consegna.'],
    ],
    closing: 'Il deliverable finale resta collegato alle fonti, alle assunzioni e alle decisioni che lo hanno prodotto.',
  },
  en: {
    chapter: '05 · The delivered value',
    title: 'The client does not buy a diagram. They buy an outcome they can use.',
    body: 'DeliR helps the practice produce distinct or combined outcomes while keeping the path that supports them visible.',
    outcomes: [
      ['A verified understanding of the process', 'A shared representation of real work, connected to its sources.'],
      ['A quantified baseline and constraints', 'Time, queues, variants and constraints made readable for decisions.'],
      ['An evaluated future scenario', 'To-Be alternatives compared with explicit assumptions and trade-offs.'],
      ['A business case and recommendation', 'A decision supported by evidence, KPIs and conditions for success.'],
      ['Requirements and an implementation plan', 'Responsibilities, dependencies, SOPs, roadmap and automation requirements.'],
      ['A management system', 'Requirements, risks, controls, audits and corrective actions kept coherent.'],
      ['Governance and organizational memory', 'Change, versions and impacts retained beyond delivery.'],
    ],
    closing: 'The final deliverable remains connected to the sources, assumptions and decisions that produced it.',
  },
} as const;

const icons = [FileCheck2, Gauge, Route, BarChart3, ClipboardList, ShieldCheck, BookOpenCheck];

export default function Outcomes() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section className="section-defer relative bg-brand-navy py-24 text-white sm:py-28" aria-labelledby="outcomes-title">
      <div className="section-shell">
        <div className="max-w-4xl">
          <p className="section-kicker !text-blue-300"><span className="h-px w-7 bg-blue-400" />{t.chapter}</p>
          <h2 id="outcomes-title" className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">{t.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t.body}</p>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-700 bg-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          {t.outcomes.map(([title, body], index) => {
            const Icon = icons[index];
            return <article key={title} className={`bg-slate-950 p-6 sm:p-7 ${index === 6 ? 'sm:col-span-2 lg:col-span-3' : ''}`}><Icon aria-hidden="true" className="h-5 w-5 text-blue-300" /><h3 className="mt-5 text-lg font-semibold text-white">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{body}</p></article>;
          })}
        </div>
        <p className="mt-10 max-w-4xl text-balance text-2xl font-medium leading-snug text-white">{t.closing}</p>
      </div>
    </section>
  );
}
