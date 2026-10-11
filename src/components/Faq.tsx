import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Prima di scegliere il pilot', title: 'Le domande che contano per iniziare.',
    faqs: [
      ['Quanto costa il pilot e come si paga?', 'Il pilot è a pagamento. Il preventivo definisce importi e ripartizione: una quota alla firma e quote collegate agli obiettivi AS-IS, TO-BE e alla consegna al process owner. Perimetro e criteri di accettazione vengono concordati prima della firma.'],
      ['Quanto dura e quali output ricevo?', 'Il perimetro proposto comprende un modello BPMN As-Is con fonti e punti aperti, ipotesi To-Be e confronto degli scenari con parametri e assunzioni espliciti. Durata, attività, formati e consegna al responsabile del processo dipendono dall’incarico e vengono definiti nel preventivo prima della firma.'],
      ['Posso partire senza event log?', 'Sì. La discovery può partire da interviste, documenti, procedure e conoscenza operativa. Concordiamo quali fonti utilizzare e quali informazioni devono essere verificate prima di confermare il modello.'],
      ['Cosa devo inviare per il primo contatto?', 'Bastano una descrizione del processo, l’obiettivo e la tempistica. Non inviare documenti riservati o dati del cliente nel primo messaggio. Le condizioni per utilizzare le fonti nell’incarico si verificano prima del pilot.'],
      ['Come vengono gestiti i dati e l’AI?', 'DeliR è progettato con workspace separati tra clienti, separazione applicativa e database, autenticazione e accessi dedicati. I dati costruiscono il contesto per analisi e funzionalità AI. Le policy pubbliche su hosting, conservazione, cancellazione e uso dei dati da parte dei modelli AI sono in formalizzazione e saranno verificabili prima dei pilot.'],
      ['Le simulazioni sono risultati già ottenuti?', 'No. Il confronto AS-IS / TO-BE valuta scenari basati su parametri e assunzioni. I numeri nei video appartengono al caso dimostrativo. La proposta va verificata con il process owner; una simulazione non garantisce il risultato dell’implementazione.'],
      ['Chi conferma il modello e la raccomandazione?', 'La review resta umana. DeliR affianca al processo fonti, punti da discutere e proposte; il consulente e il process owner verificano le informazioni e prendono le decisioni.'],
    ],
  },
  en: {
    eyebrow: 'Before choosing a pilot', title: 'The questions that matter before starting.',
    faqs: [
      ['What does the pilot cost and how do payments work?', 'The pilot is paid. The quote sets amounts and payment stages: an initial payment at signing and further payments tied to AS-IS, TO-BE and process owner handover objectives. Scope and acceptance criteria are agreed before signing.'],
      ['How long does it take and what do I receive?', 'The proposed scope includes an As-Is BPMN model with sources and open questions, To-Be hypotheses and scenario comparison with explicit parameters and assumptions. Duration, activities, formats and process owner handover depend on the engagement and are defined in the quote before signing.'],
      ['Can I start without event logs?', 'Yes. Discovery can start with interviews, documents, procedures and operational knowledge. We agree which sources to use and what needs verification before confirming the model.'],
      ['What should I send in the first enquiry?', 'Describe the process, objective and timing. Do not send confidential documents or client data in your first message. Conditions for using engagement sources are reviewed before the pilot.'],
      ['How are data and AI handled?', 'DeliR is designed with separate client workspaces, application and database separation, authentication and dedicated access policies. Data builds the context for analysis and AI features. Public policies on hosting, retention, deletion and AI model data use are being formalized and will be available for verification before pilots.'],
      ['Are simulation numbers actual achieved results?', 'No. AS-IS / TO-BE comparison evaluates scenarios based on parameters and assumptions. Video numbers belong to the demo case. The proposal needs process owner review; simulation does not guarantee implementation outcomes.'],
      ['Who confirms the model and recommendation?', 'Review remains human. DeliR places sources, discussion points and proposals alongside the process; the consultant and process owner verify information and make decisions.'],
    ],
  },
} as const;

export default function Faq() {
  const { language } = useLanguage();
  const t = copy[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="premium-faq relative scroll-mt-28 border-t border-slate-200 bg-white py-20 sm:py-24" aria-labelledby="faq-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="faq-title" className="landing-title mt-6">{t.title}</h2></div>
        <div>
          {t.faqs.map(([question, answer], index) => {
            const open = openIndex === index;
            return <div data-reveal key={question} className="border-b border-slate-200">
              <button type="button" onClick={() => setOpenIndex(open ? null : index)} className="group flex min-h-16 w-full items-center justify-between py-5 text-left" aria-expanded={open} aria-controls={`faq-panel-${index}`}>
                <span className="pr-6 text-base font-medium text-brand-ink group-hover:text-brand-blue sm:text-lg">{question}</span>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${open ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-300 bg-white text-slate-500 group-hover:border-brand-blue group-hover:text-brand-blue'}`}>
                  {open ? <Minus aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
                </span>
              </button>
              <div id={`faq-panel-${index}`} role="region" aria-label={question} hidden={!open}>
                <p className="max-w-3xl pb-6 text-sm leading-7 text-slate-600 sm:text-base">{answer}</p>
              </div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
