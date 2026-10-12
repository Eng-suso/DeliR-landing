import { Link, Navigate } from 'react-router-dom';
import { useFragment } from '../lib/useFragment';
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { comparisonProducts, comparisonRows, type ComparisonRow } from '../lib/comparisonContent';
import { pilotCtaLabel, pilotApplicationHref } from '../lib/publicOffer';
import DifferentiatorGrid from './DifferentiatorGrid';

const copy = {
  it: {
    eyebrow: 'Cosa conta nel tuo incarico',
    title: 'Scegli un percorso che puoi spiegare al cliente.',
    intro: 'Prima di confrontare gli strumenti, cerca tre cose: fonti verificabili, contesto che resta nel progetto e scenari da confrontare prima di raccomandare una modifica.',
    tableTitle: 'Confronta gli strumenti sul percorso consulenziale.',
    feature: 'Capacità nel lavoro del consulente', delir: 'Per il consulente',
    caption: 'Confronto delle capacità per l’analisi di processo',
    demo: 'Demo',
    demoLabel: 'Mostrato nella demo DeliR. Guarda il video',
    cellSources: 'Consulta il criterio e la documentazione di riferimento',
    yes: 'Sì', no: 'No',
    legend: '✓ Sì: copre il percorso descritto · ✗ No: fuori dal percorso confrontato.',
    proof: 'Valutazione DeliR del percorso consulenziale; non è un test comparativo negli account dei competitor.',
    reason: 'Porta al cliente il modello e le prove dietro la proposta.',
    reasonBody: 'Con DeliR puoi discutere il processo insieme alle fonti, ai punti aperti e al confronto AS-IS / TO-BE. Questo è il percorso mostrato nella demo.',
    secondary: 'Guarda il percorso completo',
    sources: 'Criteri e documentazione dei prodotti',
  },
  en: {
    eyebrow: 'What matters in your engagement',
    title: 'Choose a workflow you can explain to your client.',
    intro: 'Before comparing tools, look for three things: evidence you can verify, context retained in the project, and scenarios you can compare before recommending a change.',
    tableTitle: 'Compare tools against the consulting workflow.',
    feature: 'Capabilities in a consultant’s work', delir: 'For consultants',
    caption: 'Process analysis capability comparison',
    demo: 'Demo',
    demoLabel: 'Shown in the DeliR demo. Watch the video',
    cellSources: 'Read the criterion and reference documentation',
    yes: 'Yes', no: 'No',
    legend: '✓ Yes: covers the described workflow · ✗ No: outside the compared workflow.',
    proof: 'DeliR’s assessment of the consulting workflow; not a comparative test in competitor accounts.',
    reason: 'Bring the model and the evidence behind your proposal to the client.',
    reasonBody: 'With DeliR, discuss the process alongside its sources, open questions and AS-IS / TO-BE comparison. This is the workflow shown in the demo.',
    secondary: 'Watch the complete workflow',
    sources: 'Criteria and product documentation',
  },
} as const;

export default function Comparison() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];
  const sourcesPath = `/comparison-sources${language === 'en' ? '?lang=en' : ''}`;
  if (fragment.startsWith('comparison-evidence-')) return <Navigate replace to={`${sourcesPath}#${fragment}`} />;
  function statusLink(row: ComparisonRow, product?: typeof comparisonProducts[number]) {
    const status = product ? row.cells[product.id].status : 'yes';
    const name = product?.name ?? 'DeliR';
    const Icon = status === 'yes' ? Check : X;
    const label = `${name} · ${row.label[language]} · ${t[status]} · ${product ? t.cellSources : t.demoLabel}`;
    const className = `comparison-rating ${product ? (status === 'yes' ? 'comparison-rating--yes' : 'comparison-rating--no') : 'comparison-rating--delir'}`;
    const content = <><Icon aria-hidden="true" /><span className="sr-only">{t[status]}</span></>;
    return product
      ? <Link to={`${sourcesPath}#comparison-evidence-${row.id}`} aria-label={label} className={className}>{content}</Link>
      : <a href={row.evidence} aria-label={label} className={className}>{content}</a>;
  }

  return (
    <section id="confronto" className="premium-comparison scroll-mt-16 border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="comparison-title">
      <div className="section-shell">
        <p data-reveal className="landing-eyebrow">{t.eyebrow}</p>
        <h2 data-reveal id="comparison-title" className="landing-title mt-5 max-w-[27ch]">{t.title}</h2>
        <p data-reveal data-reveal-delay={80} className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{t.intro}</p>

        <details className="mt-6 border-y border-slate-200 py-2"><summary className="min-h-11 cursor-pointer py-3 font-semibold text-brand-blue">{language === 'it' ? 'Esplora i sei criteri nella demo' : 'Explore the six criteria in the demo'}</summary><DifferentiatorGrid /></details>
        <h3 className="mt-12 text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-brand-ink sm:mt-16">{t.tableTitle}</h3>

        <div className="comparison-table mt-8">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <caption className="sr-only">{t.caption}. {t.proof}</caption>
            <colgroup><col className="comparison-feature-column" /><col />{comparisonProducts.map(p => <col key={p.id} />)}</colgroup>
            <thead><tr>
              <th scope="col" className="comparison-feature-heading">{t.feature}</th>
              <th scope="col" className="comparison-product-heading comparison-delir-heading"><span className="comparison-product-name" translate="no">DeliR</span></th>
              {comparisonProducts.map(p => <th key={p.id} scope="col" className="comparison-product-heading"><span className="comparison-product-name" translate="no">{p.name}</span></th>)}
            </tr></thead>
            <tbody>{comparisonRows.map(row => <tr key={row.id}>
              <th scope="row" className="comparison-feature-label">{row.label[language]}</th>
              <td className="comparison-delir-cell">{statusLink(row)}</td>
              {comparisonProducts.map(p => <td key={p.id}>{statusLink(row, p)}</td>)}
            </tr>)}</tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-600">{t.legend}</p>
        <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-600">{t.proof}</p>

        <div className="comparison-next mt-8 flex flex-col gap-6 rounded-2xl bg-brand-mist p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl"><h3 className="font-display text-xl font-semibold text-brand-ink">{t.reason}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t.reasonBody}</p></div>
          <div className="flex shrink-0 flex-col items-start gap-4"><a href={pilotApplicationHref(language)} className="btn-primary whitespace-normal">{pilotCtaLabel[language]}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a><a href="#caso" className="btn-text">{t.secondary}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
        </div>

        <Link to={sourcesPath} className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-brand-blue underline underline-offset-4">{t.sources}<ArrowUpRight aria-hidden="true" className="ml-2 size-4" /></Link>
      </div>
    </section>
  );
}
