import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import FragmentNavigation from '../components/FragmentNavigation';
import { useLanguage } from '../i18n/LanguageContext';
import { useFragment } from '../lib/useFragment';
import { comparisonProducts, comparisonRows, comparisonSources, comparisonProductStrengths } from '../lib/comparisonContent';
import '../styles/premium-landing.css';

const copy = {
  it: {
    back: 'Torna al confronto', title: 'Criteri e documentazione dei prodotti',
    method: 'Documentazione pubblica consultata il 21 ottobre 2026. Documentato: capacità descritta dal produttore. Parziale: copre una parte del criterio o richiede passaggi manuali; è una nostra interpretazione del perimetro documentato. Da verificare: le fonti consultate non bastano a confermare il criterio, non significa che la capacità sia assente. I video mostrano DeliR; non abbiamo eseguito test negli account dei competitor. ChatGPT e Claude sono una categoria di assistenti: funzioni e disponibilità possono differire tra i due. Piani, configurazioni e integrazioni vanno valutati per il proprio progetto.',
    yes: 'Documentato', partial: 'Parziale', unknown: 'Da verificare', demo: 'Demo', newTab: ' (si apre in una nuova scheda)',
  },
  en: {
    back: 'Back to the comparison', title: 'Criteria and product documentation',
    method: 'Public documentation reviewed on 21 October 2026. Documented: a capability described by the vendor. Partial: covers part of the criterion or requires manual steps; this is our interpretation of the documented scope. To verify: reviewed sources do not establish the criterion; it does not mean the capability is absent. Videos show DeliR; we have not tested competitor accounts. ChatGPT and Claude form an assistant category: features and availability can differ between them. Assess plans, configurations and integrations for your project.',
    yes: 'Documented', partial: 'Partial', unknown: 'To verify', demo: 'Demo', newTab: ' (opens in a new tab)',
  },
} as const;

export default function ComparisonSourcesPage() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];
  const home = language === 'en' ? '/?lang=en' : '/';
  useLayoutEffect(() => {
    const target = (fragment && document.getElementById(fragment)) || document.getElementById('main-content');
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
      <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{comparisonProducts.map(product => <div key={product.id} className="border-b border-slate-200 pb-4"><dt className="font-semibold">{product.name}</dt><dd className="mt-2 text-sm leading-6 text-slate-600">{comparisonProductStrengths[product.id][language]}</dd></div>)}</dl>
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
