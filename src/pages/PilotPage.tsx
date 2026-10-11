import { useEffect, useLayoutEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import {
  submitPilotApplication,
  validatePilotApplication,
  type PilotApplicationErrors,
  type PilotApplicationFields,
} from '../lib/pilotApplication';
import { pilotRiskReversals } from '../lib/publicOffer';
import FragmentNavigation from '../components/FragmentNavigation';
import { useFragment } from '../lib/useFragment';
import '../styles/premium-landing.css';
import { privacyNoticeUrl } from '../lib/leadCaptureReadiness';

const emptyFields: PilotApplicationFields = { name: '', email: '', practice: '', timing: '', projectBrief: '' };
const fieldClass = 'control-enterprise mt-2 !text-base';
type PilotPageProps = { captureEnabled: boolean };

const copy = {
  it: {
    back: 'Torna a DeliR', eyebrow: 'Pilot a pagamento · per milestone', title: 'Testa DeliR sul tuo progetto.',
    intro: 'Porta un progetto di miglioramento attivo o in partenza. Valutiamo il fit, concordiamo il perimetro e definiamo il successo prima di iniziare.',
    benefits: ['Discovery, As-Is, To-Be e simulazione nello stesso contesto.', 'Ogni output viene verificato prima di arrivare al cliente.', 'Nessun abbonamento o impegno a lungo termine.'],
    privacy: 'Non inserire nomi di clienti, informazioni riservate o dati personali di terzi nella candidatura.',
    formTitle: 'Parliamo del tuo progetto', formIntro: 'Lascia un contatto e descrivi l’incarico. Prima di iniziare concordiamo perimetro, output, milestone e prezzo.',
    name: 'Nome e cognome', email: 'Email di lavoro', practice: 'Tipo di attività', practicePlaceholder: 'Seleziona', independent: 'Consulente indipendente', boutique: 'Boutique di consulenza', consultingFirm: 'Società di consulenza', inHouse: 'Operations aziendali',
    timing: 'Tempistica dell’incarico', timingPlaceholder: 'Seleziona', active: 'Già attivo', next: 'In partenza entro 90 giorni',
    brief: 'Processo o problema da analizzare', briefPlaceholder: 'Esempio: capire perché il ciclo di acquisto indiretto è troppo lungo e confrontare possibili scenari di miglioramento.',
    briefHelp: 'Descrivi obiettivo e incertezza attuale. Non identificare il cliente.', submit: 'Richiedi la valutazione del progetto', submitting: 'Invio in corso…',
    noProject: 'Non hai ancora un progetto adatto?', updates: 'Esplora il prodotto.', success: 'Candidatura ricevuta.', successBody: 'Valuteremo il fit dell’incarico e ti contatteremo con il prossimo passo.',
    pendingTitle: 'Anteprima del modulo', pendingBody: 'Puoi provare la compilazione. L’invio non è ancora attivo: i dati restano in questa pagina e non vengono trasmessi o salvati.', previewSubmit: 'Verifica i dati', pendingError: 'I dati sono pronti, ma l’invio non è ancora disponibile. La richiesta non è stata trasmessa.',
    errors: { name: { required: 'Inserisci il tuo nome.', long: 'Mantieni il nome entro 100 caratteri.' }, email: { required: 'Inserisci la tua email di lavoro.', invalid: 'Inserisci un indirizzo email valido.' }, practice: { required: 'Seleziona il tipo di attività.' }, timing: { required: 'Seleziona quando parte l’incarico.' }, projectBrief: { required: 'Descrivi brevemente il processo o il problema.', short: 'Aggiungi un po’ di contesto in più.', long: 'Mantieni la descrizione entro 600 caratteri.' }, submission: 'Non siamo riusciti a inviare la candidatura. Riprova.' },
  },
  en: {
    back: 'Back to DeliR', eyebrow: 'Paid pilot · milestone-based', title: 'Test DeliR on Your Project.',
    intro: 'Bring an active or upcoming process-improvement project. We assess the fit, agree the scope and define success before starting.',
    benefits: ['Discovery, As-Is, To-Be and simulation in one project context.', 'Review every output before it reaches your client.', 'No subscription or long-term commitment.'],
    privacy: 'Do not include client names, confidential information or other people’s personal data in this application.',
    formTitle: 'Tell us about your project', formIntro: 'Leave your contact details and describe the engagement. Before kickoff, we agree scope, deliverables, milestones and price.',
    name: 'Full name', email: 'Work email', practice: 'Practice type', practicePlaceholder: 'Select one', independent: 'Independent consultant', boutique: 'Boutique consulting practice', consultingFirm: 'Consulting firm', inHouse: 'In-house Operations',
    timing: 'Engagement timing', timingPlaceholder: 'Select one', active: 'Active now', next: 'Starting within 90 days',
    brief: 'Process or problem to analyze', briefPlaceholder: 'Example: understand why the indirect procurement cycle takes too long and compare improvement scenarios.',
    briefHelp: 'Describe the objective and current uncertainty. Do not identify the client.', submit: 'Request a project review', submitting: 'Submitting…',
    noProject: 'No suitable project yet?', updates: 'Explore the product.', success: 'Application received.', successBody: 'We will review the engagement fit and contact you with the next step.',
    pendingTitle: 'Form preview', pendingBody: 'You can try filling out the form. Submission is not active yet: your details stay on this page and are not sent or saved.', previewSubmit: 'Check your details', pendingError: 'Your details are ready, but submission is not available yet. Your request has not been sent.',
    errors: { name: { required: 'Enter your name.', long: 'Keep your name under 100 characters.' }, email: { required: 'Enter your work email.', invalid: 'Enter a valid email address.' }, practice: { required: 'Select your practice type.' }, timing: { required: 'Select when the engagement starts.' }, projectBrief: { required: 'Briefly describe the process or problem.', short: 'Add a little more context.', long: 'Keep the description under 600 characters.' }, submission: 'We could not submit your application. Please try again.' },
  },
} as const;

export default function PilotPage({ captureEnabled }: PilotPageProps) {
  const { language } = useLanguage();
  const t = copy[language];
  const reduceMotion = useReducedMotion();
  const fragment = useFragment();
  const homeHref = language === 'en' ? '/?lang=en' : '/';
  const [fields, setFields] = useState<PilotApplicationFields>(emptyFields);
  const [errors, setErrors] = useState<PilotApplicationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const hasDraft = status === 'idle' && Object.values(fields).some((value) => value.length > 0);
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      if (!hasDraft) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [fields, status]);

  useLayoutEffect(() => {
    document.getElementById(status === 'success' ? 'application-title' : fragment || 'pilot-title')?.focus({ preventScroll: true });
  }, [fragment, status]);

  const updateField = <Field extends keyof PilotApplicationFields>(field: Field, value: PilotApplicationFields[Field]) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const errorMessage = (field: keyof PilotApplicationFields) => {
    const code = errors[field];
    if (!code) return '';
    const messages = t.errors[field] as Record<string, string>;
    return messages[code] ?? '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePilotApplication(fields);
    setErrors(nextErrors);
    const firstInvalidField = (Object.keys(nextErrors) as Array<keyof PilotApplicationFields>)[0];
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }
    if (!captureEnabled) {
      setSubmitError(t.pendingError);
      return;
    }
    setStatus('submitting');
    try {
      await submitPilotApplication(fields);
      setFields(emptyFields);
      setStatus('success');
    } catch {
      setStatus('idle');
      setSubmitError(t.errors.submission);
    }
  };

  return (
    <div className="min-h-dvh offer-page bg-brand-light text-brand-ink">
      <SkipLink /><FragmentNavigation />
      <header className="border-b border-slate-200 bg-white">
        <div className="section-shell flex min-h-[72px] items-center justify-between gap-4">
          <Link to={homeHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-brand-ink transition-colors hover:text-brand-blue">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />{t.back}
          </Link>
          <LanguageSwitch />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="section-shell grid max-w-[1440px] gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:pt-24">
        <motion.section initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.45 }} aria-labelledby="pilot-title" className="lg:sticky lg:top-12 lg:self-start">
          <p className="landing-eyebrow"><span aria-hidden="true" className="h-px w-7 bg-brand-blue" />{t.eyebrow}</p>
          <h1 id="pilot-title" tabIndex={-1} className="mt-6 max-w-[14ch] text-balance font-display text-[clamp(2.8rem,4vw,4.8rem)] font-medium leading-[1.05] tracking-[-0.055em] text-brand-ink">{t.title}</h1>
          <p className="mt-7 max-w-[33rem] text-[17px] leading-8 text-slate-600">{t.intro}</p>
          <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-700">
            {pilotRiskReversals[language].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span>{item}</span></li>)}
          </ul>
          <div className="mt-8 flex gap-3 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
            <LockKeyhole aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" /><p>{t.privacy}</p>
          </div>
        </motion.section>

        <motion.section initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.08 }} id="application" tabIndex={-1} aria-labelledby="application-title" className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
          {status === 'success' ? (
            <div role="status" className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><ClipboardCheck aria-hidden="true" className="h-8 w-8" /></span>
              <h2 id="application-title" tabIndex={-1} className="mt-6 font-display text-3xl font-medium text-slate-950">{t.success}</h2>
              <p className="mt-3 max-w-md text-base leading-7 text-slate-600">{t.successBody}</p>
              <Link to={homeHref} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-blue-700 hover:text-blue-900">{t.back}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
          ) : (
            <>
              <h2 id="application-title" className="font-display text-2xl font-medium text-slate-950">{t.formTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t.formIntro}</p>
              {!captureEnabled ? <div role="status" className="mt-6 border-l-2 border-brand-blue bg-[#EEF4F8] px-4 py-3 text-sm leading-6 text-brand-ink"><strong className="block font-semibold">{t.pendingTitle}</strong>{t.pendingBody}</div> : null}
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6" aria-label={t.formTitle}>
                <fieldset disabled={status === 'submitting'} className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-slate-800">{t.name}</label>
                  <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required value={fields.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} className={fieldClass} placeholder={language === 'it' ? 'Il tuo nome' : 'Your name'} />
                  {errors.name ? <p id="name-error" role="alert" className="mt-2 text-sm text-red-700">{errorMessage('name')}</p> : null}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-slate-800">{t.email}</label>
                  <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} maxLength={254} required value={fields.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className={fieldClass} placeholder={language === 'it' ? 'nome@azienda.it' : 'name@company.com'} />
                  {errors.email ? <p id="email-error" role="alert" className="mt-2 text-sm text-red-700">{errorMessage('email')}</p> : null}
                </div>
                <div>
                  <label htmlFor="practice" className="text-sm font-semibold text-slate-800">{t.practice}</label>
                  <select id="practice" name="practice" required value={fields.practice} onChange={(event) => updateField('practice', event.target.value as PilotApplicationFields['practice'])} aria-invalid={Boolean(errors.practice)} aria-describedby={errors.practice ? 'practice-error' : undefined} className={fieldClass}>
                    <option value="">{t.practicePlaceholder}</option><option value="independent">{t.independent}</option><option value="boutique">{t.boutique}</option><option value="consulting-firm">{t.consultingFirm}</option><option value="in-house-operations">{t.inHouse}</option>
                  </select>
                  {errors.practice ? <p id="practice-error" role="alert" className="mt-2 text-sm text-red-700">{errorMessage('practice')}</p> : null}
                </div>
                <div>
                  <label htmlFor="timing" className="text-sm font-semibold text-slate-800">{t.timing}</label>
                  <select id="timing" name="timing" required value={fields.timing} onChange={(event) => updateField('timing', event.target.value as PilotApplicationFields['timing'])} aria-invalid={Boolean(errors.timing)} aria-describedby={errors.timing ? 'timing-error' : undefined} className={fieldClass}>
                    <option value="">{t.timingPlaceholder}</option><option value="active">{t.active}</option><option value="next-90-days">{t.next}</option>
                  </select>
                  {errors.timing ? <p id="timing-error" role="alert" className="mt-2 text-sm text-red-700">{errorMessage('timing')}</p> : null}
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-4"><label htmlFor="projectBrief" className="text-sm font-semibold text-slate-800">{t.brief}</label><span className="text-xs text-slate-500">{fields.projectBrief.length}/600</span></div>
                  <textarea id="projectBrief" name="projectBrief" required rows={5} maxLength={600} value={fields.projectBrief} onChange={(event) => updateField('projectBrief', event.target.value)} aria-invalid={Boolean(errors.projectBrief)} aria-describedby={`projectBrief-help${errors.projectBrief ? ' projectBrief-error' : ''}`} className={fieldClass} placeholder={t.briefPlaceholder} />
                  <p id="projectBrief-help" className="mt-2 text-xs leading-5 text-slate-500">{t.briefHelp}</p>
                  {errors.projectBrief ? <p id="projectBrief-error" role="alert" className="mt-2 text-sm text-red-700">{errorMessage('projectBrief')}</p> : null}
                </div>
                </fieldset>
                {submitError ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{submitError}</div> : null}
                <button type="submit" disabled={status === 'submitting'} aria-busy={status === 'submitting'} className="btn-primary w-full">
                  {!captureEnabled ? t.previewSubmit : status === 'submitting' ? t.submitting : t.submit}{status === 'submitting' || !captureEnabled ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
                </button>
                {captureEnabled ? <p className="text-center text-xs leading-5 text-slate-500">{language === 'it' ? 'Leggi come trattiamo i dati nella ' : 'Read how we handle your data in the '}<a href={privacyNoticeUrl} className="font-semibold text-blue-700 underline underline-offset-4">{language === 'it' ? 'informativa privacy' : 'privacy notice'}</a>.</p> : null}
                <p className="text-center text-xs leading-5 text-slate-500">{t.noProject} <Link to={`${homeHref}#caso`} className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{t.updates}</Link></p>
              </form>
            </>
          )}
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
