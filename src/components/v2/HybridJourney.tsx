import { ArrowRight, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { journeyCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { hybridBenefits, hybridExtraBenefits } from '../../content/hybridMedia';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';
import ClipExplorer from '../ClipExplorer';

export default function HybridJourney() {
  const { language } = useLanguage();
  const t = journeyCopy[language];
  const [chapter, setChapter] = useState(hybridBenefits[0].id);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const articles = hybridBenefits.map(benefit => document.getElementById(benefit.id)).filter((element): element is HTMLElement => Boolean(element));
    let frame = 0;
    let current = hybridBenefits[0].id;
    const update = () => {
      frame = 0;
      const line = (navigation.current?.getBoundingClientRect().bottom ?? 0) + 40;
      // Read every chapter together, in document order. Intersection callbacks
      // alone can choose a departing chapter during long anchor transitions.
      const positions = articles.map(element => ({ id: element.id, top: element.getBoundingClientRect().top }));
      const next = positions.filter(item => item.top <= line).at(-1)?.id ?? hybridBenefits[0].id;
      if (next !== current) { current = next; setChapter(next); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    const section = navigation.current?.closest('section');
    if (section) resize.observe(section);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  function benefitContent(benefit: typeof hybridBenefits[number], index?: number) {
    const module = t.modules[benefit.module];
    return <>
      <div className="hybrid-benefit-copy min-w-0">
        <p className="landing-eyebrow">{index !== undefined ? <span aria-hidden="true" className="hybrid-benefit-number">0{index + 1}</span> : null}{module.name}</p>
        <h3 id={`${benefit.id}-title`} className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
        <p className="hybrid-deliverable">{module.output}</p>
      </div>
      <ClipExplorer clips={benefit.clips} name={module.name} initial={benefit.initial} continuous editorial />
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
      <nav ref={navigation} className="hybrid-chapter-nav" aria-label={language === 'it' ? 'Capitoli del prodotto' : 'Product chapters'}>
        <span aria-hidden="true">{language === 'it' ? 'Dentro DeliR' : 'Inside DeliR'}</span>
        <ol>{hybridBenefits.map((benefit, index) => <li key={benefit.id}><a href={`#${benefit.id}`} aria-current={chapter === benefit.id ? 'location' : undefined}><span aria-hidden="true">0{index + 1}</span>{t.modules[benefit.module].name}</a></li>)}</ol>
      </nav>
      <div className="hybrid-benefit-list">
        {hybridBenefits.map((benefit, index) => <article key={benefit.id} id={benefit.id} data-product-module={t.modules[benefit.module].name} data-product-benefit="true" aria-labelledby={`${benefit.id}-title`} className="hybrid-benefit scroll-mt-24">
          {benefitContent(benefit, index)}
        </article>)}
      </div>
      <details className="hybrid-more">
        <summary><span>{language === 'it' ? 'Approfondisci contesto e decisioni' : 'Explore context and decisions'}</span><Plus aria-hidden="true" className="hybrid-disclosure-icon size-5" /></summary>
        <div className="hybrid-extra-grid">{hybridExtraBenefits.map(benefit => <article key={benefit.id} id={benefit.id} data-product-module={t.modules[benefit.module].name} aria-labelledby={`${benefit.id}-title`} className="hybrid-extra-benefit scroll-mt-24">
          {benefitContent(benefit)}
        </article>)}</div>
      </details>
      <div data-reveal className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{t.principle}</p>
        <a data-interest-section="caso" href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
    </div>
  </section>;
}
