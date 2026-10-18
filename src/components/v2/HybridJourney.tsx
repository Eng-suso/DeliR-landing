import { ArrowRight } from 'lucide-react';
import { journeyCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { hybridBenefits, hybridExtraBenefits } from '../../content/hybridMedia';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';
import ClipExplorer from '../ClipExplorer';

export default function HybridJourney() {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  function benefitContent(benefit: typeof hybridBenefits[number]) {
    const module = t.modules[benefit.module];
    return <>
      <ClipExplorer clips={benefit.clips} name={module.name} initial={benefit.initial} autoPlay={false} />
      <div className="hybrid-benefit-copy min-w-0">
        <p className="landing-eyebrow">{module.name}</p>
        <h3 id={`${benefit.id}-title`} className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
        <p className="mt-5 border-l-2 border-brand-blue pl-4 text-sm font-semibold leading-6 text-brand-ink">{module.output}</p>
      </div>
    </>;
  }
  return <section id="caso" className="premium-journey hybrid-journey scroll-mt-24 py-14 sm:py-20" aria-labelledby="journey-title">
    <div className="section-shell">
      <div className="max-w-3xl">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="journey-title" className="landing-title mt-4">{t.title}</h2>
        <p className="mt-5 text-base leading-7 text-slate-600">{t.intro}</p>
        <p className="mt-3 text-xs leading-6 text-slate-600">{t.demo}</p>
      </div>
      <div className="hybrid-benefit-list">
        {hybridBenefits.map(benefit => <article key={benefit.id} id={benefit.id} data-product-module={t.modules[benefit.module].name} data-product-benefit="true" aria-labelledby={`${benefit.id}-title`} className="hybrid-benefit scroll-mt-24">
          {benefitContent(benefit)}
        </article>)}
      </div>
      <details className="hybrid-more">
        <summary>{language === 'it' ? 'Approfondisci contesto e decisioni' : 'Explore context and decisions'}</summary>
        <div className="hybrid-extra-grid">{hybridExtraBenefits.map(benefit => <article key={benefit.id} id={benefit.id} data-product-module={t.modules[benefit.module].name} aria-labelledby={`${benefit.id}-title`} className="hybrid-extra-benefit scroll-mt-24">
          {benefitContent(benefit)}
        </article>)}</div>
      </details>
      <div className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{t.principle}</p>
        <a data-interest-section="caso" href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
    </div>
  </section>;
}
