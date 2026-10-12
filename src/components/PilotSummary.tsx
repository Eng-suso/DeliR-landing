import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { pilotApplicationHref, pilotCtaLabel } from '../lib/publicOffer';

export default function PilotSummary() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <section id="pilot-summary" aria-labelledby="pilot-summary-title" className="border-y border-slate-200 bg-white py-7 sm:py-10">
    <div className="section-shell flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-3xl">
        <p className="landing-eyebrow">{it ? 'Un progetto, un pilot a pagamento' : 'One project, one paid pilot'}</p>
        <h2 id="pilot-summary-title" className="mt-3 font-display text-xl font-semibold text-brand-ink">{it ? 'Un As-Is da verificare. Alternative da confrontare. Una decisione da spiegare.' : 'An As-Is to review. Alternatives to compare. A decision you can explain.'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{it ? 'Concordiamo modello, evidenze, scenari e review da consegnare, insieme a perimetro, milestone e prezzo. Per il primo confronto non servono documenti del cliente.' : 'Agree the model, evidence, scenarios and review to deliver, alongside scope, milestones and price. No client documents are needed for the first conversation.'}</p>
      </div>
      <a href={pilotApplicationHref(language)} className="btn-primary shrink-0 whitespace-normal">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
    </div>
  </section>;
}
