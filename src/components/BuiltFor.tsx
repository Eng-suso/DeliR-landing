import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Dati, AI e responsabilità', title: 'Il contesto del cliente merita regole chiare.',
    intro: 'Come viene gestito il contesto del tuo incarico. Le policy pubbliche sono in formalizzazione e saranno verificabili prima dell’avvio dei pilot.',
    items: [
      ['Separazione dei clienti', 'DeliR è progettato con separazione a livello applicativo e database, workspace distinti, autenticazione e policy di accesso dedicate.'],
      ['Contesto per l’analisi e l’AI', 'I dati aziendali vengono utilizzati per costruire il contesto necessario all’analisi dei processi e alle funzionalità AI.'],
      ['Policy da verificare prima del pilot', 'Hosting, conservazione, cancellazione e utilizzo dei dati da parte dei modelli AI sono in corso di formalizzazione. Richiedi le condizioni applicabili al tuo progetto.'],
    ],
    proofTitle: 'Esamina gli output nel caso dimostrativo.',
    proof: 'La demo sugli acquisti indiretti mostra un’attività BPMN con le sue fonti, un punto da chiarire e il confronto As-Is / To-Be. Puoi seguire i passaggi prima di valutare il pilot.',
    demoLink: 'Guarda il confronto degli scenari',
    proofScope: 'Validazione qualitativa del prodotto. Case study pubblici, testimonianze nominative e risultati misurati non sono ancora disponibili.',
    contact: 'Parliamo dei requisiti del tuo cliente',
  },
  en: {
    eyebrow: 'Data, AI and accountability', title: 'Client context needs clear rules.',
    intro: 'How your engagement context is handled. Public policies are being formalized and will be available for verification before pilots begin.',
    items: [
      ['Client separation', 'DeliR is designed with application and database separation, distinct workspaces, authentication and dedicated access policies.'],
      ['Context for analysis and AI', 'Company data builds the context required for process analysis and AI features.'],
      ['Policies to verify before the pilot', 'Hosting, retention, deletion and AI model data use policies are being formalized. Request the terms applicable to your project.'],
    ],
    proofTitle: 'Inspect the outputs in the demo case.',
    proof: 'The indirect procurement demo shows a BPMN activity alongside its sources, an open question and the As-Is / To-Be comparison. Follow the steps before assessing the pilot.',
    demoLink: 'Watch the scenario comparison',
    proofScope: 'Qualitative product validation. Public case studies, named testimonials and measured results are not yet available.',
    contact: 'Discuss your client’s requirements',
  },
};

export default function BuiltFor() {
  const { language } = useLanguage(); const t = copy[language];
  return <section id="fiducia" className="premium-trust scroll-mt-24 border-y border-slate-200 bg-brand-light py-14 sm:py-20" aria-labelledby="trust-title">
    <div id="consulenti" className="section-shell grid gap-10 lg:grid-cols-2">
      <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="trust-title" className="landing-title mt-5">{t.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{t.intro}</p>
        <div className="mt-7 border-l-2 border-brand-blue pl-5"><h3 className="text-lg font-semibold text-brand-ink">{t.proofTitle}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{t.proof}</p><a href={`${language === 'it' ? '/' : '/?lang=en'}#scene-confronto`} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.demoLink}</a><p className="mt-3 text-xs leading-5 text-slate-600">{t.proofScope}</p></div>
      </div>
      <div className="trust-facts"><dl className="divide-y divide-slate-300">{t.items.map(([title, body]) => <div data-reveal key={title} className="py-5 first:pt-0"><dt className="text-lg font-semibold text-brand-ink">{title}</dt><dd className="mt-2 text-sm leading-7 text-slate-600">{body}</dd></div>)}</dl><a href={projectContactHref(language)} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.contact}</a></div>
    </div>
  </section>;
}
