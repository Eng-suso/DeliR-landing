import { useLanguage } from '../i18n/LanguageContext';

export default function SkipLink() {
  const { language } = useLanguage();
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition-transform focus:translate-y-0"
    >
      {language === 'it' ? 'Vai al contenuto' : 'Skip to content'}
    </a>
  );
}
