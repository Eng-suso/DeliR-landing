import { useLanguage } from '../i18n/LanguageContext';
import { Files, ScanSearch, Workflow, ChartNoAxesCombined } from 'lucide-react';

const stageIcons = [Files, ScanSearch, Workflow, ChartNoAxesCombined];

const copy = {
  it: {
    eyebrow: 'Per te, consulente Operations',
    title: 'Il problema non è mappare i processi. È ricostruire la realtà.',
    body: 'Ogni incarico riparte da qui: raccogliere informazioni, rincorrere dettagli mancanti, ricostruire il contesto, mappare l’As-Is e verificare le ipotesi. Poi arriva la parte più difficile: trasformare tutto questo in decisioni che il cliente possa sostenere.',
    chain: [
      ['01', 'Informazioni disperse', 'Documenti, interviste e appunti sono in strumenti diversi. Ritrovare una risposta significa cercare di nuovo.'],
      ['02', 'Evidenze scollegate', 'Le prove restano nei documenti, separate dalle decisioni che dovrebbero sostenere.'],
      ['03', 'Mappe da aggiornare', 'Il processo cambia, ma la mappa resta ferma. Tra progetti e persone, il contesto si perde.'],
      ['04', 'Alternative difficili da confrontare', 'Devi raccomandare un cambiamento senza un confronto chiaro tra le diverse opzioni To-Be.'],
    ],
    caption: 'La competenza non ti manca. È il lavoro intorno alla tua competenza che ti rallenta: ogni ora spesa a ricostruire il contesto è un’ora sottratta al miglioramento del processo.',
  },
  en: {
    eyebrow: 'Dear Operations Consultant',
    title: 'Process Mapping Isn’t the Problem, Reconstructing Reality Is',
    body: 'Every engagement starts with the same work. Collect information. Chase missing details. Rebuild context. Map the As-Is. Validate assumptions. Then the hard part begins: turning all that information into decisions your client can trust.',
    chain: [
      ['01', 'Scattered knowledge', 'Documents, interviews and notes live in different tools. Finding an answer means searching all over again.'],
      ['02', 'Disconnected evidence', 'Evidence stays buried in documents, separated from the decisions it should support.'],
      ['03', 'Outdated process maps', 'The process changes while the map stands still. Context gets lost between projects and people.'],
      ['04', 'Hard-to-compare options', 'You need to recommend a change without a clear comparison of the different To-Be options.'],
    ],
    caption: 'You are not short on expertise. The work around your expertise slows you down. Every hour spent rebuilding context is an hour not spent improving the process.',
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
                <p className="mt-2 max-w-[18rem] text-[15px] leading-6 text-slate-300">{detail}</p>
              </div>;
            })}
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-base leading-7 text-blue-200 sm:text-lg sm:leading-8">{t.caption}</p>
      </div>
    </section>
  );
}
