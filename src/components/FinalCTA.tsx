import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref, publicContactEmail } from '../lib/publicOffer';

export default function FinalCTA() {
  const { language } = useLanguage(); const it = language === 'it';
  return <section id="early-access" className="premium-final bg-brand-navy py-14 text-white sm:py-20" aria-labelledby="final-cta-title"><div data-reveal className="section-shell relative z-10 text-center">
    <p className="landing-eyebrow !text-blue-300">{it ? 'Il prossimo passo' : 'The next step'}</p>
    <h2 id="final-cta-title" className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-tight tracking-[-0.04em]">{it ? 'Quale processo vuoi portare alla decisione?' : 'Which process needs a decision?'}</h2>
    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">{it ? 'Raccontaci obiettivo e tempistica. Valutiamo il progetto e definiamo una proposta di pilot per milestone.' : 'Tell us the objective and timing. We assess the project and define a pilot proposal with milestones.'}</p>
    <a href={projectContactHref(language)} className="btn-primary mt-6">{it ? 'Parliamo del tuo progetto' : 'Discuss your project'}<ArrowRight aria-hidden="true" className="size-4" /></a>
    <p className="mt-4 text-sm text-slate-300"><a href={`mailto:${publicContactEmail}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{publicContactEmail}</a></p>
  </div></section>;
}
