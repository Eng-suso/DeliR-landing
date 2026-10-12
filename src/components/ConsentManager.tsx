import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { analyticsAvailable, consentKey, readConsent, saveConsent } from '../privacy/settings';
import { startAnalytics, stopAnalytics, trackPage } from '../privacy/analytics';

export default function ConsentManager() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const it = language === 'it';
  const [consent, setConsent] = useState(readConsent);
  const [open, setOpen] = useState(() => analyticsAvailable && !readConsent());
  const dialog = useRef<HTMLDialogElement>(null);
  const reject = useRef<HTMLButtonElement>(null);
  const allowed = analyticsAvailable && consent?.analytics === true;

  useEffect(() => {
    const show = () => setOpen(true);
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

  return <dialog ref={dialog} aria-labelledby="consent-title" aria-describedby="consent-description"
    onCancel={(event) => { event.preventDefault(); choose(false); }}
    className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/40 sm:p-8">
    <h2 id="consent-title" className="text-balance font-display text-2xl font-semibold">{it ? 'La tua scelta sui cookie' : 'Your cookie choice'}</h2>
    <p id="consent-description" className="mt-4 text-base leading-7 text-slate-600">{analyticsAvailable
      ? (it ? 'Usiamo la memoria del browser per lingua e preferenze. Con il tuo consenso, Google Analytics misura le visite. Puoi rifiutare e continuare a usare il sito, o cambiare scelta in qualsiasi momento dal footer. Non attiviamo funzionalità pubblicitarie.' : 'We store language and preferences in your browser. With your consent, Google Analytics measures visits. You can reject and continue using the site, or change your choice at any time in the footer. Advertising features stay disabled.')
      : (it ? 'Google Analytics è disattivato. Usiamo la memoria del browser per lingua e preferenze; i cookie analitici Google non sono attivi. Puoi consultare l’informativa Privacy e cookie.' : 'Google Analytics is disabled. We store language and preferences in your browser; Google analytics cookies are inactive. You can read the Privacy and cookies notice.')}</p>
    <Link to={it ? '/privacy' : '/privacy?lang=en'} onClick={() => setOpen(false)} className="mt-3 inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">{it ? 'Privacy e cookie' : 'Privacy and cookies'}</Link>
    <p className="mt-2 text-sm text-slate-600">{it ? 'Scelta attuale: ' : 'Current choice: '}{allowed ? (it ? 'analytics accettati' : 'analytics accepted') : (it ? 'analytics disattivati' : 'analytics disabled')}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <button ref={reject} type="button" className="btn-secondary rounded-[10px]" onClick={() => choose(false)}>{it ? 'Rifiuta analytics' : 'Reject analytics'}</button>
      <button type="button" className="btn-secondary rounded-[10px]" disabled={!analyticsAvailable} onClick={() => choose(true)}>{it ? 'Accetta analytics' : 'Accept analytics'}</button>
    </div>
  </dialog>;
}
