import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Errore 404',
    title: 'Pagina non trovata',
    body: 'L’indirizzo che hai aperto non esiste o è stato spostato.',
    home: 'Torna alla home',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'Page not found',
    body: 'The address you opened does not exist or has moved.',
    home: 'Back to home',
  },
};

// The SPA fallback answers unknown paths with 200, so noindex keeps them out of search results.
export default function NotFoundPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="flex min-h-dvh flex-col bg-[#f2f8ff] text-brand-ink">
      <SkipLink />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 py-6 sm:px-6 lg:px-8">
        <LanguageSwitch />
      </header>
      <main id="main-content" className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 pb-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{t.eyebrow}</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-tight tracking-[-0.035em] sm:text-5xl">{t.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{t.body}</p>
        <Link
          to="/"
          className="btn-primary mt-10 w-fit rounded-full"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t.home}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
