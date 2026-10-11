import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage } from '../../i18n/LanguageContext';

const copy = {
  it: {
    left: [['Piattaforma', '#piattaforma'], ['Come funziona', '#incarico']],
    right: [['Per consulenti', '#consulenti'], ['FAQ', '#faq']],
    cta: 'Candida un incarico',
    open: 'Apri il menu',
    close: 'Chiudi il menu',
    nav: 'Navigazione principale',
  },
  en: {
    left: [['Platform', '#piattaforma'], ['How it works', '#incarico']],
    right: [['For consultants', '#consulenti'], ['FAQ', '#faq']],
    cta: 'Apply with an engagement',
    open: 'Open navigation menu',
    close: 'Close navigation menu',
    nav: 'Main navigation',
  },
} as const;

const linkClass = 'inline-flex min-h-11 items-center text-[14px] text-muted transition-colors duration-150 hover:text-ink';

export default function NavbarV2() {
  const { language } = useLanguage();
  const t = copy[language];
  const [isOpen, setIsOpen] = useState(false);
  const links = [...t.left, ...t.right];

  return (
    <header className="relative z-20">
      <nav aria-label={t.nav} className="kit-shell">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6">
          <ul className="hidden items-center gap-8 lg:flex">
            {t.left.map(([label, href]) => (
              <li key={href}><a href={href} className={linkClass}>{label}</a></li>
            ))}
          </ul>

          <Link to="/" aria-label="DeliR home" className="col-start-1 justify-self-start font-grotesk text-[22px] font-semibold tracking-[-0.03em] text-ink lg:col-start-2 lg:justify-self-center">
            DeliR
          </Link>

          <div className="hidden items-center justify-end gap-8 lg:flex">
            <ul className="flex items-center gap-8">
              {t.right.map(([label, href]) => (
                <li key={href}><a href={href} className={linkClass}>{label}</a></li>
              ))}
            </ul>
            <LanguageSwitch />
            <Link to="/pilot" className="btn-solid min-h-11 px-4 py-2 text-[14px]">{t.cta}</Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="col-start-3 inline-flex min-h-11 min-w-11 items-center justify-center justify-self-end rounded-[10px] text-ink hover:bg-mist lg:hidden"
            aria-label={isOpen ? t.close : t.open}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-v2"
          >
            {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div id="mobile-navigation-v2" className="border-t border-slate-100 pb-5 lg:hidden">
            <ul className="py-2">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={() => setIsOpen(false)} className="flex min-h-12 items-center text-[16px] text-ink">{label}</a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4">
              <LanguageSwitch />
              <Link to="/pilot" onClick={() => setIsOpen(false)} className="btn-solid flex-1">{t.cta}</Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
