import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import { publicContactEmail } from '../lib/publicOffer';
import { analyticsAvailable } from '../privacy/settings';

const sections = {
  it: [
    ['Titolare e contatti', 'Il titolare del trattamento è Sohayb Raqaq, persona fisica che gestisce il progetto DeliR. Per informazioni sui dati personali e per esercitare i tuoi diritti puoi scrivere all’indirizzo indicato sotto.'],
    ['Navigazione e hosting', 'Il sito è destinato allo spazio web IONOS. Le richieste al server possono comportare il trattamento di indirizzo IP, data e ora, browser e risorse richieste per erogare e proteggere il sito. Prima della pubblicazione devono essere verificati i log effettivamente attivi, la loro conservazione, il soggetto contrattuale IONOS e le condizioni di trattamento.'],
    ['Contatto tramite email', 'Il collegamento email apre il tuo programma di posta. Se scrivi, il titolare riceve il tuo indirizzo e il contenuto del messaggio per rispondere alla richiesta attraverso Gmail gratuita. Non inviare dati di clienti o altre persone, documenti riservati o dati sensibili. Il titolare ha scelto di cancellare le richieste senza seguito entro 12 mesi dall’ultimo contatto; eventuali rapporti contrattuali richiedono criteri separati. La procedura di cancellazione, la base giuridica delle diverse richieste e le condizioni applicabili a Gmail devono essere definite prima della pubblicazione definitiva.'],
    ['Moduli e database', 'I moduli automatici di candidatura e iscrizione non sono ancora aperti. Questa versione non invia i loro dati a un database. L’apertura dei moduli richiederà un aggiornamento dell’informativa con finalità, campi, destinatari e conservazione effettivi.'],
    ['Google Analytics', 'È prevista la misurazione delle visite mediante Google Analytics 4, solo dopo il consenso facoltativo agli analytics. Non sono previste funzionalità pubblicitarie, remarketing o Google Signals. Le visualizzazioni inviate dal codice usano percorsi consentiti e lingua; escludono contenuti dei moduli e parametri liberi dell’URL. Il titolare ha scelto due mesi di conservazione dei dati di utenti ed eventi: l’impostazione nella proprietà Google è ancora da verificare e non determina la durata dei report aggregati standard. Prima dell’attivazione devono essere verificati anche gli eventi automatici, i destinatari e le garanzie applicabili ai trasferimenti internazionali.'],
    ['Memoria del browser e cookie', 'La preferenza di lingua è salvata localmente come delir-language fino alla cancellazione dei dati del sito. La scelta cookie è salvata come delir-consent-v1 con versione, data, scadenza e scelta analytics, per sei mesi. Queste memorie supportano le preferenze del sito. Dopo l’accettazione, GA4 può usare i cookie _ga e _ga_*: il codice propone una durata massima di 180 giorni senza rinnovo automatico, da verificare nel browser. La conservazione degli eventi su Google è distinta dalla durata dei cookie.'],
    ['Accettazione, rifiuto e revoca', 'Puoi rifiutare gli analytics continuando a usare il sito. Il comando Preferenze cookie nel footer permette di cambiare scelta. La revoca blocca la misurazione futura, elimina i cookie GA4 gestiti da questa integrazione e ricarica la pagina per arrestare il tag già caricato. La revoca non cancella automaticamente dati già trasmessi né rende illecito il trattamento precedente.'],
    ['Diritti', 'Nei casi previsti dal GDPR puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, e revocare il consenso. Scrivi al contatto sotto. Puoi presentare un reclamo al Garante per la protezione dei dati personali. Le modalità operative di identificazione delle richieste relative ad Analytics devono essere completate prima dell’attivazione.'],
    ['Informazioni ancora da completare', 'Questa è una bozza di lavoro, non un’attestazione di conformità. Prima della pubblicazione definitiva vanno completati finalità e basi giuridiche dei trattamenti attivi, periodi di conservazione, destinatari, contratti dei fornitori e garanzie per eventuali trasferimenti fuori dal SEE. Non sono previste decisioni automatizzate o profilazione pubblicitaria nella configurazione proposta.'],
  ],
  en: [
    ['Controller and contact', 'The controller is Sohayb Raqaq, the individual operating the DeliR project. Contact the address below for personal-data questions and requests to exercise your rights.'],
    ['Browsing and hosting', 'The site is intended for IONOS web hosting. Server requests may involve IP address, date and time, browser and requested resources to deliver and secure the site. Actual logs, retention, the IONOS contracting entity and processing terms must be checked before publication.'],
    ['Email contact', 'The email link opens your email application. If you write, the controller receives your email address and message to respond using free Gmail. Do not send client information, other people’s data, confidential documents or sensitive data. The controller has chosen to delete enquiries without follow-up within 12 months of the last contact; contractual relationships need separate criteria. The deletion procedure, legal basis of different requests and applicable Gmail terms must be defined before final publication.'],
    ['Forms and database', 'Automatic application and signup forms are not open yet. This version does not send their data to a database. Opening the forms requires an updated notice covering actual purposes, fields, recipients and retention.'],
    ['Google Analytics', 'Visit measurement with Google Analytics 4 is planned, only after optional analytics consent. Advertising features, remarketing and Google Signals are not planned. Page views sent by the code use allowed routes and language, excluding form content and arbitrary URL parameters. The controller has chosen two-month retention of user and event data: the Google property setting is still to be verified and does not determine the lifetime of standard aggregated reports. Automatic events, recipients and safeguards for international transfers must also be verified before activation.'],
    ['Browser storage and cookies', 'The language preference is stored locally as delir-language until site data is cleared. The cookie choice is stored as delir-consent-v1 with its version, date, expiry and analytics choice for six months. These storage entries support site preferences. After acceptance, GA4 may use _ga and _ga_* cookies: the code proposes a maximum lifetime of 180 days without automatic renewal, to be verified in the browser. Google event retention is separate from cookie lifetime.'],
    ['Acceptance, rejection and withdrawal', 'You can reject analytics and continue using the site. Cookie preferences in the footer lets you change your choice. Withdrawal blocks future measurement, removes GA4 cookies managed by this integration and reloads the page to stop the loaded tag. It does not automatically delete previously transmitted data or affect the lawfulness of prior processing.'],
    ['Rights', 'Where applicable under the GDPR, you may request access, rectification, erasure, restriction, portability and objection, and withdraw consent. Contact the address below. You may lodge a complaint with the Italian data protection authority. Procedures for identifying Analytics-related requests must be completed before activation.'],
    ['Information still to be completed', 'This is a working draft, not a statement of compliance. Before final publication, complete the purposes and legal bases of active processing, retention periods, recipients, supplier contracts and safeguards for any transfers outside the EEA. Automated decision-making and advertising profiling are not planned in the proposed setup.'],
  ],
};

export default function PrivacyPage() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <div className="flex min-h-dvh flex-col bg-[#f2f8ff] text-brand-ink">
    <SkipLink />
    <header className="border-b border-slate-200 bg-white"><div className="section-shell flex min-h-20 items-center justify-between gap-4">
      <Link to={it ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center font-semibold text-brand-blue">{it ? 'Torna a DeliR' : 'Back to DeliR'}</Link><LanguageSwitch />
    </div></header>
    <main id="main-content" className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl font-semibold">{it ? 'Privacy e cookie' : 'Privacy and cookies'}</h1>
      <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">{it ? 'Bozza da completare prima dell’attivazione di GA4.' : 'Draft to complete before activating GA4.'}</p>
      <p className="mt-4 text-base">{it ? 'Stato analytics: ' : 'Analytics status: '}{analyticsAvailable ? (it ? 'disponibili solo con consenso' : 'available only with consent') : (it ? 'disattivati' : 'disabled')}</p>
      <a href={`mailto:${publicContactEmail}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{publicContactEmail}</a>
      {sections[language].map(([title, text]) => <section key={title} className="mt-9"><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-3 text-base leading-7 text-slate-600">{text}</p></section>)}
      <button type="button" className="btn-secondary mt-8" onClick={() => window.dispatchEvent(new Event('delir:cookie-preferences'))}>{it ? 'Preferenze cookie' : 'Cookie preferences'}</button>
      <p className="mt-8 text-sm text-slate-600">{it ? 'Fonti: ' : 'Sources: '}<a className="underline" href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it">GDPR</a> · <a className="underline" href="https://www.garanteprivacy.it/temi/cookie">Garante Privacy</a> · <a className="underline" href="https://policies.google.com/privacy">Google</a></p>
    </main>
    <Footer />
  </div>;
}
