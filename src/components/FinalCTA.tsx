import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkAnimatedBackground from './DarkAnimatedBackground';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Il prossimo incarico può partire diversamente',
    title: 'Porta un incarico reale. Mantieni collegato tutto ciò che serve per trasformarlo.',
    body: 'Valuta DeliR su un progetto concreto con supporto diretto, perimetro concordato e criteri di successo definiti prima di iniziare.',
    primary: 'Candida un incarico al pilot',
    secondaryLead: 'Non hai ancora un incarico adatto?',
    secondary: 'Ricevi gli aggiornamenti',
  },
  en: {
    eyebrow: 'The next engagement can start differently',
    title: 'Bring a real engagement. Keep everything needed to transform it connected.',
    body: 'Evaluate DeliR on a concrete project with direct support, an agreed scope and success criteria defined before starting.',
    primary: 'Apply with an engagement',
    secondaryLead: 'No suitable engagement yet?',
    secondary: 'Join product updates',
  },
} as const;

export default function FinalCTA() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section id="early-access" className="relative overflow-hidden bg-brand-navy py-24 text-white sm:py-28" aria-labelledby="final-cta-title">
      <DarkAnimatedBackground />
      <div className="section-shell relative z-10 text-center">
        <p className="section-kicker justify-center !text-blue-300"><span className="h-px w-7 bg-blue-400" />{t.eyebrow}<span className="h-px w-7 bg-blue-400" /></p>
        <h2 id="final-cta-title" className="mx-auto mt-7 max-w-5xl text-balance font-display text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">{t.body}</p>
        <div className="mt-9"><Link to="/pilot" className="btn-primary px-8 text-base">{t.primary}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
        <p className="mt-6 text-sm text-slate-400">{t.secondaryLead} <Link to="/waitlist" className="font-semibold text-white underline decoration-slate-500 underline-offset-4 hover:decoration-white">{t.secondary}</Link></p>
      </div>
    </section>
  );
}
