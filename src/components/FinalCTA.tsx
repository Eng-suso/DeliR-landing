import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { pilotCtaLabel, projectContactHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Pronti quando lo sei tu',
    title: 'Porta il tuo prossimo progetto per un cliente.',
    intro: 'Raccontaci cosa vuoi comprendere, migliorare o decidere.',
    body: 'Valuteremo il progetto insieme a te, definiremo un perimetro chiaro per il pilot e concorderemo output, milestone e prezzo prima che tu prenda un impegno.',
    terms: 'Perimetro chiaro · Paghi per milestone · Puoi fermarti quando vuoi',
  },
  en: {
    eyebrow: 'Ready when you are',
    title: 'Bring your next client project.',
    intro: 'Tell us what you are trying to understand, improve, or decide.',
    body: 'We will review the project with you, define a clear pilot scope, and agree deliverables, milestones, and price before you commit.',
    terms: 'Clear scope · Pay by milestone · Stop anytime',
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
    <a href={projectContactHref(language)} className="btn-primary mt-7 whitespace-normal">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
    <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">{t.terms}</p>
  </div></section>;
}
