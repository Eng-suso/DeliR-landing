import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { analyticsAvailable, consentKey, readConsent, saveConsent } from '../privacy/settings';
import { startAnalytics, stopAnalytics, trackPage } from '../privacy/analytics';

export default function ConsentManager() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const it = language === 'it';
  const [consent, setConsent] = useState(readConsent);
  const [open, setOpen] = useState(() => analyticsAvailable && !readConsent());
  const [details, setDetails] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(() => analyticsAvailable && readConsent()?.analytics === true);
  const dialog = useRef<HTMLDialogElement>(null);
  const reject = useRef<HTMLButtonElement>(null);
  const allowed = analyticsAvailable && consent?.analytics === true;

  useEffect(() => {
    const show = () => {
      setDetails(false);
      setAnalyticsChoice(analyticsAvailable && readConsent()?.analytics === true);
      setOpen(true);
    };
    const sync = (event: StorageEvent) => {
      if (event.key !== consentKey && event.key !== null) return;
      const next = readConsent();
      if (!next?.analytics && stopAnalytics()) location.reload();
      setConsent(next);
      if (next) setOpen(false);
    };
    window.addEventListener('delir:cookie-preferences', show);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('delir:cookie-preferences', show);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!open) { dialog.current?.close(); return; }
    dialog.current?.showModal();
    reject.current?.focus();
  }, [open]);

  useEffect(() => {
    if (allowed) { startAnalytics(true); trackPage(pathname, language, true); }
    else if (stopAnalytics()) location.reload();
  }, [allowed, pathname, language]);

  // Expire even an open tab: a previously granted choice must not last forever.
  useEffect(() => {
    if (!consent) return;
    let timer: number;
    const check = () => {
      if (consent.expiresAt <= Date.now()) {
        if (stopAnalytics()) location.reload();
        setConsent(null);
        setAnalyticsChoice(false);
        setDetails(false);
        setOpen(analyticsAvailable);
      } else timer = window.setTimeout(check, Math.min(consent.expiresAt - Date.now(), 86400000));
    };
    timer = window.setTimeout(check, Math.min(Math.max(0, consent.expiresAt - Date.now()), 86400000));
    return () => clearTimeout(timer);
  }, [consent]);

  function choose(analytics: boolean) {
    const next = saveConsent(analyticsAvailable && analytics);
    const reload = !next.analytics && stopAnalytics();
    setConsent(next);
    setOpen(false);
    if (reload) location.reload();
  }

  const actionClass = 'min-h-11 cursor-pointer rounded-lg border border-blue-700 bg-white px-3 py-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-500 disabled:hover:bg-white';

  return <dialog ref={dialog} aria-labelledby="consent-title" aria-describedby="consent-description" data-lenis-prevent=""
    onCancel={(event) => { event.preventDefault(); choose(false); }}
    className="fixed inset-x-0 bottom-4 top-auto mx-auto my-0 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-slate-900 shadow-[0_12px_64px_rgba(15,23,42,0.18)] backdrop:bg-slate-950/15 sm:ml-auto sm:mr-4 sm:p-4">
    <div className="flex items-start justify-between gap-5">
      <h2 id="consent-title" className="pt-2 font-display text-lg font-semibold">{it ? 'Cookie e privacy' : 'Cookies and privacy'}</h2>
      <button type="button" onClick={() => choose(false)} aria-label={it ? 'Chiudi senza accettare analytics' : 'Close without accepting analytics'} className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><X className="h-5 w-5" aria-hidden="true" /></button>
    </div>
    <p id="consent-description" className="mt-2 text-sm leading-6 text-slate-600">{analyticsAvailable
      ? (it ? 'Usiamo strumenti tecnici per ricordare lingua e preferenze. Con il tuo consenso, i cookie analitici ci aiutano a capire come viene usato il sito e a migliorarlo. Chiudere equivale a rifiutare. Puoi cambiare scelta dal footer.' : 'We use necessary storage to remember language and preferences. With your consent, analytics cookies help us understand how the site is used and improve it. Closing means rejecting. Change your choice in the footer.')
      : (it ? 'Cookie tecnici per lingua e preferenze. Cookie analitici disattivati.' : 'Necessary storage for language and preferences. Analytics cookies are disabled.')}</p>
    <Link to={it ? '/privacy' : '/privacy?lang=en'} onClick={() => setOpen(false)} className="inline-flex min-h-6 items-center text-sm text-brand-blue underline underline-offset-4">{it ? 'Privacy e cookie' : 'Privacy and cookies'}</Link>
    {details ? <div id="consent-categories" className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
      <div id="consent-necessary" className="py-2">
        <p className="text-sm font-semibold">{it ? 'Necessari — sempre attivi' : 'Necessary — always active'}</p>
        <p className="sr-only">{it ? 'Ricordano la lingua e la scelta sui cookie.' : 'Remember your language and cookie choice.'}</p>
      </div>
      <label htmlFor="consent-analytics" aria-label={it ? 'Analytics opzionali' : 'Optional analytics'} className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
        <input id="consent-analytics" type="checkbox" name="analytics-consent" checked={analyticsChoice} disabled={!analyticsAvailable} onChange={event => setAnalyticsChoice(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" />
        <span><span className="block font-semibold">{it ? 'Analytics · opzionali' : 'Analytics · optional'}</span><span className="block text-xs leading-5 text-slate-600">{analyticsAvailable ? (it ? 'Google Analytics 4 per misurare le visite. Puoi cambiare scelta dal footer.' : 'Google Analytics 4 to measure visits. Change your choice in the footer.') : (it ? 'Google Analytics 4 è attualmente disattivato.' : 'Google Analytics 4 is currently disabled.')}</span></span>
      </label>
    </div> : null}
    <div className={`mt-2 grid gap-2 grid-cols-2 sm:grid-cols-3`}>
      <button ref={reject} type="button" className={actionClass} onClick={() => choose(false)}>{it ? 'Rifiuta' : 'Reject'}</button>
      <button type="button" className={actionClass} disabled={!analyticsAvailable} onClick={() => choose(true)}>{it ? 'Accetta' : 'Accept'}</button>
      {details ? <button type="button" className={`${actionClass} col-span-2 sm:col-span-1`} onClick={() => choose(analyticsChoice)}>{it ? 'Salva preferenze' : 'Save preferences'}</button> : <button type="button" className={`${actionClass} col-span-2 sm:col-span-1`} aria-expanded={false} aria-controls="consent-categories" onClick={() => setDetails(true)}>{it ? 'Gestisci preferenze' : 'Manage preferences'}</button>}
    </div>
  </dialog>;
}
