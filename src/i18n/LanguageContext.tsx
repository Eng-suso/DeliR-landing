import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Language = 'it' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'delir-language';

// Storage access throws when the browser blocks site data; the language choice is a convenience, never fatal.
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'it';
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'it';
  } catch {
    return 'it';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [storedLanguage, setStoredLanguage] = useState<Language>(getInitialLanguage);
  const location = useLocation();
  const navigate = useNavigate();
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  const language = requestedLanguage === 'en' || requestedLanguage === 'it' ? requestedLanguage : storedLanguage;

  // Keep the document language aligned with translated content before it is painted.
  useLayoutEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Preference simply won't persist across visits.
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage: (next: Language) => {
    setStoredLanguage(next);
    const params = new URLSearchParams(location.search);
    params.set('lang', next);
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '', hash: location.hash }, { replace: true, preventScrollReset: true });
  } }), [language, location.pathname, location.search, location.hash, navigate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
