import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage } from '../../i18n/LanguageContext';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';

export default function NavbarV2() {
  const { language } = useLanguage();
  const it = language === 'it';
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);
  const links = [[it ? 'Piattaforma' : 'Platform', '#piattaforma'], [it ? 'Il prodotto' : 'Product', '#caso'], [it ? 'Come funziona' : 'How it works', '#incarico'], ['FAQ', '#faq']];
  return <header className="relative border-b border-slate-200 bg-white">
    <nav className="section-shell" aria-label={it ? 'Navigazione principale' : 'Main navigation'}>
      <div className="flex min-h-20 items-center justify-between gap-6">
        <Link to={it ? '/v2' : '/v2?lang=en'} className="inline-flex min-h-11 items-center font-display text-2xl font-bold tracking-tight text-brand-ink" aria-label="DeliR home">DeliR.</Link>
        <ul className="hidden items-center gap-6 lg:flex">{links.map(([label, href]) => <li key={href}><a href={href} className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 hover:text-brand-blue">{label}</a></li>)}</ul>
        <div className="hidden items-center gap-4 lg:flex"><LanguageSwitch /><a href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}</a></div>
        <button ref={toggle} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation-v2"
          aria-label={open ? (it ? 'Chiudi il menu' : 'Close navigation menu') : (it ? 'Apri il menu' : 'Open navigation menu')}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand-ink hover:bg-brand-mist lg:hidden">
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>
      <div id="mobile-navigation-v2" hidden={!open} className="border-t border-slate-200 pb-5 lg:hidden">
        <ul className="py-2">{links.map(([label, href]) => <li key={href}><a href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base text-brand-ink hover:text-brand-blue">{label}</a></li>)}</ul>
        <div className="flex flex-wrap items-center gap-4"><LanguageSwitch /><a href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}</a></div>
      </div>
    </nav>
  </header>;
}
