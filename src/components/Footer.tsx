import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { publicContactEmail } from '../lib/publicOffer';

export default function Footer({ homePath = '/' }: { homePath?: string }) {
  const { language } = useLanguage(); const it = language === 'it'; const home = it ? homePath : `${homePath}?lang=en`;
  return <footer className="relative z-10 border-t border-white/10 bg-brand-blue-hover py-8"><div className="section-shell flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
    <div><Link to={homePath === '/' ? home : `${home}#hero`} className="inline-flex min-h-11 items-center font-display text-xl font-bold tracking-tight text-white">DeliR.</Link><p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} DeliR — Sohayb Raqaq</p></div>
    <nav aria-label={it ? 'Collegamenti nel footer' : 'Footer links'} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"><Link to={`${home}#caso`} className="inline-flex min-h-11 items-center hover:text-white">{it ? 'Il prodotto' : 'Product'}</Link><Link to={it ? '/security-data' : '/security-data?lang=en'} className="inline-flex min-h-11 items-center hover:text-white">{it ? 'Sicurezza e dati' : 'Security & Data'}</Link><Link to={`${home}#pilot`} className="inline-flex min-h-11 items-center hover:text-white">Pilot</Link><a href={`mailto:${publicContactEmail}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">{publicContactEmail}</a></nav>
    <nav aria-label={it ? 'Privacy e preferenze' : 'Privacy and preferences'} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
      <Link to={it ? '/waitlist' : '/waitlist?lang=en'} className="inline-flex min-h-11 items-center underline underline-offset-4">{it ? 'Lista d’attesa' : 'Waitlist'}</Link>
      <Link to={it ? '/privacy' : '/privacy?lang=en'} className="inline-flex min-h-11 items-center underline underline-offset-4">{it ? 'Privacy e cookie' : 'Privacy and cookies'}</Link>
      <button type="button" onClick={() => window.dispatchEvent(new Event('delir:cookie-preferences'))} className="inline-flex min-h-11 items-center underline underline-offset-4">{it ? 'Preferenze cookie' : 'Cookie preferences'}</button>
    </nav>
  </div></footer>;
}
