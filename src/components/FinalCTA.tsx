import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { interestCtaLabel, pilotApplicationHref, productInterestHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Scegli il prossimo passo',
    title: 'Vuoi usare DeliR nel tuo prossimo incarico?',
    intro: 'Entra nella lista d’attesa per l’early access.',
    body: 'Ti contatterò quando potrò aprire l’accesso a nuovi utenti. Se invece hai già un processo o un progetto reale da portare avanti, puoi candidarlo subito per un pilot.',
    pilotLead: 'Hai già un progetto reale?',
    pilotAction: 'Avvia un pilot',
    terms: 'Early access senza acquisto · Pilot separato e su progetto reale',
  },
  en: {
    eyebrow: 'Choose your next step',
    title: 'Want to use DeliR on your next engagement?',
    intro: 'Join the waitlist for early access.',
    body: 'I will contact you when access can open to more users. If you already have a real process or project to work on, you can apply for a pilot now.',
    pilotLead: 'Already have a real project?',
    pilotAction: 'Start a pilot',
    terms: 'Early access with no purchase · Pilot is separate and project-based',
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
    <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">{t.pilotLead} <a data-pilot-section="early-access" href={pilotApplicationHref(language)} className="font-semibold text-white underline underline-offset-4">{t.pilotAction}</a>.</p>
    <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-slate-400">{t.terms}</p>
  </div></section>;
}
