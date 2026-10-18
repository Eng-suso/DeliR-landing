import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, Clapperboard, Play } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getVideoSlot, referenceClip, videoAssetPath, type VideoSlotId } from '../../lib/landingV2Media';

const mobileQuery = '(max-width: 767px)';
const subscribe = (callback: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

export default function VideoSlotV2({ id, studio = false, priority = false }: { id: VideoSlotId; studio?: boolean; priority?: boolean }) {
  const { language } = useLanguage();
  const it = language === 'it';
  const labelId = useId();
  const slot = getVideoSlot(id);
  const reference = referenceClip(slot);
  const localized = 'localizedMedia' in reference ? reference.localizedMedia?.[language] : undefined;
  const fallbackPoster = localized?.poster ?? reference.poster;
  const fallbackSrcSet = localized?.posterSrcSet ?? reference.posterSrcSet;
  const mobile = useSyncExternalStore(subscribe, getMobileSnapshot, getServerSnapshot);
  const device = mobile ? 'mobile' : 'desktop';
  const ready = slot.status === 'ready';
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const title = reference.title[language];
  const poster = ready ? videoAssetPath(slot, device, language, 'webp') : fallbackPoster;

  function play() {
    // Mount in the user gesture so Safari can start playback too.
    flushSync(() => setRequested(true));
    void player.current?.play().catch(() => { /* Native controls remain available. */ });
  }

  return <div className="v2-media-slot min-w-0" data-video-slot={slot.id} data-video-status={slot.status}>
    <figure aria-labelledby={`${labelId}-caption`}>
      <div className="v2-media-frame">
        <picture>
          {ready ? <source media={mobileQuery} srcSet={videoAssetPath(slot, 'mobile', language, 'webp')} /> : null}
          <img src={ready ? videoAssetPath(slot, 'desktop', language, 'webp') : fallbackPoster}
            srcSet={ready ? undefined : fallbackSrcSet} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 90vw, 640px"
            alt={reference.description[language]} width={slot.desktop.width} height={slot.desktop.height}
            loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
        </picture>
        {ready && requested && !failed ? <video key={`${device}-${language}`} ref={player} controls playsInline muted preload="none" poster={poster}
          aria-label={title} aria-describedby={`${labelId}-caption`} onError={() => setFailed(true)}>
          <source src={videoAssetPath(slot, device, language, 'mp4')} type="video/mp4" />
          <source src={videoAssetPath(slot, device, language, 'webm')} type="video/webm" />
          <track kind="captions" src={videoAssetPath(slot, device, language, 'vtt')} srcLang={language} label={it ? 'Italiano' : 'English'} default />
        </video> : null}
        {ready && !requested ? <button type="button" onClick={play} className="v2-play" aria-label={`${it ? 'Riproduci' : 'Play'}: ${title}`}><Play aria-hidden="true" className="size-5" /></button> : null}
      </div>
      <figcaption id={`${labelId}-caption`} className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs leading-5 text-slate-600">
        <span>{ready ? title : (it ? 'Anteprima statica · caso dimostrativo' : 'Still preview · demo case')}</span>
        <a href={poster} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-semibold text-brand-blue underline underline-offset-4">
          {it ? 'Apri immagine' : 'Open image'}<ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </figcaption>
      {failed ? <p role="status" className="mt-2 text-sm text-slate-600">{it ? 'Video non disponibile. Consulta l’immagine e la descrizione.' : 'Video unavailable. View the image and description.'}</p> : null}
    </figure>
    {studio ? <details className="v2-shot-card mt-3" open>
      <summary className="flex min-h-12 cursor-pointer items-center gap-2 font-semibold"><Clapperboard aria-hidden="true" className="size-4 shrink-0" /><span>{slot.id} · {slot.seconds.min}–{slot.seconds.max}s · {ready ? (it ? 'Pronto' : 'Ready') : (it ? 'Da registrare' : 'To record')}</span></summary>
      <div className="pb-4">
        <p className="text-sm leading-6">Desktop {slot.desktop.width} × {slot.desktop.height} (16:10) · Mobile {slot.mobile.width} × {slot.mobile.height} (4:3)</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">{slot.shots[language].map(shot => <li key={shot}>{shot}</li>)}</ol>
        <p className="mt-4 text-xs font-semibold">{it ? 'File per questa visualizzazione' : 'Files for this viewport'}</p>
        <ul className="mt-2 space-y-1 text-xs leading-5">{(['mp4', 'webm', 'webp', 'vtt'] as const).map(ext => <li key={ext}><code className="break-all">{videoAssetPath(slot, device, language, ext)}</code></li>)}</ul>
      </div>
    </details> : null}
  </div>;
}
