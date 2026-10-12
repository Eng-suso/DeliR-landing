import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { interestCtaLabel, productInterestHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Dal prodotto al tuo lavoro',
    title: 'Useresti DeliR nel tuo prossimo incarico?',
    intro: 'Segnala il tuo interesse a provarlo.',
    body: 'Lascia la tua email e indica il tipo di attività. Ti contatterò per la disponibilità di accesso. Puoi anche dirmi quando lo useresti.',
    terms: 'Nessun acquisto · Nessun accesso immediato · Richiesta ritirabile',
  },
  en: {
    eyebrow: 'From the product to your work',
    title: 'Would you use DeliR on your next engagement?',
    intro: 'Tell us you would like to try it.',
    body: 'Leave your email and practice type. I will contact you about access availability. You can also tell me when you would use it.',
    terms: 'No purchase · No immediate access · Withdraw your request anytime',
  },
};

export default function FinalCTA() {
  const { language } = useLanguage();
  const t = copy[language];
  return <section id="early-access" className="premium-final bg-brand-navy py-14 text-white sm:py-20" aria-labelledby="final-cta-title"><div data-reveal className="section-shell relative z-10 text-center">
    <p className="landing-eyebrow !text-blue-300">{t.eyebrow}</p>
    <h2 id="final-cta-title" className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-tight tracking-[-0.04em]">{t.title}</h2>
    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">{t.intro}</p>
    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">{t.body}</p>
    <a href={productInterestHref(language)} className="btn-primary mt-7 whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
    <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">{t.terms}</p>
  </div></section>;
}
