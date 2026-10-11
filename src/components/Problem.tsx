import { useLanguage } from '../i18n/LanguageContext';
import { Files, ScanSearch, Workflow, ChartNoAxesCombined } from 'lucide-react';

const stageIcons = [Files, ScanSearch, Workflow, ChartNoAxesCombined];

const copy = {
  it: {
    eyebrow: 'Perché DeliR',
    title: 'Una proposta che puoi spiegare, dall’inizio alla fine.',
    body: 'Un diagramma descrive il flusso. Un incarico richiede anche le fonti che lo giustificano, le questioni ancora aperte e le ipotesi dietro ogni scelta. DeliR mette questi elementi nello stesso spazio di lavoro.',
    chain: [
      ['01', 'Fonte', 'Interviste, documenti e dati dell’incarico'],
      ['02', 'Review', 'Fatti da verificare e decisioni da prendere'],
      ['03', 'Processo', 'Modello e criticità nel loro contesto'],
      ['04', 'Scenario', 'Assunzioni e impatto della raccomandazione'],
    ],
    caption: 'Una traccia continua dall’input alla raccomandazione.',
  },
  en: {
    eyebrow: 'Why DeliR',
    title: 'A proposal you can explain from start to finish.',
    body: 'A diagram describes the flow. An engagement also needs the sources behind it, unresolved questions, and assumptions behind each choice. DeliR brings these elements into one workspace.',
    chain: [
      ['01', 'Source', 'Interviews, documents, and engagement data'],
      ['02', 'Review', 'Facts to verify and decisions to make'],
      ['03', 'Process', 'Model and constraints in context'],
      ['04', 'Scenario', 'Assumptions and recommendation impact'],
    ],
    caption: 'A continuous trace from input to recommendation.',
  },
} as const;

export default function Problem() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="metodo" className="premium-method scroll-mt-24 bg-brand-navy py-12 text-white sm:py-16" aria-labelledby="problem-title">
      <div className="section-shell relative z-10">
        <div data-reveal className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-24">
          <div>
            <p className="landing-eyebrow text-blue-300">{t.eyebrow}</p>
            <h2 id="problem-title" className="mt-6 max-w-[17ch] text-balance font-display text-[clamp(2.4rem,4.4vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-white">{t.title}</h2>
          </div>
          <p className="max-w-[39rem] text-pretty text-[17px] leading-8 text-slate-300 lg:pb-2 lg:text-[19px] lg:leading-9">{t.body}</p>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.chain.map(([number, title, detail], index) => {
              const Icon = stageIcons[index];
              return <div data-reveal data-reveal-delay={index * 60} key={number} className="method-card relative border-t border-white/25 pt-5">
                <div className="flex items-center gap-4">
                  <span className="method-icon"><Icon aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                  <span className="method-number font-mono text-xs text-blue-300">{number}</span>
                </div>
                <h3 className="mt-6 font-display text-[26px] font-semibold tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-2 max-w-[15rem] text-[15px] leading-6 text-slate-300">{detail}</p>
              </div>;
            })}
          </div>
        </div>
        <p className="mt-10 text-xs text-blue-300">{t.caption}</p>
      </div>
    </section>
  );
}
