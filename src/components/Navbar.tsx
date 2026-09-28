import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import LanguageSwitch from './LanguageSwitch';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: { product: 'Piattaforma', how: 'Come funziona', consultants: 'Per consulenti', pilot: 'Pilot', cta: 'Candida un incarico', open: 'Apri il menu', close: 'Chiudi il menu' },
  en: { product: 'Platform', how: 'How it works', consultants: 'For consultants', pilot: 'Pilot', cta: 'Apply with an engagement', open: 'Open navigation menu', close: 'Close navigation menu' },
} as const;

export default function Navbar() {
  const { language } = useLanguage();
  const t = copy[language];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-auto flex w-[96%] max-w-7xl origin-top flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/92 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl sm:px-8 md:rounded-full"
      >
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex shrink-0 items-center">
            <Link to="/" aria-label="DeliR home">
              <span className="font-display text-2xl font-bold tracking-tighter text-slate-900">
                DeliR<span className="text-blue-600">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden shrink-0 items-center space-x-8 md:flex">
            <a href="#product" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.product}</a>
            <a href="#incarico" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.how}</a>
            <a href="#consultants" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.consultants}</a>
            <a href="#pilot" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.pilot}</a>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <LanguageSwitch />
            <Link
              to="/pilot"
              className="btn-primary min-h-10 px-5 py-2"
              title={t.cta}
            >
              {t.cta}
            </Link>
          </div>

          <div className="flex shrink-0 items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-blue-200"
              aria-label={isOpen ? t.close : t.open}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-100 mt-2 px-2 pb-4 space-y-1"
            >
              <a onClick={() => setIsOpen(false)} href="#product" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">{t.product}</a>
              <a onClick={() => setIsOpen(false)} href="#incarico" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">{t.how}</a>
              <a onClick={() => setIsOpen(false)} href="#consultants" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">{t.consultants}</a>
              <a onClick={() => setIsOpen(false)} href="#pilot" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">{t.pilot}</a>
              <div className="flex items-center justify-between gap-3 px-4 py-2">
                <LanguageSwitch />
              </div>
              <div className="pt-1">
                <Link
                  to="/pilot"
                  className="btn-primary w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {t.cta}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
