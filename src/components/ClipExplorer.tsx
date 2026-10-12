import { useLanguage } from '../i18n/LanguageContext';
import type { ProductClip } from '../lib/productClips';
import { useFragment } from '../lib/useFragment';
import ProductFilm from './ProductFilm';

export default function ClipExplorer({ clips, name, initial }: { clips: readonly ProductClip[]; name: string; initial?: string }) {
  const { language } = useLanguage();
  const fragment = useFragment();
  const active = clips.find(clip => `scene-${clip.id}` === fragment) ?? clips.find(clip => clip.id === initial) ?? clips[0];

  return (
    <div data-reveal data-reveal-delay={140} className="min-w-0">
      <div className="product-screen-stage premium-workbench" data-scroll-visual="product">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-brand-ink">{active.title[language]}</span>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-500">{language === 'it' ? 'Caso dimostrativo' : 'Demo case'}</span>
        </div>
        <ProductFilm key={active.id} clip={active} />
      </div>
      <div role="group" aria-label={`${language === 'it' ? 'Scene' : 'Scenes'}: ${name}`} className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {clips.map((clip, index) => (
          <a key={clip.id} href={`#scene-${clip.id}`} aria-current={clip.id === active.id ? 'true' : undefined} className={`scene-button ${clip.id === active.id ? 'scene-button-active' : ''}`}>
            <span aria-hidden="true" className="font-mono text-[10px]">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-left">{clip.title[language]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
