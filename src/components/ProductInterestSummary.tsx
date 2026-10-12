import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { interestCtaLabel, productInterestHref } from '../lib/publicOffer';

export default function ProductInterestSummary() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <section id="product-interest" aria-labelledby="product-interest-title" className="border-y border-slate-200 bg-white py-7 sm:py-10">
    <div className="section-shell flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-3xl">
        <p className="landing-eyebrow">{it ? 'Per il tuo prossimo incarico' : 'For your next engagement'}</p>
        <h2 id="product-interest-title" className="mt-3 font-display text-xl font-semibold">{it ? 'Ti interessa provarlo? Il primo passo è segnalarlo.' : 'Interested in trying it? Start by telling us.'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{it ? 'Email e tipo di attività. Se vuoi, indica quando lo useresti. La richiesta serve a gestire il tuo interesse e contattarti per la disponibilità: non è un acquisto né un accesso immediato.' : 'Email and practice type. Optionally tell us when you would use it. A request helps us handle your interest and contact you about availability; it is not a purchase or immediate access.'}</p>
      </div>
      <a data-interest-section="product-interest" href={productInterestHref(language)} className="btn-primary shrink-0 whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
    </div>
  </section>;
}
