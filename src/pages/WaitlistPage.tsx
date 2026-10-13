import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import { submitWaitlist, validateWaitlist, type WaitlistErrors, type WaitlistFields } from '../lib/waitlist';
import { privacyNoticeUrl } from '../lib/leadCaptureReadiness';
import { interestCtaLabel, pilotApplicationHref, productInterestEmailHref, publicContactEmail } from '../lib/publicOffer';
import { trackInterestEvent } from '../privacy/analytics';
import '../styles/premium-landing.css';

const emptyFields: WaitlistFields = { email: '', practice: '', timing: '' };

export default function WaitlistPage({ captureEnabled }: { captureEnabled: boolean }) {
  const { language } = useLanguage();
  const it = language === 'it';
  const [fields, setFields] = useState<WaitlistFields>(emptyFields);
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const busy = useRef(false);
  const started = useRef(false);
  const success = useRef<HTMLHeadingElement>(null);
  const clientReady = typeof window !== 'undefined';

  useEffect(() => { if (status === 'success') success.current?.focus(); }, [status]);
  function updateField(field: keyof WaitlistFields, value: string) {
    setFields(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setSubmitError('');
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captureEnabled || busy.current) return;
    const nextErrors = validateWaitlist(fields);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Array<keyof WaitlistFields>)[0];
    if (firstInvalid) { document.getElementById(firstInvalid)?.focus(); return; }
    busy.current = true;
    setStatus('submitting');
    setSubmitError('');
    trackInterestEvent('interest_submit_attempt', language);
    try {
      await submitWaitlist(fields);
      setFields(emptyFields);
      setStatus('success');
      trackInterestEvent('interest_request_accepted', language);
    } catch {
      setStatus('idle');
      setSubmitError(it ? 'L’iscrizione non è stata confermata. I dati sono rimasti nel modulo: riprova.' : 'Your signup was not confirmed. Your details are still in the form: please try again.');
      trackInterestEvent('interest_submit_failed', language);
    } finally { busy.current = false; }
  }
  const errorText = {
    email: it ? 'Inserisci un indirizzo email valido.' : 'Enter a valid email address.',
    practice: it ? 'Seleziona il tuo tipo di attività.' : 'Select your practice type.',
    timing: it ? 'Seleziona una delle tempistiche disponibili.' : 'Select one of the available timings.',
  };
  const locked = !clientReady || status === 'submitting';
  return <div className="offer-page flex min-h-dvh flex-col bg-brand-light text-brand-ink">
    <SkipLink />
    <header className="border-b border-slate-200 bg-white"><div className="section-shell flex min-h-20 items-center justify-between gap-4">
      <Link to={it ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-blue"><ArrowLeft aria-hidden="true" className="size-4" />{it ? 'Torna a DeliR' : 'Back to DeliR'}</Link>
      <LanguageSwitch />
    </div></header>
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <p className="landing-eyebrow">Early access</p>
      <h1 className="landing-title mt-4">{it ? 'Entra nella lista d’attesa di DeliR.' : 'Join the DeliR waitlist.'}</h1>
      <p className="mt-5 text-base leading-7 text-slate-600">{it ? 'Lascia la tua email e indicaci come lavori. Ti contatterò quando potrò aprire l’accesso a nuovi utenti. Se hai già un progetto reale, non devi aspettare: puoi candidarlo per un pilot.' : 'Leave your email and tell us how you work. I will contact you when access can open to more users. If you already have a real project, you do not need to wait: you can apply for a pilot.'}</p>
      {status === 'success' ? <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="interest-success">
        <CheckCircle2 aria-hidden="true" className="size-8 text-brand-blue" />
        <h2 id="interest-success" ref={success} tabIndex={-1} className="mt-4 text-2xl font-semibold">{it ? 'Sei nella lista d’attesa.' : 'You’re on the waitlist.'}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{it ? 'Ti contatterò quando potrò aprire l’accesso a nuovi utenti. Non hai sottoscritto un abbonamento e non è stata promessa una data di accesso.' : 'I will contact you when access can open to more users. You have not subscribed to a paid plan and no access date has been promised.'}</p>
        <p className="mt-5 text-sm leading-6 text-slate-600">{it ? 'Hai già un progetto o un processo reale su cui vuoi lavorare?' : 'Already have a real project or process you want to work on?'}</p>
        <a data-pilot-section="waitlist-success" href={pilotApplicationHref(language)} className="btn-secondary mt-3 whitespace-normal">{it ? 'Avvia un pilot' : 'Start a pilot'}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </section> : captureEnabled ? <form method="post" noValidate onSubmit={handleSubmit} aria-label={it ? 'Iscrizione alla lista d’attesa DeliR' : 'DeliR waitlist signup'} onFocusCapture={() => { if (!started.current) { started.current = true; trackInterestEvent('interest_form_started', language); } }} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <label htmlFor="email" className="block text-sm font-semibold">Email</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} required maxLength={254} disabled={locked} value={fields.email} onChange={event => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className="control-enterprise mt-2 !text-base" placeholder={it ? 'nome@studio.it…' : 'you@practice.com…'} />
        {errors.email ? <p id="email-error" className="mt-2 text-sm text-red-700">{errorText.email}</p> : null}
        <label htmlFor="practice" className="mt-5 block text-sm font-semibold">{it ? 'Tipo di attività' : 'Practice type'}</label>
        <select id="practice" name="practice" autoComplete="off" required disabled={locked} value={fields.practice} onChange={event => updateField('practice', event.target.value)} aria-invalid={Boolean(errors.practice)} aria-describedby={errors.practice ? 'practice-help practice-error' : 'practice-help'} className="control-enterprise mt-2 !text-base">
          <option value="">{it ? 'Seleziona' : 'Select'}</option>
          <option value="independent">{it ? 'Consulente indipendente' : 'Independent consultant'}</option>
          <option value="consulting-team">{it ? 'Team o società di consulenza' : 'Consulting team or firm'}</option>
          <option value="in-house">{it ? 'Operations aziendali' : 'In-house Operations'}</option>
          <option value="other">{it ? 'Altro' : 'Other'}</option>
        </select>
        <p id="practice-help" className="mt-2 text-xs leading-5 text-slate-600">{it ? 'Serve a capire chi vuole usare DeliR e in quale contesto.' : 'Helps us understand who wants to use DeliR and in what context.'}</p>
        {errors.practice ? <p id="practice-error" className="mt-2 text-sm text-red-700">{errorText.practice}</p> : null}
        <label htmlFor="timing" className="mt-5 block text-sm font-semibold">{it ? 'Quando pensi che lo useresti? · facoltativo' : 'When do you think you would use it? · optional'}</label>
        <select id="timing" name="timing" autoComplete="off" disabled={locked} value={fields.timing} onChange={event => updateField('timing', event.target.value)} aria-invalid={Boolean(errors.timing)} aria-describedby={errors.timing ? 'timing-error' : undefined} className="control-enterprise mt-2 !text-base">
          <option value="">{it ? 'Preferisco non indicarlo' : 'Prefer not to say'}</option>
          <option value="active">{it ? 'Su un incarico già attivo' : 'On an active engagement'}</option>
          <option value="next-90-days">{it ? 'Su un incarico entro 90 giorni' : 'On an engagement within 90 days'}</option>
          <option value="exploring">{it ? 'Sto esplorando, senza un incarico previsto' : 'Exploring, with no engagement planned'}</option>
        </select>
        {errors.timing ? <p id="timing-error" className="mt-2 text-sm text-red-700">{errorText.timing}</p> : null}
        <p className="mt-5 text-xs leading-6 text-slate-600">{it ? 'Con l’invio chiedi di essere contattato sulla disponibilità di accesso a DeliR. Puoi ritirare la richiesta scrivendo a ' : 'Submitting asks to be contacted about DeliR access availability. Withdraw your request by emailing '}<a href={`mailto:${publicContactEmail}`} className="underline underline-offset-4">{publicContactEmail}</a>. {it ? 'Leggi l’' : 'Read the '}<a href={privacyNoticeUrl} className="font-semibold text-brand-blue underline underline-offset-4">{it ? 'informativa privacy' : 'privacy notice'}</a>.</p>
        {submitError ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{submitError}</p> : null}
        <button type="submit" disabled={locked} aria-busy={status === 'submitting'} className="btn-primary mt-5 w-full whitespace-normal">{status === 'submitting' ? (it ? 'Iscrizione in corso…' : 'Joining…') : interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></button>
      </form> : <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="interest-pending">
        <h2 id="interest-pending" className="text-xl font-semibold">{it ? 'La lista d’attesa online non è ancora aperta.' : 'The online waitlist is not open yet.'}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{it ? 'Puoi già scrivermi per chiedere di essere aggiunto. Il link apre il tuo programma email; l’invio avviene lì.' : 'You can already email me to ask to be added. The link opens your email app; send your message there.'}</p>
        <a href={productInterestEmailHref(language)} className="btn-primary mt-5 whitespace-normal">{it ? 'Scrivimi per entrare nella lista d’attesa' : 'Email me to join the waitlist'}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </section>}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="text-sm font-semibold text-brand-ink">{it ? 'Hai già un progetto reale?' : 'Already have a real project?'}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{it ? 'Il pilot è un percorso separato: partiamo dal tuo processo, definiamo perimetro e milestone e valutiamo se DeliR è adatto al caso.' : 'The pilot is a separate path: we start from your process, define scope and milestones, and assess whether DeliR fits the case.'}</p>
        <a data-pilot-section="waitlist" href={pilotApplicationHref(language)} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{it ? 'Valuta un pilot' : 'Explore a pilot'}<ArrowRight aria-hidden="true" className="ml-2 size-4" /></a>
      </div>
    </main><Footer />
  </div>;
}
