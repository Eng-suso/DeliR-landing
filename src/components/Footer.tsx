import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const t = language === 'it'
    ? { rights: 'Tutti i diritti riservati.', audit: 'Audit enterprise', privacy: 'Privacy', terms: 'Termini', contact: 'Contatti', soon: 'In arrivo' }
    : { rights: 'All rights reserved.', audit: 'Enterprise audit', privacy: 'Privacy', terms: 'Terms', contact: 'Contact', soon: 'Coming soon' };
  return (
    <footer className="py-12 relative z-10 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center">
          <span className="font-display font-bold text-xl tracking-tighter text-white">
            DeliR<span className="text-brand-blue">.</span>
          </span>
        </div>
        <div className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} DeliR Inc. {t.rights}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
          <Link to="/enterprise-readiness" className="hover:text-white transition-colors">{t.audit}</Link>
          <span className="text-slate-400" title={t.soon}>{t.privacy}</span>
          <span className="text-slate-400" title={t.soon}>{t.terms}</span>
          <a href="mailto:hello@delir.ai" className="hover:text-white transition-colors">{t.contact}</a>
        </div>
      </div>
    </footer>
  );
}
