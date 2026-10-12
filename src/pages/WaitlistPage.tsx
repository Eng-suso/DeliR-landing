import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import { submitWaitlist, validateWaitlist, type WaitlistErrors, type WaitlistFields } from '../lib/waitlist';
import { privacyNoticeUrl } from '../lib/leadCaptureReadiness';
import { conversationHref, interestCtaLabel, productInterestEmailHref, publicContactEmail } from '../lib/publicOffer';
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
      setSubmitError(it ? 'La richiesta non è stata confermata. I dati sono rimasti nel modulo: riprova.' : 'Your request was not confirmed. Your details are still in the form: please try again.');
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
      <p className="landing-eyebrow">{it ? 'Per consulenti BPM e Operations' : 'For BPM and Operations consultants'}</p>
      <h1 className="landing-title mt-4">{it ? 'Vuoi usare DeliR nel tuo lavoro?' : 'Want to use DeliR in your work?'}</h1>
      <p className="mt-5 text-base leading-7 text-slate-600">{it ? 'Segnala il tuo interesse a provare il prodotto. Ti contatterò per la disponibilità di accesso. La richiesta non dà accesso immediato e non comporta acquisti o impegni.' : 'Tell me you would like to try the product. I will contact you about access availability. A request does not grant immediate access or commit you to a purchase.'}</p>
      {status === 'success' ? <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="interest-success">
        <CheckCircle2 aria-hidden="true" className="size-8 text-brand-blue" />
        <h2 id="interest-success" ref={success} tabIndex={-1} className="mt-4 text-2xl font-semibold">{it ? 'Richiesta ricevuta.' : 'Request received.'}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{it ? 'Ti contatterò per la disponibilità di accesso. Non è stata fissata una data e non hai sottoscritto un abbonamento.' : 'I will contact you about access availability. No date has been set and you have not subscribed to a paid plan.'}</p>
        <p className="mt-5 text-sm leading-6 text-slate-600">{it ? 'Hai già un incarico in mente o vuoi chiarire un dubbio?' : 'Already have an engagement in mind or a question?'}</p>
        <a href={conversationHref(language)} className="btn-secondary mt-3 whitespace-normal">{it ? 'Parliamone senza impegno' : 'Talk without obligation'}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </section> : captureEnabled ? <form method="post" noValidate onSubmit={handleSubmit} aria-label={it ? 'Richiesta di provare DeliR' : 'Request to try DeliR'} onFocusCapture={() => { if (!started.current) { started.current = true; trackInterestEvent('interest_form_started', language); } }} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
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
        <p id="practice-help" className="mt-2 text-xs leading-5 text-slate-600">{it ? 'Serve a distinguere le richieste dei consulenti da altri utilizzi.' : 'Helps distinguish consultant requests from other use cases.'}</p>
        {errors.practice ? <p id="practice-error" className="mt-2 text-sm text-red-700">{errorText.practice}</p> : null}
        <label htmlFor="timing" className="mt-5 block text-sm font-semibold">{it ? 'Quando vorresti usarlo? · facoltativo' : 'When would you use it? · optional'}</label>
        <select id="timing" name="timing" autoComplete="off" disabled={locked} value={fields.timing} onChange={event => updateField('timing', event.target.value)} aria-invalid={Boolean(errors.timing)} aria-describedby={errors.timing ? 'timing-error' : undefined} className="control-enterprise mt-2 !text-base">
          <option value="">{it ? 'Preferisco non indicarlo' : 'Prefer not to say'}</option>
          <option value="active">{it ? 'Su un incarico già attivo' : 'On an active engagement'}</option>
          <option value="next-90-days">{it ? 'Su un incarico entro 90 giorni' : 'On an engagement within 90 days'}</option>
          <option value="exploring">{it ? 'Sto esplorando, senza un incarico previsto' : 'Exploring, with no engagement planned'}</option>
        </select>
        {errors.timing ? <p id="timing-error" className="mt-2 text-sm text-red-700">{errorText.timing}</p> : null}
        <p className="mt-5 text-xs leading-6 text-slate-600">{it ? 'Con l’invio chiedi di essere contattato per la disponibilità di DeliR. Puoi ritirare la richiesta scrivendo a ' : 'Submitting asks to be contacted about DeliR availability. Withdraw your request by emailing '}<a href={`mailto:${publicContactEmail}`} className="underline underline-offset-4">{publicContactEmail}</a>. {it ? 'Leggi l’' : 'Read the '}<a href={privacyNoticeUrl} className="font-semibold text-brand-blue underline underline-offset-4">{it ? 'informativa privacy' : 'privacy notice'}</a>.</p>
        {submitError ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{submitError}</p> : null}
        <button type="submit" disabled={locked} aria-busy={status === 'submitting'} className="btn-primary mt-5 w-full whitespace-normal">{status === 'submitting' ? (it ? 'Invio in corso…' : 'Sending…') : interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></button>
      </form> : <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="interest-pending">
        <h2 id="interest-pending" className="text-xl font-semibold">{it ? 'Le richieste online non sono ancora aperte.' : 'Online requests are not open yet.'}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{it ? 'Puoi già scrivermi per chiedere di provare DeliR. Il link apre il tuo programma email; l’invio avviene lì.' : 'You can already email me to request a chance to try DeliR. The link opens your email app; send your message there.'}</p>
        <a href={productInterestEmailHref(language)} className="btn-primary mt-5 whitespace-normal">{it ? 'Scrivimi per provare DeliR' : 'Email me to try DeliR'}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </section>}
      <p className="mt-6 text-sm leading-6 text-slate-600">{it ? 'Preferisci prima parlarne? ' : 'Prefer a conversation first? '}<a href={conversationHref(language)} className="inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{it ? 'Scrivimi senza impegno' : 'Email me without obligation'}</a>.</p>
    </main><Footer />
  </div>;
}
