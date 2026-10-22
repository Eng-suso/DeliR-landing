import { ArrowRight } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { journeyCopy } from '../../content/landingCopy';
import { formatSeconds, legacyFragments, narrativeVideos, solveVideos, type ProductVideo, type ProductVideoId } from '../../content/productVideos';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFragment } from '../../lib/useFragment';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';
import { ProductVideoDescription, ProductVideoPlayer } from '../ProductVideoPlayer';

const copy = {
  it: {
    intro: 'Video brevi e senza audio, sul caso dimostrativo. Ogni video è autonomo: parti dal passaggio che ti interessa.',
    problem: 'Problema', agitate: 'Conseguenze', solve: 'Con DeliR',
    solveTitle: 'Quattro passaggi, dall’intervista alla consegna.',
    solveSummary: 'Scegli il passaggio che ti interessa: ogni video mostra il prodotto per intero.',
    chapters: 'Passaggi del prodotto',
  },
  en: {
    intro: 'Short silent videos of the demo case. Each one stands on its own: start from the step you care about.',
    problem: 'Problem', agitate: 'Agitate', solve: 'With DeliR',
    solveTitle: 'Four steps, from interview to handover.',
    solveSummary: 'Pick the step you care about: each video shows the whole product.',
    chapters: 'Product steps',
  },
} as const;

/** One of the three sections: number and copy beside a single video. */
function NarrativeSection({ video, number, label }: { video: ProductVideo; number: string; label: string }) {
  const { language } = useLanguage();
  return <article id={video.id} className="pv-section scroll-mt-24" aria-labelledby={`${video.id}-title`}>
    <div className="pv-section-copy">
      <p className="pv-step"><span aria-hidden="true">{number}</span>{label}</p>
      <h3 id={`${video.id}-title`}>{video.title[language]}</h3>
      <p className="pv-summary">{video.summary[language]}</p>
      <ProductVideoDescription video={video} />
    </div>
    <ProductVideoPlayer video={video} />
  </article>;
}

export default function ProductVideos() {
  const { language } = useLanguage();
  const t = copy[language];
  const journey = journeyCopy[language];
  const fragment = useFragment();
  const tabsId = useId();
  // A deep link (#discovery, #simulation…) opens its step until the visitor picks
  // another one; a later link wins again. Derived, so no effect is needed.
  const [picked, setPicked] = useState<{ id: ProductVideoId; fragment: string }>({ id: 'discovery', fragment: '' });
  const linked = solveVideos.find(video => video.id === fragment)?.id ?? legacyFragments[fragment];
  const active = linked && fragment !== picked.fragment ? linked : picked.id;
  const setActive = (id: ProductVideoId) => setPicked({ id, fragment });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onTabKey(event: React.KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? solveVideos.length - 1 : step ? (index + step + solveVideos.length) % solveVideos.length : -1;
    if (target < 0) return;
    event.preventDefault();
    setActive(solveVideos[target].id);
    tabs.current[target]?.focus();
  }
  const current = solveVideos.find(video => video.id === active) ?? solveVideos[0];

  return <section id="caso" className="product-videos scroll-mt-24" aria-labelledby="videos-title">
    <div className="section-shell">
      <header className="pv-heading">
        <p className="landing-eyebrow">{journey.eyebrow}</p>
        <h2 id="videos-title" className="landing-title mt-4">{journey.title}</h2>
        <p className="mt-5 text-base leading-7 text-slate-600">{t.intro}</p>
        <p className="hybrid-case-note">{journey.demo}</p>
      </header>

      <NarrativeSection video={narrativeVideos[0]} number="01" label={t.problem} />
      <NarrativeSection video={narrativeVideos[1]} number="02" label={t.agitate} />

      <article className="pv-section pv-solve" id="soluzione" aria-labelledby="solve-title">
        {/* Stable targets for #discovery, #evidence… and older shared links; the step follows the fragment. */}
        {[...solveVideos.map(video => video.id), ...Object.keys(legacyFragments)].map(id => <span key={id} id={id} className="pv-anchor scroll-mt-24" aria-hidden="true" />)}
        <div className="pv-section-copy">
          <p className="pv-step"><span aria-hidden="true">03</span>{t.solve}</p>
          <h3 id="solve-title">{t.solveTitle}</h3>
          <p className="pv-summary">{t.solveSummary}</p>
        </div>
        <div className="pv-solve-body">
          <div role="tablist" aria-label={t.chapters} className="pv-tabs">
            {solveVideos.map((video, index) => <button key={video.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab"
              id={`${tabsId}-${video.id}`} aria-controls={`${tabsId}-panel`} aria-selected={active === video.id} tabIndex={active === video.id ? 0 : -1}
              onClick={() => setActive(video.id)} onKeyDown={event => onTabKey(event, index)}>
              <span className="pv-tab-name">{video.title[language]}</span><span className="pv-tab-time">{formatSeconds(video.seconds)}</span>
            </button>)}
          </div>
          <div role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-${current.id}`} className="pv-panel">
            <ProductVideoPlayer key={current.id} video={current} />
            <p className="pv-summary">{current.summary[language]}</p>
            <ProductVideoDescription video={current} />
          </div>
        </div>
      </article>

      <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{journey.principle}</p>
        <a data-interest-section="caso" href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
    </div>
  </section>;
}
