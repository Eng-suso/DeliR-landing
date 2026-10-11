import { Link } from 'react-router-dom';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import PilotInvitation from '../components/PilotInvitation';
import BuiltFor from '../components/BuiltFor';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import '../styles/premium-landing.css';

export default function PilotOverviewPage() {
  const { language } = useLanguage(); const it = language === 'it';
  return <div className="offer-page min-h-dvh bg-white"><SkipLink /><header className="border-b border-slate-200"><div className="section-shell flex min-h-20 items-center justify-between gap-4"><Link to={it ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue">← {it ? 'Torna al prodotto' : 'Back to the product'}</Link><LanguageSwitch /></div></header>
    <main id="main-content"><div className="section-shell pt-12"><h1 className="font-display text-3xl font-semibold text-brand-ink">{it ? 'Valuta un pilot DeliR sul tuo incarico.' : 'Evaluate a DeliR pilot for your engagement.'}</h1></div><PilotInvitation /><BuiltFor /></main><Footer />
  </div>;
}
