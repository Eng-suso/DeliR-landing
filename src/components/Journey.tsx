import { journeyCopy as copy } from '../content/landingCopy';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productClips } from '../lib/productClips';
import { useFragment } from '../lib/useFragment';
import ClipExplorer from './ClipExplorer';
import { interestCtaLabel, productInterestHref } from '../lib/publicOffer';

// Keep scene deep links and give each recording one home in the story.
const benefits = [
  { id: 'product-03', initial: 'evidenze-sul-processo', clips: [productClips.evidence, productClips.sources, productClips.review, productClips.corrected, productClips.owner] },
  { id: 'product-02', initial: 'lacuna-aperta', clips: [productClips.gap, productClips.chat, productClips.hidden] },
  { id: 'product-01', initial: 'memoria', clips: [productClips.memory] },
  { id: 'product-04', initial: 'review-to-be', clips: [productClips.reviewToBe, productClips.hypothesis] },
  { id: 'product-05', initial: 'confronto', clips: [productClips.comparison, productClips.simulationAsIs, productClips.simulationToBe, productClips.heatmap, productClips.eventLog] },
];



export default function Journey() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];
  const activeIndex = Math.max(0, benefits.findIndex(benefit => fragment === benefit.id || benefit.clips.some(clip => fragment === `scene-${clip.id}`)));

  return (
    <section id="caso" className="premium-journey scroll-mt-24 border-y border-slate-200 bg-brand-light py-14 sm:py-20" aria-labelledby="journey-title">
      <div className="section-shell">
        <div data-reveal className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="journey-title" className="landing-title mt-4 max-w-[24ch]">{t.title}</h2></div>
          <div><p className="max-w-xl text-base leading-7 text-slate-600">{t.intro}</p><p className="mt-4 text-xs leading-5 text-slate-600">{t.demo}</p></div>
        </div>
        <nav aria-label={t.nav} className="mt-8">
          <ol className="grid gap-2 min-[400px]:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit, index) => {
              const selected = index === activeIndex;
              return <li key={benefit.id}><a href={`#${benefit.id}`} aria-current={selected ? 'location' : undefined} className={`product-index-link h-full ${selected ? '!border-brand-blue !bg-brand-blue !text-white' : ''}`}><span aria-hidden="true" className="font-mono text-xs">0{index + 1}</span><span>{t.modules[index].name}</span></a></li>;
            })}
          </ol>
        </nav>
        <div className="mt-6 sm:mt-8">
          {benefits.map((benefit, index) => {
            const module = t.modules[index];
            return <article hidden={index !== activeIndex} id={benefit.id} aria-labelledby={`${benefit.id}-title`} data-product-module={module.name} data-product-benefit={index < 4 ? 'true' : undefined} key={benefit.id} className={`scroll-mt-24 `}>
              <div className="grid gap-7 lg:grid-cols-[0.37fr_0.63fr] lg:items-start lg:gap-9">
                <div data-reveal className="journey-description min-w-0 lg:pt-6">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">0{index + 1} / {module.name}</span>
                  <h3 id={`${benefit.id}-title`} className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
                  <div className="mt-6 border-l-2 border-brand-blue pl-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{t.result}</p><p className="mt-2 text-sm leading-6 text-slate-700">{module.output}</p></div>
                </div>
                {index === activeIndex ? <ClipExplorer clips={benefit.clips} name={module.name} initial={benefit.initial} /> : null}
              </div>
            </article>;
          })}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between"><p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{t.principle}</p><a href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
      </div>
    </section>
  );
}
