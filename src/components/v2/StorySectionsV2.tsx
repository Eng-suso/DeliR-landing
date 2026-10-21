import { ArrowRight, Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { comparisonCopy, journeyCopy, pilotCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { comparisonProducts, comparisonRows, type ComparisonRow } from '../../lib/comparisonContent';
import { productClips } from '../../lib/productClips';
import { pilotApplicationHref, pilotCtaLabel, pilotRiskReversals } from '../../lib/publicOffer';
import ActionV2 from './ActionV2';
import DemoStillV2 from './DemoStillV2';
import VideoSlotV2 from './VideoSlotV2';

export function ContextStripV2({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const steps = language === 'it' ? ['Documenti e interviste', 'Evidenze', 'As-Is', 'To-Be', 'Miglioramento continuo'] : ['Documents and interviews', 'Evidence', 'As-Is', 'To-Be', 'Continuous improvement'];
  return <div className="v2-context-strip"><div className="section-shell">
    {compact ? <p className="text-center text-sm font-semibold leading-6">{journeyCopy[language].demo}</p>
      : <ol className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">{steps.map((step, index) => <li key={step} className="inline-flex items-center gap-5"><span>{step}</span>{index < steps.length - 1 ? <ArrowRight aria-hidden="true" className="hidden size-3 text-brand-blue sm:block" /> : null}</li>)}</ol>}
  </div></div>;
}

export function ProofV2({ variant, studio }: { variant: 'as-is' | 'decision'; studio: boolean }) {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  const module = t.modules[variant === 'as-is' ? 0 : 3];
  return <section id={variant === 'as-is' ? 'caso' : 'decisioni'} aria-labelledby={`proof-${variant}-title`} className={`v2-section v2-proof v2-proof-${variant}`}>
    <div className="section-shell">
      <div className="v2-proof-heading"><p className="landing-eyebrow">{t.demo}</p><h2 id={`proof-${variant}-title`} className="v2-title mt-4">{module.output}</h2></div>
      <VideoSlotV2 id={variant === 'as-is' ? 'proof-as-is' : 'proof-decision'} studio={studio} />
      {variant === 'as-is' ? <div className="v2-proof-mobile-details">
        <DemoStillV2 clip={productClips.evidence} />
        <DemoStillV2 clip={productClips.gaps} />
      </div> : null}
      <div className="v2-section-action"><ActionV2 /></div>
    </div>
  </section>;
}

const benefitSlots = ['benefit-evidence', 'benefit-gaps', 'benefit-scenarios'];
const moduleIndexes = [0, 1, 4];
export function BenefitsV2({ studio }: { studio: boolean }) {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  return <section id="benefici" aria-labelledby="benefits-v2-title" className="v2-benefits">
    <h2 id="benefits-v2-title" className="sr-only">{t.title}</h2>
    {moduleIndexes.map((index, position) => {
      const module = t.modules[index];
      return <article key={module.name} aria-labelledby={`benefit-v2-${position}-title`} className={`v2-section v2-benefit ${position % 2 === 1 ? 'v2-benefit-reverse' : ''}`}>
        <div className="section-shell v2-split">
          <VideoSlotV2 id={benefitSlots[position]} studio={studio} />
          <div className="v2-benefit-copy min-w-0">
            <p className="landing-eyebrow">0{position + 1} / {module.name}</p>
            <h3 id={`benefit-v2-${position}-title`} className="v2-title mt-4">{module.title}</h3>
            <p className="v2-body mt-5">{module.body}</p>
            <p className="mt-5 text-sm font-semibold leading-6 text-brand-ink">{module.output}</p>
            <ActionV2 className="mt-7" />
          </div>
        </div>
      </article>;
    })}
  </section>;
}

export function ComparisonV2() {
  const { language } = useLanguage();
  const t = comparisonCopy[language];
  const sources = `/comparison-sources${language === 'en' ? '?lang=en' : ''}`;
  function rating(row: ComparisonRow, product?: typeof comparisonProducts[number]) {
    const status = product ? row.cells[product.id].status : 'yes';
    const label = `${product?.name ?? 'DeliR'} · ${row.label[language]} · ${t[status]}`;
    const content = <>{status === 'yes' ? <Check aria-hidden="true" className="size-5" /> : status === 'partial' ? <span aria-hidden="true" className="text-xl">~</span> : <Minus aria-hidden="true" className="size-5" />}<span className="sr-only">{t[status]}</span></>;
    return product ? <Link className="v2-status-link" data-status={status} aria-label={`${label} · ${t.cellSources}`} to={`${sources}#comparison-evidence-${row.id}`}>{content}</Link>
      : <Link className="v2-status-link" data-status={status} aria-label={`${label} · ${t.demoLabel}`} to={`/${language === 'en' ? '?lang=en' : ''}${row.evidence}`}>{content}</Link>;
  }
  return <section id="confronto" aria-labelledby="comparison-v2-title" className="v2-section v2-comparison">
    <div className="section-shell">
      <div className="v2-comparison-heading"><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="comparison-v2-title" className="v2-title mt-4">{t.tableTitle}</h2></div>
      <div className="v2-comparison-desktop-action"><ActionV2 /></div>
      <table className="v2-comparison-table">
        <caption className="sr-only">{t.caption}. {t.proof}</caption>
        <thead><tr><th scope="col" className="text-left">{t.feature}</th><th scope="col">DeliR</th>{comparisonProducts.map(product => <th key={product.id} scope="col">{product.name}</th>)}</tr></thead>
        <tbody>{comparisonRows.map(row => <tr key={row.id}><th scope="row" className="text-left font-medium">{row.label[language]}</th><td>{rating(row)}</td>{comparisonProducts.map(product => <td key={product.id}>{rating(row, product)}</td>)}</tr>)}</tbody>
      </table>
      <div className="v2-comparison-cards">{comparisonRows.slice(0, 6).map(row => <article key={row.id} className="v2-differentiator" data-v2-differentiator={row.id}>
        <h3 className="font-display text-xl font-semibold leading-7">{row.label[language]}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{row.definition[language]}</p>
        <Link to={`${sources}#comparison-evidence-${row.id}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.sources}</Link>
      </article>)}</div>
      <div className="v2-comparison-mobile-action"><ActionV2 /></div>
      <div className="v2-comparison-notes">
        <p className="text-xs leading-6 text-slate-600">{t.legend}</p>
        <p className="mt-2 text-xs leading-6 text-slate-600">{t.proof}</p>
        <Link to={sources} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.sources}</Link>
      </div>
    </div>
  </section>;
}

export function HowItWorksV2() {
  const { language } = useLanguage();
  const t = pilotCopy[language];
  return <section id="incarico" aria-labelledby="how-v2-title" className="v2-section v2-how">
    <div className="section-shell">
      <div className="v2-how-heading"><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="how-v2-title" className="v2-title mt-4">{t.title}</h2></div>
      <ol className="v2-step-grid">{t.steps.map(([title, body], index) => <li key={title} className="v2-step">
        <span className="font-mono text-sm text-brand-blue">0{index + 1}</span>
        <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{body}</p>
      </li>)}</ol>
      <div id="pilot" className="v2-section-action">
        <a href={pilotApplicationHref(language)} className="btn-primary v2-action">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
        <p className="mt-4 text-sm leading-6 text-slate-600">{t.firstContact}</p>
        <details className="v2-pilot-terms">
          <summary>{t.control}</summary>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t.kickoff}</p>
          <ul className="mt-4 space-y-3">{pilotRiskReversals[language].map(term => <li key={term} className="flex items-start gap-2 text-sm leading-6"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-blue" />{term}</li>)}</ul>
        </details>
      </div>
    </div>
  </section>;
}
