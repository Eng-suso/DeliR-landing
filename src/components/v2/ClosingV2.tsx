import { Link } from 'react-router-dom';
import { finalCtaCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { productClips } from '../../lib/productClips';
import { pilotApplicationHref, publicContactEmail } from '../../lib/publicOffer';
import ActionV2 from './ActionV2';
import DemoStillV2 from './DemoStillV2';

export function FinalCTAV2() {
  const { language } = useLanguage();
  const t = finalCtaCopy[language];
  return <section id="early-access" className="v2-section v2-final" aria-labelledby="final-v2-title">
    <div className="section-shell">
      <div className="v2-final-visual"><DemoStillV2 clip={productClips.hero} /></div>
      <p className="landing-eyebrow">{t.eyebrow}</p>
      <h2 id="final-v2-title" className="v2-title mt-5">{t.title}</h2>
      <p className="v2-body mt-5">{t.intro}</p>
      <p className="v2-body mt-3">{t.body}</p>
      <ActionV2 className="mt-7" />
      <p className="mt-4 text-sm leading-7 text-slate-600">{t.pilotLead} <a href={pilotApplicationHref(language)} className="inline-flex min-h-11 items-center font-semibold text-brand-blue underline underline-offset-4">{t.pilotAction}</a>.</p>
      <p className="mt-2 text-xs leading-6 text-slate-600">{t.terms}</p>
    </div>
  </section>;
}

export function FooterV2() {
  const { language } = useLanguage();
  const it = language === 'it';
  const locale = it ? '' : '?lang=en';
  return <footer className="v2-footer">
    <div className="section-shell">
      <Link to={`/v2${locale}`} className="inline-flex min-h-11 items-center font-display text-xl font-bold">DeliR.</Link>
      <nav aria-label={it ? 'Collegamenti nel footer' : 'Footer links'} className="flex flex-wrap justify-center gap-x-5">
        <a href="#caso">{it ? 'Il prodotto' : 'Product'}</a>
        <Link to={`/security-data${locale}`}>{it ? 'Sicurezza e dati' : 'Security & Data'}</Link>
        <Link to={`/privacy${locale}`}>{it ? 'Privacy e cookie' : 'Privacy and cookies'}</Link>
        <a href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>
        <button type="button" onClick={() => window.dispatchEvent(new Event('delir:cookie-preferences'))}>{it ? 'Preferenze cookie' : 'Cookie preferences'}</button>
      </nav>
      <p className="mt-2 text-xs leading-6 text-slate-600">&copy; {new Date().getFullYear()} DeliR — Sohayb Raqaq</p>
    </div>
  </footer>;
}
