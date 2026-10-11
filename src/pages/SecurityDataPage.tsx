import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref } from '../lib/publicOffer';
import '../styles/premium-landing.css';

const copy = {
  it: {
    back: 'Torna al prodotto', eyebrow: 'Prima di condividere dati reali', title: 'Sicurezza e dati',
    intro: 'I requisiti del tuo cliente entrano nel perimetro del pilot. Qui trovi cosa sappiamo oggi e quali dettagli devono essere documentati prima di caricare le sue fonti.',
    statusTitle: 'Una pagina di orientamento, non un accordo di trattamento.',
    status: 'La configurazione dei dati del prodotto non è ancora pubblicata. Questa pagina indica i punti da definire per il progetto; non attesta controlli già verificati né sostituisce la documentazione del pilot.',
    websiteTitle: 'Il sito e i dati del tuo cliente sono due contesti distinti.',
    website: 'La landing è ospitata su IONOS Hosting Plus. Questo non identifica l’hosting dei documenti o dei dati di un pilot DeliR. La privacy del sito, dei contatti e dei cookie è descritta separatamente.',
    privacy: 'Leggi privacy e cookie', scopeTitle: 'Cosa definiamo prima del pilot',
    sections: [
      ['Workspace e accessi', 'Il principio progettuale è un workspace distinto per ogni incarico. Prima dell’uso di dati reali vanno verificati isolamento, autenticazione, ruoli, persone autorizzate e accessi di assistenza nella configurazione effettiva del progetto.'],
      ['Hosting e localizzazione', 'Da documentare: provider, entità contrattuale, paesi di archiviazione e trattamento, localizzazione dei backup e accessi remoti. Non è ancora confermato dove verranno gestiti i dati dei pilot.'],
      ['Conservazione', 'Da concordare: durata per documenti, interviste, modelli, log e copie di backup, con criteri di scadenza. I tempi dell’informativa del sito non sono i tempi di conservazione dei dati del tuo cliente.'],
      ['AI e utilizzo delle fonti', 'Da verificare per ogni provider: dati inviati, finalità, conservazione, log, eventuale uso per addestramento e opzioni di esclusione. Non dichiariamo un’esclusione dall’addestramento finché le condizioni del provider non sono verificate.'],
      ['Provider e sub-responsabili', 'L’elenco dei fornitori che tratteranno dati per il progetto va definito con servizio, entità, ruolo e paese. Se operano come sub-responsabili, autorizzazioni e gestione delle modifiche vanno disciplinate nell’accordo applicabile.'],
      ['Responsabilità e DPA', 'I ruoli privacy dipendono dalle attività effettive. Quando DeliR tratta dati personali per conto del cliente, il rapporto richiede un accordo ai sensi dell’articolo 28 GDPR: istruzioni, riservatezza, misure, assistenza, sub-responsabili e verifiche. Un DPA non è ancora pubblicato qui.'],
      ['Restituzione e cancellazione', 'Da definire: modalità e formati di restituzione, cancellazione a fine servizio, tempi per le copie residue e i backup, eventuali obblighi di conservazione e conferma dell’esecuzione.'],
      ['Trasferimenti internazionali', 'La verifica deve includere provider e accessi da paesi fuori dallo SEE. Se vi sono trasferimenti, vanno individuati il meccanismo previsto dal GDPR e le garanzie necessarie per il caso concreto prima del trattamento.'],
    ],
    nextTitle: 'Partiamo dai requisiti, poi dalle fonti.',
    next: 'Nel primo messaggio descrivi il processo, l’obiettivo e i vincoli del cliente. Prima dei dati reali, il perimetro del pilot e la documentazione applicabile devono chiarire questi punti.',
    contact: 'Parliamo dei requisiti del tuo cliente', note: 'Non inviare documenti riservati o dati del cliente nel primo messaggio.',
    references: 'Riferimenti per le responsabilità privacy', edpb: 'EDPB: titolare, responsabile e accordi di trattamento', gdpr: 'GDPR: articoli 5, 28, 32 e 44–49',
  },
  en: {
    back: 'Back to the product', eyebrow: 'Before sharing real data', title: 'Security & Data',
    intro: 'Your client’s requirements are part of the pilot scope. Here is what we know today and what needs to be documented before uploading their sources.',
    statusTitle: 'An overview, not a data processing agreement.',
    status: 'The product’s data configuration has not been published yet. This page sets out the points to define for the project; it does not certify verified controls or replace the pilot documentation.',
    websiteTitle: 'The website and your client’s data are separate contexts.',
    website: 'The landing page is hosted on IONOS Hosting Plus. This does not identify the hosting of documents or data for a DeliR pilot. Website, contact and cookie privacy is described separately.',
    privacy: 'Read privacy and cookies', scopeTitle: 'What we define before the pilot',
    sections: [
      ['Workspaces and access', 'The design principle is a separate workspace for each engagement. Before using real data, isolation, authentication, roles, authorised people and support access need to be verified in the project’s actual configuration.'],
      ['Hosting and location', 'To document: provider, contracting entity, storage and processing countries, backup locations and remote access. Where pilot data will be handled has not been confirmed yet.'],
      ['Retention', 'To agree: retention periods for documents, interviews, models, logs and backups, with expiry criteria. The website privacy notice’s retention periods are not the retention periods for your client’s data.'],
      ['AI and source use', 'To verify for each provider: data sent, purposes, retention, logs, possible training use and opt-out options. We do not claim training exclusion until the provider’s terms have been verified.'],
      ['Providers and subprocessors', 'The project’s data-handling providers need to be listed with service, entity, role and country. Where they act as subprocessors, authorisations and change procedures need to be covered in the applicable agreement.'],
      ['Responsibilities and DPA', 'Privacy roles depend on the actual activities. When DeliR processes personal data on the client’s behalf, the relationship requires an agreement under GDPR Article 28 covering instructions, confidentiality, measures, assistance, subprocessors and verification. A DPA has not been published here yet.'],
      ['Return and deletion', 'To define: return methods and formats, deletion at the end of service, timelines for remaining copies and backups, any retention obligations and confirmation of completion.'],
      ['International transfers', 'The assessment needs to include providers and access from countries outside the EEA. Where transfers occur, the GDPR mechanism and safeguards needed for the specific case must be identified before processing.'],
    ],
    nextTitle: 'Start with requirements, then sources.',
    next: 'In your first message, describe the process, objective and client constraints. Before using real data, the pilot scope and applicable documentation must address these points.',
    contact: 'Discuss your client’s requirements', note: 'Do not send confidential documents or client data in your first message.',
    references: 'Privacy responsibility references', edpb: 'EDPB: controllers, processors and processing agreements', gdpr: 'GDPR: Articles 5, 28, 32 and 44–49',
  },
};

export default function SecurityDataPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return <div className="offer-page min-h-dvh bg-white">
    <SkipLink />
    <header className="border-b border-slate-200"><div className="section-shell flex min-h-20 items-center justify-between gap-4">
      <Link to={language === 'it' ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue">← {t.back}</Link><LanguageSwitch />
    </div></header>
    <main id="main-content" tabIndex={-1} className="section-shell py-12 sm:py-20">
      <div className="max-w-3xl"><p className="landing-eyebrow">{t.eyebrow}</p><h1 className="landing-title mt-5">{t.title}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{t.intro}</p></div>
      <aside aria-labelledby="security-status-title" className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-brand-light p-6">
        <h2 id="security-status-title" className="text-lg font-semibold text-brand-ink">{t.statusTitle}</h2><p className="mt-3 text-base leading-7 text-slate-600">{t.status}</p>
      </aside>
      <section aria-labelledby="website-data-title" className="mt-12 max-w-3xl">
        <h2 id="website-data-title" className="font-display text-2xl font-semibold text-brand-ink">{t.websiteTitle}</h2><p className="mt-4 text-base leading-7 text-slate-600">{t.website}</p>
        <Link to={language === 'it' ? '/privacy' : '/privacy?lang=en'} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{t.privacy}</Link>
      </section>
      <section aria-labelledby="pilot-data-title" className="mt-12">
        <h2 id="pilot-data-title" className="font-display text-2xl font-semibold text-brand-ink">{t.scopeTitle}</h2>
        <dl className="mt-6 grid gap-5 md:grid-cols-2">{t.sections.map(([title, body]) => <div key={title} className="rounded-2xl border border-slate-200 p-6"><dt className="text-lg font-semibold text-brand-ink">{title}</dt><dd className="mt-3 text-base leading-7 text-slate-600">{body}</dd></div>)}</dl>
      </section>
      <section aria-labelledby="security-contact-title" className="mt-12 max-w-3xl border-l-2 border-brand-blue pl-6">
        <h2 id="security-contact-title" className="font-display text-2xl font-semibold text-brand-ink">{t.nextTitle}</h2><p className="mt-4 text-base leading-7 text-slate-600">{t.next}</p>
        <a href={projectContactHref(language)} className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{t.contact}<span aria-hidden="true" className="ml-2">→</span></a><p className="mt-2 text-sm leading-6 text-slate-600">{t.note}</p>
      </section>
      <nav aria-label={t.references} className="mt-12 flex flex-col items-start gap-2 border-t border-slate-200 pt-6 text-sm">
        <a className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4" href="https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en">{t.edpb}</a>
        <a className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4" href="https://eur-lex.europa.eu/eli/reg/2016/679/oj">{t.gdpr}</a>
      </nav>
    </main><Footer />
  </div>;
}
