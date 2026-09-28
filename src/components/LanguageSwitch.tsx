import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const base = dark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600';
  const active = 'bg-brand-blue text-white';

  return (
    <div className={`inline-flex rounded-full border p-1 text-xs font-semibold ${base}`} role="group" aria-label={language === 'it' ? 'Seleziona lingua' : 'Select language'}>
      {(['it', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          aria-label={option === 'it' ? 'Italiano' : 'English'}
          className={`min-h-10 min-w-10 rounded-full px-2 uppercase transition-colors ${language === option ? active : 'hover:text-current'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
