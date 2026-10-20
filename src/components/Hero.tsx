import { heroCopy as copy, journeyCopy } from '../content/landingCopy';
import { ArrowDown, ArrowRight, Check, Workflow } from 'lucide-react';
import { hybridExperience } from '../content/hybridExperience';
import { useLanguage } from '../i18n/LanguageContext';
import { productClips } from '../lib/productClips';
import { interestCtaLabel, pilotApplicationHref, productInterestHref } from '../lib/publicOffer';
import ProductFilm from './ProductFilm';



const narration = {
  it: [
    { start: 0, text: 'Dalle informazioni del cliente a un processo chiaro.' },
    { start: 5, text: 'Verifica il modello, insieme alle sue fonti.' },
    { start: 10, text: 'Simula l’As-Is e individua il collo di bottiglia.' },
    { start: 15, text: 'Confronta gli scenari To-Be del caso dimostrativo.' },
    { start: 20, text: 'Condividi il processo con il cliente.' },
  ],
  en: [
    { start: 0, text: 'From client information to a clear process.' },
    { start: 5, text: 'Review the model alongside its sources.' },
    { start: 10, text: 'Simulate the As-Is and identify the bottleneck.' },
    { start: 15, text: 'Compare the To-Be scenarios in the demo case.' },
    { start: 20, text: 'Share the process with the client.' },
  ],
};

export default function Hero({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const t = copy[language];
  const experience = hybridExperience[language];
  const film = <ProductFilm key={language} clip={productClips.hero} priority minimal autoPlay={!compact} narration={narration[language]} />;
  return <section id="hero" className="premium-hero bg-white pb-10 pt-10 sm:pb-14 sm:pt-14" aria-labelledby="hero-title">
    <div className="section-shell hero-layout">
      <div className="hero-heading min-w-0">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title" className="hero-headline mt-3 sm:mt-5 text-balance font-display text-[clamp(2.25rem,4.2vw,3.85rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-brand-ink lg:text-[clamp(2rem,3.2vw,3rem)]"><span className="block">{t.first}</span>{' '}<span className="block text-brand-blue">{t.second}</span></h1>
      </div>
      {compact ? <div className="hero-description max-w-[36rem] text-base leading-7 text-slate-600">
        <p>{t.body}</p>
        <ul className="hybrid-hero-benefits" aria-label={language === 'it' ? 'Benefici DeliR' : 'DeliR benefits'}>
          {[0, 1, 4].map(index => <li key={index}><Check aria-hidden="true" className="size-4 shrink-0 text-brand-blue" /><span>{journeyCopy[language].modules[index].output}</span></li>)}
        </ul>
      </div> : <p className="hero-description max-w-[36rem] text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{t.body}</p>}
      <div className="hero-actions">
        <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <a data-interest-section="hero" href={productInterestHref(language)} className="btn-primary whitespace-normal rounded-full px-7">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
          <a href="#caso" className="btn-text min-h-11 justify-center text-brand-blue">{t.secondary}<ArrowDown aria-hidden="true" className="size-4" /></a>
        </div>
        <p className="mt-4 inline-flex items-start gap-2 text-xs leading-5 text-slate-600"><Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-blue" />{t.waitlistNote}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t.pilotLead} <a data-pilot-section="hero" href={pilotApplicationHref(language)} className="font-semibold text-brand-blue underline underline-offset-4">{t.pilotAction}</a>.</p>
      </div>
      <div className="hero-visual min-w-0" data-scroll-visual="hero">
        {compact ? <div className="hybrid-demo-frame">
          <div className="hybrid-demo-bar">
            <p><Workflow aria-hidden="true" size={18} /><span>DeliR <span className="hybrid-workspace-label">/ {experience.workspace}</span></span></p>
            <span className="hybrid-demo-tag">{experience.demo}</span>
          </div>
          {film}
        </div> : film}
      </div>
    </div>
  </section>;
}
