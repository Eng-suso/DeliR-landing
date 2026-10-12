import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Dati e AI', title: 'Il contesto del tuo cliente merita regole chiare.',
    intro: 'DeliR lavora con documenti, interviste e conoscenza interna dell’azienda. Per questo la gestione dei dati non è una nota a fondo pagina.',
    items: [
      ['Clienti separati', 'Ogni incarico vive in un workspace distinto, con autenticazione e controlli di accesso dedicati.'],
      ['AI con contesto controllato', 'I dati vengono utilizzati per comprendere i processi e supportare le funzionalità AI del progetto.'],
      ['Regole chiare prima del pilot', 'Prima di utilizzare dati reali definiamo hosting, conservazione, cancellazione, provider AI e accessi applicabili al progetto.'],
    ],
    promise: 'Non ti chiediamo di fidarti di una promessa generica. Ti diciamo come vengono gestiti i dati prima che tu li carichi.',
    details: 'Approfondisci sicurezza e dati', contact: 'Parliamo dei requisiti del tuo cliente',
  },
  en: {
    eyebrow: 'Data and AI', title: 'Your client’s context deserves clear rules.',
    intro: 'DeliR works with documents, interviews and internal company knowledge. That makes data handling more than a footnote.',
    items: [
      ['Separate client workspaces', 'Each engagement lives in a separate workspace, with authentication and dedicated access controls.'],
      ['AI with controlled context', 'Data is used to understand processes and support the project’s AI features.'],
      ['Clear rules before the pilot', 'Before using real data, we define hosting, retention, deletion, AI providers and project access.'],
    ],
    promise: 'We do not ask you to trust a generic promise. We explain how your data will be handled before you upload it.',
    details: 'Explore Security & Data', contact: 'Discuss your client’s requirements',
  },
};

export default function BuiltFor() {
  const { language } = useLanguage(); const t = copy[language];
  return <section id="fiducia" className="premium-trust scroll-mt-24 border-y border-slate-200 bg-brand-light py-14 sm:py-20" aria-labelledby="trust-title">
    <div id="consulenti" className="section-shell grid gap-10 lg:grid-cols-2">
      <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="trust-title" className="landing-title mt-5">{t.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{t.intro}</p>
        <p className="mt-7 border-l-2 border-brand-blue pl-5 text-base font-semibold leading-7 text-brand-ink">{t.promise}</p>
        <Link to={language === 'it' ? '/security-data' : '/security-data?lang=en'} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.details}</Link>
      </div>
      <div className="trust-facts"><dl className="divide-y divide-slate-300">{t.items.map(([title, body]) => <div data-reveal key={title} className="py-5 first:pt-0"><dt className="text-lg font-semibold text-brand-ink">{title}</dt><dd className="mt-2 text-sm leading-7 text-slate-600">{body}</dd></div>)}</dl><a href={projectContactHref(language)} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.contact}<span aria-hidden="true" className="ml-2">→</span></a></div>
    </div>
  </section>;
}
