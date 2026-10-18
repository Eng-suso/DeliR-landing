import { useLanguage } from '../../i18n/LanguageContext';
import type { ProductClip } from '../../lib/productClips';

export default function DemoStillV2({ clip }: { clip: ProductClip }) {
  const { language } = useLanguage();
  const media = clip.localizedMedia?.[language];
  return <figure className="v2-demo-still">
    <div className="v2-still-frame"><img src={media?.poster ?? clip.poster} srcSet={media?.posterSrcSet ?? clip.posterSrcSet}
      sizes="(max-width: 767px) calc(100vw - 48px), 640px" width={clip.width} height={clip.height}
      loading="lazy" decoding="async" alt={clip.description[language]} /></div>
    <figcaption><span className="block font-semibold">{clip.title[language]}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{language === 'it' ? 'Caso dimostrativo · immagine del prodotto' : 'Demo case · product still'}</span></figcaption>
  </figure>;
}
