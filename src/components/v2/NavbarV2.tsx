import { Mail, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage } from '../../i18n/LanguageContext';
import { interestCtaLabel, productInterestHref, publicContactEmail } from '../../lib/publicOffer';

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
  return <header className="v2-header">
    <div className="v2-mobile-contact">
      <div className="section-shell">
        <a href={`mailto:${publicContactEmail}`}><Mail aria-hidden="true" className="size-4" />{publicContactEmail}</a>
        <LanguageSwitch />
      </div>
    </div>
    <nav className="section-shell" aria-label={it ? 'Navigazione principale' : 'Main navigation'}>
      <div className="v2-nav-row">
        <Link to={it ? '/v2' : '/v2?lang=en'} className="v2-logo" aria-label="DeliR home">DeliR.</Link>
        <div className="v2-desktop-contact">
          <a href={`mailto:${publicContactEmail}`}><Mail aria-hidden="true" className="size-4" />{publicContactEmail}</a>
          <LanguageSwitch />
        </div>
        <a href={productInterestHref(language)} className="btn-primary v2-nav-cta">{interestCtaLabel[language]}</a>
        <button ref={toggle} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation-v2"
          aria-label={open ? (it ? 'Chiudi il menu' : 'Close navigation menu') : (it ? 'Apri il menu' : 'Open navigation menu')}
          className="v2-nav-toggle">
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>
      <div id="mobile-navigation-v2" hidden={!open} className="v2-navigation-panel">
        <ul>{links.map(([label, href]) => <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>)}</ul>
      </div>
    </nav>
  </header>;
}
