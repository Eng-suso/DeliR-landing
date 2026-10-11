import { useRef, useState } from 'react';
import { useFragment } from '../lib/useFragment';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Minus, Plus, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { comparisonProducts, comparisonRows, comparisonSources } from '../lib/comparisonContent';

const copy = {
  it: {
    eyebrow: 'Il confronto, a colpo d’occhio',
    title: 'Dall’AS-IS alla proposta. In un unico percorso.',
    intro: 'Sei capacità nel lavoro del consulente: dalle informazioni del cliente al processo migliorato.',
    feature: 'Capacità nel lavoro del consulente', delir: 'Per il consulente',
    caption: 'Confronto delle capacità per l’analisi di processo',
    demo: 'Demo',
    demoLabel: 'Mostrato nella demo DeliR. Guarda il video',
    cellSources: 'Consulta il criterio e la documentazione di riferimento',
    yes: 'Sì', partial: 'Parziale', no: 'No',
    legend: '✓ Sì: copre il percorso descritto · − Parziale: copre una parte del percorso · ✗ No: fuori dal percorso confrontato.',
    proof: 'Valutazione DeliR del percorso consulenziale; non è un test comparativo negli account dei competitor.',
    scroll: 'Scorri per confrontare le alternative. DeliR resta visibile.',
    left: 'Scorri verso le prime alternative', right: 'Scorri verso le ultime alternative',
    reason: 'Porta al cliente il modello e le prove dietro la proposta.',
    reasonBody: 'Con DeliR puoi discutere il processo insieme alle fonti, ai punti aperti e al confronto AS-IS / TO-BE. Questo è il percorso mostrato nella demo.',
    primary: 'Scopri il pilot', secondary: 'Guarda il percorso completo',
    sources: 'Criteri e documentazione dei prodotti',
    method: 'La matrice riporta i giudizi forniti dal team DeliR sul workflow consulenziale descritto in ogni riga. I video illustrano il percorso DeliR; i link ufficiali forniscono il contesto dei prodotti, senza costituire una verifica indipendente di ogni giudizio. ChatGPT/Claude: utilizzo standard di chat, progetti e artifact. Camunda: Web Modeler e validazione esecutiva. Codice su misura, estensioni e integrazioni sono fuori ambito. Un No riguarda questo percorso, non ogni configurazione possibile. Piani e disponibilità possono variare.',
    newTab: ' (si apre in una nuova scheda)',
  },
  en: {
    eyebrow: 'The comparison at a glance',
    title: 'From AS-IS to proposal. In one workflow.',
    intro: 'Six capabilities in a consultant’s work: from client information to an improved process.',
    feature: 'Capabilities in a consultant’s work', delir: 'For consultants',
    caption: 'Process analysis capability comparison',
    demo: 'Demo',
    demoLabel: 'Shown in the DeliR demo. Watch the video',
    cellSources: 'Read the criterion and reference documentation',
    yes: 'Yes', partial: 'Partial', no: 'No',
    legend: '✓ Yes: covers the described workflow · − Partial: covers part of the workflow · ✗ No: outside the compared workflow.',
    proof: 'DeliR’s assessment of the consulting workflow; not a comparative test in competitor accounts.',
    scroll: 'Scroll to compare alternatives. DeliR stays in view.',
    left: 'Scroll toward the first alternatives', right: 'Scroll toward the last alternatives',
    reason: 'Bring the model and the evidence behind your proposal to the client.',
    reasonBody: 'With DeliR, discuss the process alongside its sources, open questions and AS-IS / TO-BE comparison. This is the workflow shown in the demo.',
    primary: 'Explore the pilot', secondary: 'Watch the complete workflow',
    sources: 'Criteria and product documentation',
    method: 'This matrix reports ratings supplied by the DeliR team for the consulting workflow defined in each row. Videos illustrate the DeliR workflow; official links provide product context rather than independent verification of every rating. ChatGPT/Claude: standard chat, projects and artifacts. Camunda: Web Modeler and execution validation. Custom code, extensions and integrations are outside scope. No concerns this workflow, not every possible configuration. Plans and availability may vary.',
    newTab: ' (opens in a new tab)',
  },
} as const;

export default function Comparison() {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
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
  function scroll(direction: number) {
    scrollRef.current?.scrollBy({ left: direction * 260, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return (
    <section id="confronto" className="premium-comparison scroll-mt-16 border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="comparison-title">
      <div className="section-shell">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="comparison-title" className="landing-title mt-5 max-w-[27ch]">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{t.intro}</p>

        <div className="mt-8 flex items-center justify-between gap-3 xl:hidden">
          <p className="max-w-[28ch] text-xs leading-5 text-slate-600">{t.scroll}</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label={t.left} className="flex size-11 items-center justify-center rounded-full border border-slate-300 text-brand-blue hover:bg-brand-mist"><ArrowLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={() => scroll(1)} aria-label={t.right} className="flex size-11 items-center justify-center rounded-full border border-slate-300 text-brand-blue hover:bg-brand-mist"><ArrowRight aria-hidden="true" className="size-4" /></button>
          </div>
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- A focusable scroll region lets keyboard users inspect the entire table. */}
        <div data-lenis-prevent ref={scrollRef} role="region" aria-label={t.caption} tabIndex={0} className="comparison-table isolate mt-5 overflow-x-auto rounded-2xl border border-slate-200 xl:mt-10">
          <table className="w-full min-w-[1140px] table-fixed border-separate border-spacing-0 text-sm">
            <caption className="sr-only">{t.caption}. {t.proof}</caption>
            <colgroup><col className="w-[160px] sm:w-[336px]" /><col className="w-[88px] sm:w-[104px]" />{comparisonProducts.map(p => <col key={p.id} />)}</colgroup>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-20 border-b border-slate-200 bg-brand-light px-3 py-6 text-left font-medium text-slate-600 sm:px-5">{t.feature}</th>
                <th scope="col" className="sticky left-[160px] z-20 border-b border-white/15 bg-brand-navy px-2 py-5 text-center text-white sm:left-[336px] sm:px-3"><span className="block font-display text-xl font-bold" translate="no">DeliR</span></th>
                {comparisonProducts.map(p => <th key={p.id} scope="col" className="border-b border-slate-200 bg-brand-light px-2 py-5 text-center font-semibold text-slate-800"><span className="block" translate="no">{p.name}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(row => <tr key={row.id}>
                <th scope="row" className="sticky left-0 z-10 border-b border-slate-200 bg-white px-3 py-4 text-left text-[13px] font-semibold leading-5 text-brand-ink sm:px-5 sm:py-5 sm:text-sm">{row.label[language]}</th>
                <td className="sticky left-[160px] z-10 border-b border-white/15 bg-brand-navy px-2 text-center sm:left-[336px]">
                  <a href={row.evidence} aria-label={`DeliR · ${row.label[language]} · ${t.yes} · ${t.demoLabel}`} className="inline-flex min-h-11 flex-col items-center justify-center gap-2 rounded-lg px-1 py-3 text-sm font-bold leading-5 text-white transition-colors hover:bg-white/10"><Check aria-hidden="true" className="size-4 text-blue-200" /><span>{t.yes}</span></a>
                </td>
                {comparisonProducts.map(p => {
                  const status = row.cells[p.id].status;
                  const Icon = status === 'yes' ? Check : status === 'partial' ? Minus : X;
                  const value = t[status];
                  return <td key={p.id} className="border-b border-slate-200 bg-white px-2 py-4 text-center"><a href={`#comparison-evidence-${row.id}`} onClick={() => showEvidence(row.id)} aria-label={`${p.name} · ${row.label[language]} · ${value} · ${t.cellSources}`} className={`inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-2 text-sm leading-5 transition-colors hover:bg-brand-mist ${status === 'yes' ? 'font-semibold text-brand-blue' : 'text-slate-600'}`}><Icon aria-hidden="true" className="size-5" /><span>{value}</span></a></td>;
                })}
              </tr>)}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-600">{t.legend}</p>
        <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-600">{t.proof}</p>

        <div className="comparison-next mt-8 flex flex-col gap-6 rounded-2xl bg-brand-mist p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl"><h3 className="font-display text-xl font-semibold text-brand-ink">{t.reason}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t.reasonBody}</p></div>
          <div className="flex shrink-0 flex-col items-start gap-4"><a href="#pilot" className="btn-primary whitespace-normal">{t.primary}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a><a href="#product-01" className="btn-text">{t.secondary}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
        </div>

        <details ref={sourcesRef} open={showSources} onToggle={event => {
          const open = event.currentTarget.open;
          setSourcesOpen(open);
          if (!open) setDismissedFragment(fragment);
        }} className="group mt-5 border-t border-slate-200">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-xs font-medium text-slate-600 hover:text-brand-blue [&::-webkit-details-marker]:hidden">{t.sources}<Plus aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-45" /></summary>
          {showSources ? <>
          <p className="max-w-4xl text-xs leading-6 text-slate-600">{t.method}</p>
          <div className="my-5 space-y-6">{comparisonRows.map(row => <div id={`comparison-evidence-${row.id}`} key={row.id} tabIndex={-1} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">{row.label[language]}</h3><p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">{row.definition[language]}</p><a href={row.evidence} className="mt-1 inline-flex min-h-11 items-center text-xs font-medium text-brand-blue underline underline-offset-4">DeliR · {t.demo}</a><dl className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{comparisonProducts.map(p => <div key={p.id}><dt className="text-xs font-semibold text-slate-800">{p.name} · {t[row.cells[p.id].status]}</dt><dd className="mt-1 text-xs leading-6">{row.cells[p.id].sources.map((id, index) => { const source = comparisonSources[id]; return <span key={id}>{index > 0 ? ' · ' : ''}<a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">{source.label}<span className="sr-only">{t.newTab}</span></a></span>; })}</dd></div>)}</dl></div>)}</div>
          </> : null}
        </details>
      </div>
    </section>
  );
}
