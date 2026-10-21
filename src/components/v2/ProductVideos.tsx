import { ArrowRight, Clapperboard, Play, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { journeyCopy } from '../../content/landingCopy';
import { formatSeconds, legacyFragments, narrativeVideos, productVideoPath, solveVideos, walkthroughVideo, type ProductVideo, type ProductVideoId } from '../../content/productVideos';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFragment } from '../../lib/useFragment';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';
import { trackVideoEvent } from '../../privacy/analytics';

const copy = {
  it: {
    intro: 'Video brevi e senza audio, sul caso dimostrativo. Ogni video è autonomo: parti dal passaggio che ti interessa.',
    problem: 'Problema', agitate: 'Conseguenze', solve: 'Con DeliR',
    solveTitle: 'Quattro passaggi, dall’intervista alla consegna.',
    chapters: 'Passaggi del prodotto', play: 'Riproduci', more: 'Cosa mostra il video',
    walkthrough: 'Vuoi vedere tutto il percorso?', open: 'Guarda il percorso completo', close: 'Chiudi', unavailable: 'Video non disponibile. Leggi la descrizione qui sotto.',
  },
  en: {
    intro: 'Short silent videos of the demo case. Each one stands on its own: start from the step you care about.',
    problem: 'Problem', agitate: 'Agitate', solve: 'With DeliR',
    solveTitle: 'Four steps, from interview to handover.',
    chapters: 'Product steps', play: 'Play', more: 'What the video shows',
    walkthrough: 'Want to see the whole path?', open: 'Watch the full walkthrough', close: 'Close', unavailable: 'Video unavailable. Read the description below.',
  },
} as const;

/** Poster first; the video loads only when the visitor asks for it. */
function VideoPlayer({ video, autoStart = false }: { video: ProductVideo; autoStart?: boolean }) {
  const { language } = useLanguage();
  const t = copy[language];
  const [requested, setRequested] = useState(autoStart);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const counted = useRef(false);
  const title = video.title[language];

  function play() {
    // Mount inside the user gesture so Safari starts playback too.
    flushSync(() => setRequested(true));
    void player.current?.play().catch(() => { /* Native controls remain available. */ });
  }
  const track = (event: 'video_play' | 'video_complete') => {
    if (event === 'video_play') { if (counted.current) return; counted.current = true; }
    trackVideoEvent(event, video.id, language);
  };

  return <div className="pv-player" data-product-video={video.id}>
    {requested && !failed
      ? <video key={`${video.id}-${language}`} ref={player} controls playsInline muted autoPlay={autoStart} preload="metadata"
        poster={productVideoPath(video.id, 'jpg')} aria-label={title} width={1920} height={1080}
        onPlay={() => track('video_play')} onEnded={() => track('video_complete')} onError={() => setFailed(true)}>
        <source src={productVideoPath(video.id, 'webm')} type="video/webm" />
        <source src={productVideoPath(video.id, 'mp4')} type="video/mp4" />
        <track kind="captions" src={productVideoPath(video.id, language === 'it' ? 'it.vtt' : 'en.vtt')} srcLang={language} label={language === 'it' ? 'Italiano' : 'English'} />
      </video>
      : <>
        <img src={productVideoPath(video.id, 'jpg')} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        {failed ? null : <button type="button" className="pv-play" onClick={play} aria-label={`${t.play}: ${title} (${formatSeconds(video.seconds)})`}>
          <Play aria-hidden="true" className="size-5" /><span>{formatSeconds(video.seconds)}</span>
        </button>}
      </>}
    {failed ? <p role="status" className="pv-failed">{t.unavailable}</p> : null}
  </div>;
}

function VideoDescription({ video }: { video: ProductVideo }) {
  const { language } = useLanguage();
  return <details className="pv-description">
    <summary>{copy[language].more}</summary>
    <p>{video.description[language]}</p>
  </details>;
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
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (walkthroughOpen && !element.open) {
      if (typeof element.showModal === 'function') element.showModal(); else element.setAttribute('open', '');
    }
    if (!walkthroughOpen && element.open) {
      if (typeof element.close === 'function') element.close(); else element.removeAttribute('open');
    }
  }, [walkthroughOpen]);

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

      <div className="pv-narrative">
        {narrativeVideos.map((video, index) => <article key={video.id} id={video.id} className="pv-card scroll-mt-24" aria-labelledby={`${video.id}-title`}>
          <p className="pv-step"><span aria-hidden="true">0{index + 1}</span>{index === 0 ? t.problem : t.agitate}</p>
          <h3 id={`${video.id}-title`}>{video.title[language]}</h3>
          <p className="pv-summary">{video.summary[language]}</p>
          <VideoPlayer video={video} />
          <VideoDescription video={video} />
        </article>)}
      </div>

      <div className="pv-solve" id="soluzione">
        {/* Stable targets for #discovery, #evidence… and older shared links; the step follows the fragment. */}
        {[...solveVideos.map(video => video.id), ...Object.keys(legacyFragments)].map(id => <span key={id} id={id} className="pv-anchor scroll-mt-24" aria-hidden="true" />)}
        <p className="pv-step"><span aria-hidden="true">03</span>{t.solve}</p>
        <h3 className="pv-solve-title">{t.solveTitle}</h3>
        <div role="tablist" aria-label={t.chapters} className="pv-tabs">
          {solveVideos.map((video, index) => <button key={video.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab"
            id={`${tabsId}-${video.id}`} aria-controls={`${tabsId}-panel`} aria-selected={active === video.id} tabIndex={active === video.id ? 0 : -1}
            onClick={() => setActive(video.id)} onKeyDown={event => onTabKey(event, index)}>
            <span className="pv-tab-name">{video.title[language]}</span><span className="pv-tab-time">{formatSeconds(video.seconds)}</span>
          </button>)}
        </div>
        <div role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-${current.id}`} className="pv-panel">
          <VideoPlayer key={current.id} video={current} />
          <div className="pv-panel-copy">
            <h4>{current.title[language]}</h4>
            <p className="pv-summary">{current.summary[language]}</p>
            <VideoDescription video={current} />
          </div>
        </div>
      </div>

      <div className="pv-walkthrough">
        <div>
          <p className="pv-walkthrough-title">{t.walkthrough}</p>
          <p className="pv-summary">{walkthroughVideo.summary[language]}</p>
        </div>
        <button type="button" className="btn-secondary whitespace-normal" onClick={() => setWalkthroughOpen(true)}>
          <Clapperboard aria-hidden="true" className="size-4" />{t.open} · {formatSeconds(walkthroughVideo.seconds)}
        </button>
      </div>
      <dialog ref={dialog} className="pv-dialog" aria-labelledby="walkthrough-title" onClose={() => setWalkthroughOpen(false)}>
        <div className="pv-dialog-head">
          <h3 id="walkthrough-title">{walkthroughVideo.title[language]}</h3>
          <button type="button" className="pv-dialog-close" onClick={() => setWalkthroughOpen(false)} aria-label={t.close}><X aria-hidden="true" className="size-5" /></button>
        </div>
        {walkthroughOpen ? <VideoPlayer video={walkthroughVideo} autoStart /> : null}
        <VideoDescription video={walkthroughVideo} />
      </dialog>

      <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{journey.principle}</p>
        <a data-interest-section="caso" href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
    </div>
  </section>;
}
