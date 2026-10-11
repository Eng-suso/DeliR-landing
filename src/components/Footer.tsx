import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { publicContactEmail } from '../lib/publicOffer';

export default function Footer() {
  const { language } = useLanguage(); const it = language === 'it'; const home = it ? '/' : '/?lang=en';
  return <footer className="relative z-10 border-t border-white/10 bg-brand-blue-hover py-8"><div className="section-shell flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
    <div><Link to={home} className="inline-flex min-h-11 items-center font-display text-xl font-bold tracking-tight text-white">DeliR.</Link><p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} DeliR — Sohayb Raqaq</p></div>
    <nav aria-label={it ? 'Collegamenti nel footer' : 'Footer links'} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"><Link to={`${home}#caso`} className="inline-flex min-h-11 items-center hover:text-white">{it ? 'Il prodotto' : 'Product'}</Link><Link to={`${home}#fiducia`} className="inline-flex min-h-11 items-center hover:text-white">{it ? 'Dati e AI' : 'Data and AI'}</Link><Link to={`${home}#pilot`} className="inline-flex min-h-11 items-center hover:text-white">Pilot</Link><a href={`mailto:${publicContactEmail}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">{publicContactEmail}</a></nav>
  </div></footer>;
}
