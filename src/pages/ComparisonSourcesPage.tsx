import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import FragmentNavigation from '../components/FragmentNavigation';
import { useLanguage } from '../i18n/LanguageContext';
import { useFragment } from '../lib/useFragment';
import { comparisonProducts, comparisonRows, comparisonSources } from '../lib/comparisonContent';
import '../styles/premium-landing.css';

const copy = {
  it: {
    back: 'Torna al confronto', title: 'Criteri e documentazione dei prodotti',
    method: "La matrice riporta i giudizi forniti dal team DeliR sul workflow consulenziale descritto in ogni riga. I video illustrano il percorso DeliR; i link ufficiali forniscono il contesto dei prodotti, senza costituire una verifica indipendente di ogni giudizio. ChatGPT/Claude: utilizzo standard di chat, progetti e artifact. Codice su misura, estensioni e integrazioni sono fuori ambito. Un No riguarda questo percorso, non ogni configurazione possibile. Piani e disponibilità possono variare.",
    yes: 'Sì', no: 'No', demo: 'Demo', newTab: ' (si apre in una nuova scheda)',
  },
  en: {
    back: 'Back to the comparison', title: 'Criteria and product documentation',
    method: "This matrix reports ratings supplied by the DeliR team for the consulting workflow defined in each row. Videos illustrate the DeliR workflow; official links provide product context rather than independent verification of every rating. ChatGPT/Claude: standard chat, projects and artifacts. Custom code, extensions and integrations are outside scope. No concerns this workflow, not every possible configuration. Plans and availability may vary.",
    yes: 'Yes', no: 'No', demo: 'Demo', newTab: ' (opens in a new tab)',
  },
} as const;

export default function ComparisonSourcesPage() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];
  const home = language === 'en' ? '/?lang=en' : '/';
  useLayoutEffect(() => {
    const target = document.getElementById(fragment || 'main-content');
    target?.focus({ preventScroll: true });
  }, [fragment]);
  return <div className="offer-page min-h-screen bg-white text-brand-ink">
    <SkipLink /><FragmentNavigation />
    <header className="border-b border-slate-200"><div className="section-shell flex min-h-20 items-center justify-between gap-4">
      <Link to={`${home}#confronto`} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue">← {t.back}</Link><LanguageSwitch />
    </div></header>
    <main id="main-content" tabIndex={-1} className="section-shell py-12 sm:py-20">
      <h1 className="landing-title max-w-3xl">{t.title}</h1>
      <p className="mt-6 max-w-4xl text-base leading-8 text-slate-600">{t.method}</p>
      <div className="mt-10 space-y-8">{comparisonRows.map(row => <section id={`comparison-evidence-${row.id}`} key={row.id} tabIndex={-1} aria-labelledby={`criterion-${row.id}`} className="scroll-mt-6 rounded-2xl border border-slate-200 p-5 sm:p-8">
        <h2 id={`criterion-${row.id}`} className="text-xl font-semibold text-brand-ink">{row.label[language]}</h2>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">{row.definition[language]}</p>
        <Link to={`${home}${row.evidence}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand-blue underline underline-offset-4">DeliR · {t.demo}</Link>
        <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">{comparisonProducts.map(product => <div key={product.id}>
          <dt className="text-sm font-semibold text-brand-ink">{product.name} · {t[row.cells[product.id].status]}</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-600">{row.cells[product.id].sources.map((id, index) => { const source = comparisonSources[id]; return <span key={id}>{index > 0 ? ' · ' : ''}<a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">{source.label}<span className="sr-only">{t.newTab}</span></a></span>; })}</dd>
        </div>)}</dl>
      </section>)}</div>
    </main><Footer />
  </div>;
}
