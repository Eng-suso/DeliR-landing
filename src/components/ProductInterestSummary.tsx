import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { interestCtaLabel, pilotApplicationHref, productInterestHref } from '../lib/publicOffer';

export default function ProductInterestSummary() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <section id="product-interest" aria-labelledby="product-interest-title" className="border-y border-slate-200 bg-white py-7 sm:py-10">
    <div className="section-shell flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-3xl">
        <p className="landing-eyebrow">Early access</p>
        <h2 id="product-interest-title" className="mt-3 font-display text-xl font-semibold">{it ? 'Vuoi usare DeliR quando apriremo l’accesso?' : 'Want to use DeliR when access opens?'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{it ? 'Entra nella lista d’attesa. Ti contatterò quando potrò aprire l’accesso a nuovi consulenti e team Operations. Se hai già un incarico concreto, puoi invece candidarlo subito per un pilot.' : 'Join the waitlist. I will contact you when access can open to more consultants and Operations teams. If you already have a real engagement, you can apply for a pilot now.'}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{it ? 'Hai già un progetto?' : 'Already have a project?'} <a data-pilot-section="product-interest" href={pilotApplicationHref(language)} className="font-semibold text-brand-blue underline underline-offset-4">{it ? 'Valuta un pilot' : 'Explore a pilot'}</a>.</p>
      </div>
      <a data-interest-section="product-interest" href={productInterestHref(language)} className="btn-primary shrink-0 whitespace-normal">{interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
    </div>
  </section>;
}
