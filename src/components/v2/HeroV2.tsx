import { ArrowDown, Check } from 'lucide-react';
import { heroCopy, journeyCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import { pilotApplicationHref } from '../../lib/publicOffer';
import ActionV2 from './ActionV2';
import VideoSlotV2 from './VideoSlotV2';

export default function HeroV2({ studio = false }: { studio?: boolean }) {
  const { language } = useLanguage();
  const t = heroCopy[language];
  const benefits = [0, 1, 4].map(index => journeyCopy[language].modules[index].output);
  return <section id="hero" aria-labelledby="hero-v2-title" className="v2-hero v2-section">
    <div className="section-shell v2-split v2-hero-layout">
      <div className="v2-hero-copy min-w-0">
        <p className="landing-eyebrow !text-blue-200">{t.eyebrow}</p>
        <h1 id="hero-v2-title" className="v2-title mt-5">{t.first}</h1>
        <p className="v2-hero-outcome mt-3">{t.second}</p>
        <ul className="v2-hero-benefits" aria-label={language === 'it' ? 'Benefici DeliR' : 'DeliR benefits'}>
          {benefits.map(benefit => <li key={benefit}><span className="v2-benefit-check"><Check aria-hidden="true" className="size-4" /></span><span>{benefit}</span></li>)}
        </ul>
        <ActionV2 />
        <p className="v2-hero-friction">{t.waitlistNote}</p>
        <div className="v2-hero-secondary">
          <a href="#caso">{t.secondary}<ArrowDown aria-hidden="true" className="size-4" /></a>
          <span>{t.pilotLead} <a href={pilotApplicationHref(language)}>{t.pilotAction}</a>.</span>
        </div>
      </div>
      <VideoSlotV2 id="hero" studio={studio} priority />
    </div>
  </section>;
}
