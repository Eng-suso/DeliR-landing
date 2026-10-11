import { useRef, useState } from 'react';
import { useFragment } from '../lib/useFragment';
import { ArrowRight, ArrowUpRight, Check, Plus, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { comparisonProducts, comparisonRows, comparisonSources, type ComparisonRow } from '../lib/comparisonContent';
import DifferentiatorGrid from './DifferentiatorGrid';

const copy = {
  it: {
    eyebrow: 'Cosa conta nel tuo incarico',
    title: 'Scegli un percorso che puoi spiegare al cliente.',
    intro: 'Sei criteri per mantenere collegate fonti, ipotesi e decisioni. Esplora il percorso nella demo, poi confronta gli strumenti rispetto al lavoro che devi consegnare.',
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
    primary: 'Scopri il pilot', secondary: 'Guarda il percorso completo',
    sources: 'Criteri e documentazione dei prodotti',
    method: 'La matrice riporta i giudizi forniti dal team DeliR sul workflow consulenziale descritto in ogni riga. I video illustrano il percorso DeliR; i link ufficiali forniscono il contesto dei prodotti, senza costituire una verifica indipendente di ogni giudizio. ChatGPT/Claude: utilizzo standard di chat, progetti e artifact. Codice su misura, estensioni e integrazioni sono fuori ambito. Un No riguarda questo percorso, non ogni configurazione possibile. Piani e disponibilità possono variare.',
    newTab: ' (si apre in una nuova scheda)',
  },
  en: {
    eyebrow: 'What matters in your engagement',
    title: 'Choose a workflow you can explain to your client.',
    intro: 'Six criteria for keeping sources, hypotheses and decisions connected. Explore the workflow in the demo, then compare tools against the work you need to deliver.',
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
    primary: 'Explore the pilot', secondary: 'Watch the complete workflow',
    sources: 'Criteria and product documentation',
    method: 'This matrix reports ratings supplied by the DeliR team for the consulting workflow defined in each row. Videos illustrate the DeliR workflow; official links provide product context rather than independent verification of every rating. ChatGPT/Claude: standard chat, projects and artifacts. Custom code, extensions and integrations are outside scope. No concerns this workflow, not every possible configuration. Plans and availability may vary.',
    newTab: ' (opens in a new tab)',
  },
} as const;

export default function Comparison() {
  const { language } = useLanguage();
  const sourcesRef = useRef<HTMLDetailsElement>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const fragment = useFragment();
  const [dismissedFragment, setDismissedFragment] = useState<string | null>(null);
  const showSources = sourcesOpen || (fragment.startsWith('comparison-evidence-') && fragment !== dismissedFragment);
  const t = copy[language];
  function showEvidence(rowId: string) {
    setDismissedFragment(null);
    setSourcesOpen(true);
    if (sourcesRef.current) sourcesRef.current.open = true;
    requestAnimationFrame(() => {
      const target = document.getElementById(`comparison-evidence-${rowId}`);
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  function statusLink(row: ComparisonRow, product?: typeof comparisonProducts[number]) {
    const status = product ? row.cells[product.id].status : 'yes';
    const name = product?.name ?? 'DeliR';
    const Icon = status === 'yes' ? Check : X;
    return <a href={product ? `#comparison-evidence-${row.id}` : row.evidence}
      onClick={product ? () => showEvidence(row.id) : undefined}
      aria-label={`${name} · ${row.label[language]} · ${t[status]} · ${product ? t.cellSources : t.demoLabel}`}
      className={`comparison-rating ${product ? (status === 'yes' ? 'comparison-rating--yes' : 'comparison-rating--no') : 'comparison-rating--delir'}`}>
      <Icon aria-hidden="true" />
      <span className="sr-only">{t[status]}</span>
    </a>;
  }

  return (
    <section id="confronto" className="premium-comparison scroll-mt-16 border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="comparison-title">
      <div className="section-shell">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="comparison-title" className="landing-title mt-5 max-w-[27ch]">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{t.intro}</p>

        <DifferentiatorGrid />
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
          <div className="flex shrink-0 flex-col items-start gap-4"><a href="#pilot" className="btn-primary whitespace-normal">{t.primary}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a><a href="#caso" className="btn-text">{t.secondary}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
        </div>

        <details ref={sourcesRef} open={showSources} className="group mt-5 border-t border-slate-200">
          <summary onClick={event => {
            event.preventDefault();
            setSourcesOpen(!showSources);
            setDismissedFragment(showSources ? fragment : null);
          }} className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-xs font-medium text-slate-600 hover:text-brand-blue [&::-webkit-details-marker]:hidden">{t.sources}<Plus aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-45" /></summary>
          {showSources ? <>
          <p className="max-w-4xl text-xs leading-6 text-slate-600">{t.method}</p>
          <div className="my-5 space-y-6">{comparisonRows.map(row => <div id={`comparison-evidence-${row.id}`} key={row.id} tabIndex={-1} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">{row.label[language]}</h3><p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">{row.definition[language]}</p><a href={row.evidence} className="mt-1 inline-flex min-h-11 items-center text-xs font-medium text-brand-blue underline underline-offset-4">DeliR · {t.demo}</a><dl className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{comparisonProducts.map(p => <div key={p.id}><dt className="text-xs font-semibold text-slate-800">{p.name} · {t[row.cells[p.id].status]}</dt><dd className="mt-1 text-xs leading-6">{row.cells[p.id].sources.map((id, index) => { const source = comparisonSources[id]; return <span key={id}>{index > 0 ? ' · ' : ''}<a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">{source.label}<span className="sr-only">{t.newTab}</span></a></span>; })}</dd></div>)}</dl></div>)}</div>
          </> : null}
        </details>
      </div>
    </section>
  );
}
