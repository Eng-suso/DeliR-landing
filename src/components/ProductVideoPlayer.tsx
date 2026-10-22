import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { formatSeconds, productVideoPath, type ProductVideo } from '../content/productVideos';
import { useLanguage } from '../i18n/LanguageContext';
import { trackVideoEvent, type VideoPage } from '../privacy/analytics';
import '../styles/product-video-player.css';

const copy = {
  it: { play: 'Riproduci', more: 'Cosa mostra il video', unavailable: 'Video non disponibile. Leggi la descrizione qui sotto.' },
  en: { play: 'Play', more: 'What the video shows', unavailable: 'Video unavailable. Read the description below.' },
} as const;

/**
 * A silent product video: poster first, the file downloads only when the
 * visitor presses play. Shared by the landing sections and the waitlist
 * confirmation, which shows the full walkthrough.
 */
export function ProductVideoPlayer({ video, page = 'home' }: { video: ProductVideo; page?: VideoPage }) {
  const { language } = useLanguage();
  const t = copy[language];
  const [requested, setRequested] = useState(false);
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
    trackVideoEvent(event, video.id, language, page);
  };

  return <div className="pv-player" data-product-video={video.id}>
    {requested && !failed
      ? <video key={`${video.id}-${language}`} ref={player} controls playsInline muted preload="metadata"
        poster={productVideoPath(video.id, 'jpg')} aria-label={title} width={1920} height={1080}
        onPlay={() => track('video_play')} onEnded={() => track('video_complete')} onError={() => setFailed(true)}>
        {/* VP9 first: it plays where H.264 is unavailable; MP4 covers Safari. */}
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

export function ProductVideoDescription({ video }: { video: ProductVideo }) {
  const { language } = useLanguage();
  return <details className="pv-description">
    <summary>{copy[language].more}</summary>
    <p>{video.description[language]}</p>
  </details>;
}
