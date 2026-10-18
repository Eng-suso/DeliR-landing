import { ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { comparisonCopy, journeyCopy, pilotCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { comparisonProducts, comparisonRows, type ComparisonRow } from '../../lib/comparisonContent';
import { interestCtaLabel, pilotApplicationHref, pilotCtaLabel, pilotRiskReversals, productInterestHref } from '../../lib/publicOffer';
import VideoSlotV2 from './VideoSlotV2';

export function ContextStripV2() {
  const { language } = useLanguage();
  const steps = language === 'it' ? ['Documenti e interviste', 'Evidenze', 'As-Is', 'To-Be', 'Miglioramento continuo'] : ['Documents and interviews', 'Evidence', 'As-Is', 'To-Be', 'Continuous improvement'];
  return <div className="border-b border-slate-200 bg-brand-light py-6"><div className="section-shell"><ol className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-semibold text-slate-600">{steps.map((step, index) => <li key={step} className="inline-flex items-center gap-5"><span>{step}</span>{index < steps.length - 1 ? <ArrowRight aria-hidden="true" className="hidden size-3 text-brand-blue sm:block" /> : null}</li>)}</ol></div></div>;
}

export function ProofV2({ variant, studio }: { variant: 'as-is' | 'decision'; studio: boolean }) {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  const module = t.modules[variant === 'as-is' ? 0 : 3];
  return <section id={variant === 'as-is' ? 'caso' : 'decisioni'} aria-labelledby={`proof-${variant}-title`} className="v2-section v2-proof">
    <div className="section-shell">
      <div className="mx-auto mb-8 max-w-3xl text-center"><p className="landing-eyebrow">{t.demo}</p><h2 id={`proof-${variant}-title`} className="v2-title mt-5">{module.output}</h2><p className="v2-body mx-auto mt-4">{module.body}</p></div>
      <VideoSlotV2 id={variant === 'as-is' ? 'proof-as-is' : 'proof-decision'} studio={studio} />
    </div>
  </section>;
}

const benefitSlots = ['benefit-evidence', 'benefit-gaps', 'benefit-scenarios'];
const moduleIndexes = [0, 1, 4];
export function BenefitsV2({ studio }: { studio: boolean }) {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  return <section id="benefici" aria-labelledby="benefits-v2-title" className="v2-section">
    <div className="section-shell">
      <p className="landing-eyebrow">{t.eyebrow}</p><h2 id="benefits-v2-title" className="v2-title mt-5 max-w-3xl">{t.title}</h2>
      <div className="mt-12 space-y-14 lg:space-y-24">{moduleIndexes.map((index, position) => {
        const module = t.modules[index];
        return <article key={module.name} aria-labelledby={`benefit-v2-${position}-title`} className={`v2-split ${position % 2 === 0 ? 'v2-benefit-reverse' : ''}`}>
          <div className="v2-benefit-copy min-w-0"><p className="font-mono text-xs font-semibold text-brand-blue">0{position + 1} / {module.name}</p><h3 id={`benefit-v2-${position}-title`} className="v2-title mt-4">{module.title}</h3><p className="v2-body mt-5">{module.body}</p><p className="mt-5 border-l-2 border-brand-blue pl-4 text-sm font-semibold leading-6 text-brand-ink">{module.output}</p></div>
          <VideoSlotV2 id={benefitSlots[position]} studio={studio} />
        </article>;
      })}</div>
      <div className="mt-12 text-center"><a href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
    </div>
  </section>;
}

export function ComparisonV2() {
  const { language } = useLanguage();
  const t = comparisonCopy[language];
  const sources = `/comparison-sources${language === 'en' ? '?lang=en' : ''}`;
  function rating(row: ComparisonRow, product?: typeof comparisonProducts[number]) {
    const status = product ? row.cells[product.id].status : 'yes';
    const label = `${product?.name ?? 'DeliR'} · ${row.label[language]} · ${t[status]}`;
    const Icon = status === 'yes' ? Check : X;
    const content = <><Icon aria-hidden="true" className="size-5" /><span className="sr-only">{t[status]}</span></>;
    return product ? <Link className="v2-status-link" data-status={status} aria-label={`${label} · ${t.cellSources}`} to={`${sources}#comparison-evidence-${row.id}`}>{content}</Link>
      : <Link className="v2-status-link" data-status={status} aria-label={`${label} · ${t.demoLabel}`} to={`/${language === 'en' ? '?lang=en' : ''}${row.evidence}`}>{content}</Link>;
  }
  return <section id="confronto" aria-labelledby="comparison-v2-title" className="v2-section border-y border-slate-200 bg-brand-light">
    <div className="section-shell"><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="comparison-v2-title" className="v2-title mt-5 max-w-3xl">{t.tableTitle}</h2><p className="v2-body mt-5">{t.intro}</p>
      <table className="v2-comparison-table mt-9"><caption className="sr-only">{t.caption}. {t.proof}</caption><thead><tr><th scope="col" className="text-left">{t.feature}</th><th scope="col">DeliR</th>{comparisonProducts.map(product => <th key={product.id} scope="col">{product.name}</th>)}</tr></thead><tbody>{comparisonRows.map(row => <tr key={row.id}><th scope="row" className="text-left font-medium">{row.label[language]}</th><td>{rating(row)}</td>{comparisonProducts.map(product => <td key={product.id}>{rating(row, product)}</td>)}</tr>)}</tbody></table>
      <div className="v2-comparison-cards mt-9">{comparisonRows.map(row => <article key={row.id} className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="font-display text-lg font-semibold leading-6">{row.label[language]}</h3><dl className="mt-4 divide-y divide-slate-100"><div className="flex items-center justify-between gap-3 rounded-lg bg-brand-mist px-3"><dt className="font-semibold">DeliR</dt><dd>{rating(row)}</dd></div>{comparisonProducts.map(product => <div key={product.id} className="flex items-center justify-between gap-3 px-3"><dt className="text-sm">{product.name}</dt><dd>{rating(row, product)}</dd></div>)}</dl></article>)}</div>
      <p className="mt-5 text-xs leading-6 text-slate-600">{t.legend}</p><p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">{t.proof}</p><Link to={sources} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.sources}</Link>
    </div>
  </section>;
}

export function HowItWorksV2() {
  const { language } = useLanguage();
  const t = pilotCopy[language];
  return <section id="incarico" aria-labelledby="how-v2-title" className="v2-section"><div className="section-shell"><div className="mx-auto max-w-3xl text-center"><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="how-v2-title" className="v2-title mt-5">{t.title}</h2><p className="v2-body mx-auto mt-5">{t.kickoff}</p></div>
    <ol className="v2-step-grid mt-10">{t.steps.map(([title, body], index) => <li key={title} className="rounded-xl border border-slate-200 bg-brand-light p-6"><span className="font-mono text-sm text-brand-blue">0{index + 1}</span><h3 className="mt-5 font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{body}</p></li>)}</ol>
    <div id="pilot" className="mt-8 rounded-xl border border-slate-200 p-6"><ul className="grid gap-3 lg:grid-cols-3">{pilotRiskReversals[language].map(term => <li key={term} className="flex items-start gap-2 text-sm leading-6"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-blue" />{term}</li>)}</ul><div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><p className="text-sm leading-6 text-slate-600">{t.firstContact}</p><a href={pilotApplicationHref(language)} className="btn-primary whitespace-normal">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a></div></div>
  </div></section>;
}
