import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { journeyCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { hybridBenefits, hybridExtraBenefits } from '../../content/hybridMedia';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';
import ClipExplorer from '../ClipExplorer';

export default function HybridJourney() {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  const [chapter, setChapter] = useState(hybridBenefits[0].id);
  useEffect(() => {
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      // Percentage root margins resolve against width, including vertical ones.
      // Use viewport-height pixels so the reading band also works on wide screens.
      observer = new IntersectionObserver(entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) setChapter(visible.target.id);
      }, { rootMargin: `-${Math.round(window.innerHeight * .2)}px 0px -${Math.round(window.innerHeight * .5)}px 0px` });
      hybridBenefits.forEach(benefit => {
        const target = document.getElementById(benefit.id);
        if (target) observer.observe(target);
      });
    };
    observe();
    window.addEventListener('resize', observe);
    return () => { observer.disconnect(); window.removeEventListener('resize', observe); };
  }, []);
  function benefitContent(benefit: typeof hybridBenefits[number], index?: number) {
    const module = t.modules[benefit.module];
    return <>
      <ClipExplorer clips={benefit.clips} name={module.name} initial={benefit.initial} autoPlay={false} />
      <div className="hybrid-benefit-copy min-w-0">
        <p className="landing-eyebrow">{index !== undefined ? <span aria-hidden="true" className="hybrid-benefit-number">0{index + 1}</span> : null}{module.name}</p>
        <h3 id={`${benefit.id}-title`} className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
        <p className="hybrid-deliverable"><span>{t.result}</span><strong>{module.output}</strong></p>
      </div>
    </>;
  }
  return <section id="caso" className="premium-journey hybrid-journey scroll-mt-24 py-14 sm:py-20" aria-labelledby="journey-title">
    <div className="section-shell">
      <div className="hybrid-journey-heading max-w-3xl">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="journey-title" className="landing-title mt-4">{t.title}</h2>
        <p className="mt-5 text-base leading-7 text-slate-600">{t.intro}</p>
        <p className="hybrid-case-note">{t.demo}</p>
      </div>
      <nav className="hybrid-chapter-nav" aria-label={language === 'it' ? 'Capitoli del prodotto' : 'Product chapters'}>
        <span aria-hidden="true">{language === 'it' ? 'Dentro DeliR' : 'Inside DeliR'}</span>
        <ol>{hybridBenefits.map((benefit, index) => <li key={benefit.id}><a href={`#${benefit.id}`} aria-current={chapter === benefit.id ? 'location' : undefined}><span aria-hidden="true">0{index + 1}</span>{t.modules[benefit.module].name}</a></li>)}</ol>
      </nav>
      <div className="hybrid-benefit-list">
        {hybridBenefits.map((benefit, index) => <article key={benefit.id} id={benefit.id} data-product-module={t.modules[benefit.module].name} data-product-benefit="true" aria-labelledby={`${benefit.id}-title`} className="hybrid-benefit scroll-mt-24">
          {benefitContent(benefit, index)}
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
