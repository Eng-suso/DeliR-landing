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

  const actionClass = 'min-h-11 cursor-pointer rounded-lg border border-blue-700 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-500 disabled:hover:bg-white';

  return <dialog ref={dialog} aria-labelledby="consent-title" aria-describedby="consent-description" data-lenis-prevent=""
    onCancel={(event) => { event.preventDefault(); choose(false); }}
    className="fixed inset-x-0 bottom-4 top-auto mx-auto my-0 max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-slate-900 shadow-[0_12px_64px_rgba(15,23,42,0.18)] backdrop:bg-slate-950/15 sm:p-7">
    <div className="flex items-start justify-between gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">DeliR · Privacy</p><h2 id="consent-title" className="mt-2 text-balance font-display text-2xl font-semibold">{it ? 'La tua scelta sui cookie' : 'Your cookie choice'}</h2></div>
      <button type="button" onClick={() => choose(false)} aria-label={it ? 'Chiudi senza accettare analytics' : 'Close without accepting analytics'} className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><X className="h-5 w-5" aria-hidden="true" /></button>
    </div>
    <p id="consent-description" className="mt-4 text-base leading-7 text-slate-600">{analyticsAvailable
      ? (it ? 'Usiamo la memoria del browser per lingua e preferenze. Con il tuo consenso, Google Analytics misura le visite. Puoi rifiutare e continuare a usare il sito, o cambiare scelta in qualsiasi momento dal footer. Non attiviamo funzionalità pubblicitarie.' : 'We store language and preferences in your browser. With your consent, Google Analytics measures visits. You can reject and continue using the site, or change your choice at any time in the footer. Advertising features stay disabled.')
      : (it ? 'Google Analytics è disattivato. Usiamo la memoria del browser per lingua e preferenze; i cookie analitici Google non sono attivi. Puoi consultare l’informativa Privacy e cookie.' : 'Google Analytics is disabled. We store language and preferences in your browser; Google analytics cookies are inactive. You can read the Privacy and cookies notice.')}</p>
    <Link to={it ? '/privacy' : '/privacy?lang=en'} onClick={() => setOpen(false)} className="mt-3 inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">{it ? 'Privacy e cookie' : 'Privacy and cookies'}</Link>
    {details ? <div id="consent-categories" className="mt-4 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
      <label htmlFor="consent-necessary" aria-label={it ? 'Memorie necessarie' : 'Necessary storage'} className="flex min-h-11 items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input id="consent-necessary" type="checkbox" name="necessary-storage" checked disabled readOnly className="mt-1 h-5 w-5 shrink-0 accent-blue-700" />
        <span><span className="block font-semibold">{it ? 'Memorie necessarie · sempre attive' : 'Necessary storage · always active'}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{it ? 'Lingua e scelta sui cookie. Non usate per profilazione.' : 'Language and cookie choice. Not used for profiling.'}</span></span>
      </label>
      <label htmlFor="consent-analytics" aria-label={it ? 'Analytics opzionali' : 'Optional analytics'} className="flex min-h-11 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input id="consent-analytics" type="checkbox" name="analytics-consent" checked={analyticsChoice} disabled={!analyticsAvailable} onChange={event => setAnalyticsChoice(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" />
        <span><span className="block font-semibold">{it ? 'Analytics · opzionali' : 'Analytics · optional'}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{analyticsAvailable ? (it ? 'Google Analytics 4 per misurare le visite. Puoi cambiare scelta dal footer.' : 'Google Analytics 4 to measure visits. Change your choice in the footer.') : (it ? 'Google Analytics 4 è attualmente disattivato.' : 'Google Analytics 4 is currently disabled.')}</span></span>
      </label>
    </div> : null}
    <p className="mt-2 text-sm text-slate-600">{it ? 'Scelta attuale: ' : 'Current choice: '}{allowed ? (it ? 'analytics accettati' : 'analytics accepted') : (it ? 'analytics disattivati' : 'analytics disabled')}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <button ref={reject} type="button" className={actionClass} onClick={() => choose(false)}>{it ? 'Rifiuta analytics' : 'Reject analytics'}</button>
      <button type="button" className={actionClass} disabled={!analyticsAvailable} onClick={() => choose(true)}>{it ? 'Accetta analytics' : 'Accept analytics'}</button>
      {details ? <button type="button" className={actionClass} onClick={() => choose(analyticsChoice)}>{it ? 'Salva preferenze' : 'Save preferences'}</button> : <button type="button" className={actionClass} aria-expanded={false} aria-controls="consent-categories" onClick={() => setDetails(true)}>{it ? 'Personalizza' : 'Customize'}</button>}
    </div>
  </dialog>;
}
