import { finalCtaCopy as copy } from '../content/landingCopy';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { interestCtaLabel, pilotApplicationHref, productInterestHref, waitlistRiskReversals } from '../lib/publicOffer';



export default function FinalCTA() {
  const { language } = useLanguage();
  const t = copy[language];
  return <section id="early-access" className="premium-final bg-brand-navy py-14 text-white sm:py-20" aria-labelledby="final-cta-title"><div data-reveal className="section-shell relative z-10 text-center">
    <p className="landing-eyebrow !text-blue-300">{t.eyebrow}</p>
    <h2 id="final-cta-title" className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-tight tracking-[-0.04em]">{t.title}</h2>
    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">{t.intro}</p>
    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">{t.body}</p>
    <a href={productInterestHref(language)} className="btn-primary mt-7 whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
    <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-slate-300">{waitlistRiskReversals[language].join(' · ')}</p>
    <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">{t.pilotLead} <a data-pilot-section="early-access" href={pilotApplicationHref(language)} className="font-semibold text-white underline underline-offset-4">{t.pilotAction}</a>.</p>
  </div></section>;
}
