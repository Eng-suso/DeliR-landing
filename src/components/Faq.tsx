import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Domande frequenti',
    title: 'Chiarezza prima di iniziare.',
    faqs: [
      ['DeliR è un software di Process Mining?', 'DeliR include capacità di Process Mining, ma non si limita all’analisi degli event log. Collega discovery, process intelligence, simulazione, trasformazione, sistemi di gestione e memoria nello stesso contesto di incarico.'],
      ['Posso partire senza event log?', 'Sì. Un incarico può partire da interviste, documenti, procedure e conoscenza operativa. Quando sono disponibili dati evento adeguati, il Process Mining aggiunge una vista quantitativa sul comportamento reale del processo.'],
      ['DeliR sostituisce il consulente?', 'No. DeliR struttura fonti, evidenze, modelli e scenari e rende esplicite contraddizioni e assunzioni. La verifica, la decisione e la responsabilità professionale restano al consulente.'],
      ['Discovery, Mining e Process Intelligence sono la stessa cosa?', 'No. La discovery ricostruisce ciò che sappiamo; il mining osserva ciò che emerge dai dati evento; la process intelligence collega entrambe le prospettive a processi, KPI, rischi e decisioni.'],
      ['Le simulazioni prevedono con certezza il risultato?', 'No. Sono stime basate sui dati, sui vincoli e sulle assunzioni disponibili. DeliR rende questi elementi visibili per consentire una valutazione consapevole.'],
      ['Cosa comprende Transformation & Delivery?', 'Collega la raccomandazione a business case, requisiti, responsabilità, SOP, roadmap e piano di implementazione, così che la decisione possa essere portata nel lavoro reale.'],
      ['Come rientrano i sistemi di gestione?', 'Management Systems collega requisiti, rischi, controlli, owner, procedure, audit e azioni correttive al contesto operativo dell’organizzazione.'],
      ['Che cosa conserva Company Memory?', 'Conserva il contesto autorizzato dell’incarico: fonti, processi, sistemi, decisioni, KPI, requisiti e cambiamenti, mantenendo separati i diversi clienti.'],
      ['Per chi è pensato il pilot?', 'Per consulenti BPM e Operations indipendenti e piccole practice con un incarico reale attivo o in partenza.'],
      ['Il pilot comporta un abbonamento?', 'No. Il pilot è accompagnato, ha un perimetro concordato e non attiva automaticamente un abbonamento.'],
    ],
  },
  en: {
    eyebrow: 'Frequently asked questions',
    title: 'Clarity before starting.',
    faqs: [
      ['Is DeliR Process Mining software?', 'DeliR includes Process Mining capabilities, but is not limited to event-log analysis. It connects discovery, process intelligence, simulation, transformation, management systems and memory in one engagement context.'],
      ['Can I start without event logs?', 'Yes. An engagement can begin with interviews, documents, procedures and operational knowledge. When suitable event data is available, Process Mining adds a quantitative view of actual process behavior.'],
      ['Does DeliR replace the consultant?', 'No. DeliR structures sources, evidence, models and scenarios and makes contradictions and assumptions explicit. Verification, decisions and professional accountability remain with the consultant.'],
      ['Are Discovery, Mining and Process Intelligence the same?', 'No. Discovery reconstructs what is known; mining observes what emerges from event data; process intelligence connects both perspectives to processes, KPIs, risks and decisions.'],
      ['Do simulations predict outcomes with certainty?', 'No. They are estimates based on available data, constraints and assumptions. DeliR makes these visible so the consultant can make an informed assessment.'],
      ['What does Transformation & Delivery include?', 'It connects the recommendation to the business case, requirements, responsibilities, SOPs, roadmap and implementation plan so the decision can be carried into real work.'],
      ['How do management systems fit?', 'Management Systems connects requirements, risks, controls, owners, procedures, audits and corrective actions to the organization’s operating context.'],
      ['What does Company Memory retain?', 'It retains the authorized engagement context: sources, processes, systems, decisions, KPIs, requirements and change while keeping different clients separate.'],
      ['Who is the pilot for?', 'Independent BPM and operations consultants and small practices with an active or upcoming real engagement.'],
      ['Does the pilot create a subscription?', 'No. The pilot is guided, has an agreed scope and does not automatically activate a subscription.'],
    ],
  },
} as const;

export default function Faq() {
  const { language } = useLanguage();
  const t = copy[language];
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="section-defer relative scroll-mt-28 bg-slate-50 py-24 sm:py-28" aria-labelledby="faq-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div><p className="section-kicker">{t.eyebrow}</p><h2 id="faq-title" className="section-title mt-6">{t.title}</h2></div>
        <div>
          {t.faqs.map(([question, answer], index) => { const open = openIndex === index; return <div key={question} className="border-b border-slate-200"><button type="button" onClick={() => setOpenIndex(open ? null : index)} className="group flex min-h-16 w-full items-center justify-between py-5 text-left" aria-expanded={open} aria-controls={`faq-panel-${index}`}><span className="pr-8 text-lg font-medium text-slate-900 group-hover:text-blue-700">{question}</span><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${open ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-500 group-hover:border-blue-700 group-hover:text-blue-700'}`}>{open ? <Minus aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}</span></button><AnimatePresence initial={false}>{open ? <motion.div id={`faq-panel-${index}`} role="region" aria-label={question} initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}><p className="max-w-3xl pb-6 leading-7 text-slate-600">{answer}</p></motion.div> : null}</AnimatePresence></div>; })}
        </div>
      </div>
    </section>
  );
}
