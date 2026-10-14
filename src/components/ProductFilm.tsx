import { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Maximize2, Pause, Play, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ProductClip } from '../lib/productClips';
import { heroPosterSizes } from '../lib/heroMedia';

type Props = { clip: ProductClip; priority?: boolean; minimal?: boolean; narration?: readonly { start: number; text: string }[]; focusFrame?: { x: number; y: number; width: number; height: number } };
type ConnectionNavigator = Navigator & { connection?: { saveData?: boolean } };

function ambientPlaybackAllowed() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    && !(navigator as ConnectionNavigator).connection?.saveData;
}

export default function ProductFilm({ clip, priority = false, minimal = false, narration, focusFrame }: Props) {
  const { language } = useLanguage();
  const id = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [ambient, setAmbient] = useState(ambientPlaybackAllowed);
  const [pageActive, setPageActive] = useState(true);
  const [requested, setRequested] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const title = clip.title[language];
  const description = clip.description[language];
  const localizedMedia = clip.localizedMedia?.[language];
  const poster = localizedMedia?.poster ?? clip.poster;
  const posterSrcSet = localizedMedia?.posterSrcSet ?? clip.posterSrcSet;
  const mp4 = localizedMedia?.mp4 ?? `/product-clips/${clip.id}.mp4`;
  // Localized hero recordings are supplied as MP4. Do not fall back to the old-language WebM.
  const webm = localizedMedia ? undefined : `/product-clips/${clip.id}.webm`;
  const captions = localizedMedia?.captions ?? `/product-clips/${clip.id}.${language}.vtt`;
  const mobileFocus = ['evidenze-sul-processo', 'lacuna-aperta', 'confronto', 'memoria', 'review-to-be'].includes(clip.id);
  const posterSizes = `${mobileFocus ? '(max-width: 640px) 1920px, ' : ''}${priority ? heroPosterSizes : '(max-width: 640px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 96px), 640px'}`;
  const sentence = narration?.reduce((current, item) => item.start <= playbackTime ? item : current, narration[0]);
  // Frame a detail from the original recording; the dialog retains the full view.
  const mediaStyle = focusFrame ? {
    width: `${1920 / focusFrame.width * 100}%`, height: 'auto', aspectRatio: '16 / 9',
    left: `${-focusFrame.x / focusFrame.width * 100}%`, top: `${-focusFrame.y / focusFrame.height * 100}%`, maxWidth: 'none',
  } : undefined;
  const text = language === 'it'
    ? { play: 'Riproduci', pause: 'Pausa', expand: 'Apri il video completo', close: 'Chiudi il video', silent: 'Video senza audio', error: 'Video non disponibile. Puoi consultare l’anteprima e la descrizione.' }
    : { play: 'Play', pause: 'Pause', expand: 'Open full video', close: 'Close video', silent: 'Silent video', error: 'Video unavailable. You can view the preview and description.' };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const update = () => setAmbient(ambientPlaybackAllowed());
    const visibility = () => setPageActive(!document.hidden);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      setVisible(inView);
      if (!inView) setPlaying(false);
    }, { threshold: 0.2 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Visible films autoplay on desktop and mobile; reduced motion and Save-Data
  // retain a poster until the visitor opts in.
  // No video source exists outside the viewport, so off-screen clips are not fetched.
  const loadVideo = visible && (ambient || requested) && !failed;
  const shouldPlay = loadVideo && !paused && !dialogOpen && pageActive;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      void video.play().catch(() => { /* Poster and explicit play remain available if autoplay is blocked. */ });
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  const togglePlayback = () => {
    if (playing) {
      setPaused(true);
      videoRef.current?.pause();
    } else {
      // Safari needs the media element and play() in the original user gesture.
      // Mount just this opted-in film before issuing the imperative play call.
      if (!videoRef.current) {
        flushSync(() => { setVisible(true); setRequested(true); setPaused(false); });
      } else {
        setRequested(true);
        setPaused(false);
      }
      void videoRef.current?.play().catch(() => {});
    }
  };

  return (
    <figure id={priority ? 'hero-product-outcome' : `scene-${clip.id}`} className="product-film scroll-mt-24" data-clip={clip.id}>
      <div ref={frameRef} style={{ aspectRatio: focusFrame ? `${focusFrame.width} / ${focusFrame.height}` : `${clip.width} / ${clip.height}` }} className="relative isolate aspect-video overflow-hidden rounded-[14px] border border-slate-200 bg-white sm:rounded-[20px]">
        <img src={poster} srcSet={posterSrcSet} sizes={focusFrame ? '(max-width: 640px) 1440px, 1920px' : posterSizes} alt={description} width={clip.width} height={clip.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" style={mediaStyle} className={focusFrame ? 'absolute' : 'h-full w-full object-contain'} />
        {loadVideo ? (
          <video ref={videoRef} aria-label={title} aria-describedby={`${id}-description`} autoPlay={shouldPlay} muted playsInline loop preload="none" poster={poster}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }}
            onTimeUpdate={narration ? event => setPlaybackTime(event.currentTarget.currentTime) : undefined}
            onSeeking={narration ? event => setPlaybackTime(event.currentTarget.currentTime) : undefined}
            onSeeked={narration ? event => setPlaybackTime(event.currentTarget.currentTime) : undefined}
            style={mediaStyle} className={focusFrame ? 'absolute' : 'absolute inset-0 h-full w-full object-contain'}>
            <source src={mp4} type="video/mp4" />
            {webm ? <source src={webm} type="video/webm" /> : null}
            <track kind="captions" src={captions} srcLang={language} label={language === 'it' ? 'Descrizione italiana' : 'English description'} />
          </video>
        ) : null}
        {minimal ? <div className="absolute bottom-3 right-3 z-10 flex gap-2">
          <button type="button" onClick={togglePlayback} disabled={failed} aria-label={`${playing && visible ? text.pause : text.play}: ${title}`} className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-brand-navy/90 text-white shadow-sm hover:bg-brand-blue disabled:opacity-50">
            {playing && visible ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
          </button>
          <button ref={expandRef} type="button" onClick={() => { setDialogOpen(true); dialogRef.current?.showModal(); }} aria-label={`${text.expand}: ${title}`} className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-brand-navy/90 text-white shadow-sm hover:bg-brand-blue"><Maximize2 aria-hidden="true" className="size-4" /></button>
        </div> : null}
      </div>

      {sentence ? <p className="min-h-16 px-2 pt-4 text-center text-base font-medium leading-6 text-brand-ink sm:text-lg sm:leading-7">{sentence.text}</p> : null}

      {!minimal ? <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
          <span aria-hidden="true" className={`size-1.5 rounded-full ${playing && visible ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <span>{text.silent}</span><span aria-hidden="true">·</span><span className="tabular-nums">{Math.round(clip.duration)}s</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={togglePlayback} disabled={failed} aria-label={`${playing && visible ? text.pause : text.play}: ${title}`} className="film-control">
            {playing && visible ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            <span>{playing && visible ? text.pause : text.play}</span>
          </button>
          <button ref={expandRef} type="button" onClick={() => { setDialogOpen(true); dialogRef.current?.showModal(); }} aria-label={`${text.expand}: ${title}`} className="film-control">
            <Maximize2 aria-hidden="true" className="size-4" /><span className="sm:hidden">{language === 'it' ? 'Video completo' : 'Full video'}</span><span className="hidden sm:inline">{text.expand}</span>
          </button>
        </div>
      </div> : null}
      <figcaption id={`${id}-description`} className={minimal ? 'sr-only' : 'mt-2 max-w-4xl text-xs leading-5 text-slate-600'}>{description}</figcaption>
      {failed ? <p role="status" className="mt-2 text-sm text-slate-600">{text.error}</p> : null}

      <dialog data-lenis-prevent ref={dialogRef} aria-labelledby={`${id}-dialog-title`} aria-describedby={`${id}-dialog-description`}
        onClose={() => { setDialogOpen(false); expandRef.current?.focus(); }}
        className="film-dialog fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[1680px] overflow-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/85 sm:w-[calc(100vw-48px)]">
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 px-4">
          <h2 id={`${id}-dialog-title`} className="min-w-0 truncate text-base font-semibold text-brand-ink">{title}</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label={text.close} className="film-control"><X aria-hidden="true" className="size-5" /></button>
        </div>
        {dialogOpen ? <video aria-label={title} aria-describedby={`${id}-dialog-description`} controls autoPlay muted playsInline preload="metadata" poster={poster} className="mx-auto max-h-[calc(100dvh-210px)] w-full bg-slate-950">
          <source src={mp4} type="video/mp4" />
          {webm ? <source src={webm} type="video/webm" /> : null}
          <track kind="captions" src={captions} srcLang={language} label={language === 'it' ? 'Descrizione italiana' : 'English description'} />
        </video> : null}
        <p id={`${id}-dialog-description`} className="px-4 py-4 text-sm leading-6 text-slate-600">{description}</p>
      </dialog>
    </figure>
  );
}
