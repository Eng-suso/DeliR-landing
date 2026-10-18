import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { heroCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { interestCtaLabel, pilotApplicationHref, productInterestHref } from '../../lib/publicOffer';
import VideoSlotV2 from './VideoSlotV2';

export default function HeroV2({ studio = false }: { studio?: boolean }) {
  const { language } = useLanguage();
  const t = heroCopy[language];
  return <section id="hero" aria-labelledby="hero-v2-title" className="v2-hero v2-section">
    <div className="section-shell v2-split">
      <div className="min-w-0">
        <p className="landing-eyebrow !text-blue-200">{t.eyebrow}</p>
        <h1 id="hero-v2-title" className="v2-title mt-5">{t.first}<span className="mt-2 block text-blue-200">{t.second}</span></h1>
        <p className="v2-body mt-6">{t.body}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={productInterestHref(language)} className="btn-primary whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
          <a href="#caso" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white underline underline-offset-4 hover:bg-white/10">{t.secondary}<ArrowDown aria-hidden="true" className="size-4" /></a>
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-slate-300"><Check aria-hidden="true" className="mt-1 size-4 shrink-0" />{t.waitlistNote}</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">{t.pilotLead} <a href={pilotApplicationHref(language)} className="inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4">{t.pilotAction}</a>.</p>
      </div>
      <VideoSlotV2 id="hero" studio={studio} priority />
    </div>
  </section>;
}
