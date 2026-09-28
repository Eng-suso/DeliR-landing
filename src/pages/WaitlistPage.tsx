import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkAnimatedBackground from '../components/DarkAnimatedBackground';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import { useLanguage } from '../i18n/LanguageContext';
import SkipLink from '../components/SkipLink';
import {
  submitWaitlist,
  validateWaitlist,
  type WaitlistErrors,
  type WaitlistFields,
} from '../lib/waitlist';

const emptyFields: WaitlistFields = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
};

export default function WaitlistPage() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const it = language === 'it';
  const [fields, setFields] = useState<WaitlistFields>(emptyFields);
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const updateField = (field: keyof WaitlistFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateWaitlist(fields);
    setErrors(nextErrors);
    const firstInvalidField = (Object.keys(nextErrors) as Array<keyof WaitlistFields>)[0];
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setStatus('submitting');
    setSubmitError('');
    try {
      await submitWaitlist(fields);
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setSubmitError(
        language === 'it'
          ? 'Non siamo riusciti a completare la richiesta. Riprova.'
          : error instanceof Error
            ? error.message
            : 'We could not complete your request. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-between relative overflow-hidden">
      <SkipLink />
      <DarkAnimatedBackground />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center gap-4">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-300 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {it ? 'Torna a DeliR' : 'Return to DeliR'}
          </Link>
          <LanguageSwitch dark />
        </div>
      </div>
      
      <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center pb-16 pt-32 sm:py-36 relative z-10">
        <motion.div
           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: reduceMotion ? 0 : 0.45 }}
           className="text-center w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-4 h-4" />
            <span>{it ? 'Aggiornamenti prodotto' : 'Product updates'}</span>
          </div>
          
          <h1 className="text-[clamp(2.5rem,9vw,4.5rem)] font-display font-medium tracking-tighter text-white mb-6 leading-[1.05] text-balance">
            {it ? 'Non hai ancora un incarico adatto?' : 'No suitable engagement yet?'}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
            {it
              ? 'Lascia i tuoi riferimenti per ricevere aggiornamenti sui pilot e sulla disponibilità del prodotto.'
              : 'Leave your details to receive updates about pilots and product availability.'}
          </p>

          <div className="max-w-xl mx-auto w-full">
            {status === 'success' ? (
              <motion.div 
               initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: reduceMotion ? 0 : 0.3 }}
               className="py-10"
              >
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">{it ? 'Sei nella lista' : "You're on the list"}</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  {it ? 'Ti contatteremo quando ci saranno nuovi aggiornamenti.' : "We'll contact you when new updates are available."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFields(emptyFields);
                    setErrors({});
                    setStatus('idle');
                  }}
                  className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  {it ? 'Registra un’altra email' : 'Register another email'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="relative group text-left max-w-md mx-auto" aria-label={it ? 'Richiesta aggiornamenti prodotto' : 'Product updates request'}>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-300"></div>
                <div className="relative flex flex-col rounded-3xl border border-slate-700/50 bg-slate-900 p-6 shadow-2xl transition-colors">
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-400 mb-1 ml-1">{it ? 'Nome' : 'First Name'}</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        value={fields.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-brand-blue focus:ring-4 focus:ring-blue-500/20"
                        placeholder="Jane…"
                      />
                      {errors.firstName && <p id="firstName-error" className="mt-1.5 ml-1 text-xs text-red-300">{it ? 'Inserisci il nome.' : errors.firstName}</p>}
                    </div>
                    <div className="w-full">
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-400 mb-1 ml-1">{it ? 'Cognome' : 'Last Name'}</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        value={fields.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-brand-blue focus:ring-4 focus:ring-blue-500/20"
                        placeholder="Doe…"
                      />
                      {errors.lastName && <p id="lastName-error" className="mt-1.5 ml-1 text-xs text-red-300">{it ? 'Inserisci il cognome.' : errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                     <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1 ml-1">{it ? 'Email di lavoro' : 'Work Email'}</label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        required
                        value={fields.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-brand-blue focus:ring-4 focus:ring-blue-500/20"
                        placeholder="jane@company.com…"
                      />
                     {errors.email && <p id="email-error" className="mt-1.5 ml-1 text-xs text-red-300">{it ? (fields.email.includes('@') ? 'Inserisci un indirizzo email valido.' : 'Inserisci la tua email di lavoro.') : errors.email}</p>}
                  </div>

                  <div className="mb-6">
                     <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-1 ml-1">{it ? 'Ruolo professionale' : 'Role / Job Title'}</label>
                     <input
                        type="text"
                        id="role"
                        name="role"
                        autoComplete="organization-title"
                        required
                        value={fields.role}
                        onChange={(e) => updateField('role', e.target.value)}
                        aria-invalid={Boolean(errors.role)}
                        aria-describedby={errors.role ? 'role-error' : undefined}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-brand-blue focus:ring-4 focus:ring-blue-500/20"
                        placeholder={it ? 'Es. Consulente BPM…' : 'E.g. BPM consultant…'}
                      />
                     {errors.role && <p id="role-error" className="mt-1.5 ml-1 text-xs text-red-300">{it ? 'Inserisci il tuo ruolo.' : errors.role}</p>}
                  </div>

                  <p className="text-xs text-slate-300 mb-6 text-center">
                    {it ? 'Invia solo dati professionali non riservati.' : 'Submit professional, non-confidential information only.'}
                  </p>

                  {submitError && (
                    <div role="alert" className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    aria-busy={status === 'submitting'}
                    className="btn-primary w-full"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{it ? 'Invio…' : 'Processing…'}</span>
                      </span>
                    ) : (
                      <>
                        {it ? 'Ricevi gli aggiornamenti' : 'Request updates'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
      
      <div className="w-full relative z-10 mt-auto">
         <Footer />
      </div>
    </div>
  );
}
