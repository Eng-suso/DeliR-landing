import { Menu, Pause, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { interestCtaLabel, productInterestHref } from '../lib/publicOffer';
import LanguageSwitch from './LanguageSwitch';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    links: [['Il prodotto', '#caso'], ['Parliamone', '#conversation'], ['Dati e AI', '#fiducia'], ['Pilot', '#pilot']],
    cta: interestCtaLabel.it, open: 'Apri il menu', close: 'Chiudi il menu', nav: 'Navigazione principale',
  },
  en: {
    links: [['Product', '#caso'], ['Talk to me', '#conversation'], ['Data & AI', '#fiducia'], ['Pilot', '#pilot']],
    cta: interestCtaLabel.en, open: 'Open navigation menu', close: 'Close navigation menu', nav: 'Main navigation',
  },
} as const;

export default function Navbar() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundPaused, setBackgroundPaused] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.dataset.backgroundPaused = String(backgroundPaused);
    return () => { delete document.documentElement.dataset.backgroundPaused; };
  }, [backgroundPaused]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <header className="premium-navigation sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-lg">
      <nav aria-label={t.nav} className="section-shell">
        <div className="flex h-16 items-center justify-between gap-5">
          <Link to="/" aria-label="DeliR home" className="shrink-0 font-display text-[23px] font-semibold tracking-[-0.05em] text-brand-ink">
            DeliR<span className="text-brand-blue">.</span>
          </Link>
          <ul className="hidden items-center gap-7 lg:flex">
            {t.links.map(([label, href]) => (
              <li key={href}><a href={href} className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 transition-colors hover:text-brand-ink">{label}</a></li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-4">
            <button type="button" onClick={() => setBackgroundPaused((paused) => !paused)} aria-pressed={backgroundPaused} aria-label={language === 'it' ? 'Ferma lo sfondo animato' : 'Pause the animated background'} title={language === 'it' ? (backgroundPaused ? 'Riprendi lo sfondo' : 'Ferma lo sfondo') : (backgroundPaused ? 'Resume the background' : 'Pause the background')} className="background-motion-control inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-brand-blue/15 text-brand-blue transition-colors hover:bg-brand-blue/5">
              {backgroundPaused ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
            </button>
            <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitch />
            <a data-interest-section="navigation" href={productInterestHref(language)} className="btn-primary min-h-11 rounded-full px-5 py-2">{t.cta}</a>
            </div>
          </div>
          <button ref={menuButtonRef} type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? t.close : t.open} aria-expanded={isOpen} aria-controls="mobile-navigation" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand-ink transition-colors hover:bg-slate-100 lg:hidden">
            {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
        {isOpen ? (
          <div id="mobile-navigation" className="border-t border-slate-200 pb-5 lg:hidden">
            <ul className="py-2">
              {t.links.map(([label, href]) => (
                <li key={href}><a href={href} onClick={() => setIsOpen(false)} className="flex min-h-12 items-center text-base font-medium text-brand-ink">{label}</a></li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <LanguageSwitch />
              <a data-interest-section="navigation" href={productInterestHref(language)} onClick={() => setIsOpen(false)} className="btn-primary flex-1 rounded-lg">{t.cta}</a>
            </div>
          </div>
        ) : null}
      </nav>
      <div aria-hidden="true" data-scroll-progress className="scroll-progress" />
    </header>
  );
}
