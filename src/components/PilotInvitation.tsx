import { pilotCopy as copy } from '../content/landingCopy';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { pilotCtaLabel, pilotRiskReversals, pilotApplicationHref } from '../lib/publicOffer';



export default function PilotInvitation() {
  const { language } = useLanguage(); const t = copy[language];
  return <section id="pilot" className="premium-pilot scroll-mt-24 bg-white py-14 sm:py-20" aria-labelledby="pilot-invitation-title">
    <div className="section-shell grid items-center gap-10 lg:grid-cols-2">
      <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="pilot-invitation-title" className="landing-title mt-5">{t.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{t.body}</p>
        <p className="mt-4 text-base leading-7 text-slate-600">{t.kickoff}</p>
        <h3 className="mt-7 text-lg font-semibold text-brand-ink">{t.control}</h3>
        <ul className="mt-4 space-y-3">{pilotRiskReversals[language].map(term => <li key={term} className="flex items-start gap-3 text-sm font-semibold leading-6 text-brand-ink"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-blue" /><span>{term}</span></li>)}</ul>
        <p className="mt-7 text-sm font-semibold leading-6 text-brand-ink">{t.firstContact}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t.note}</p>
        <a href={pilotApplicationHref(language)} className="btn-primary mt-6 whitespace-normal">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
      </div>
      <div data-reveal className="milestone-card rounded-3xl border border-slate-200 bg-brand-light p-6 sm:p-8"><p className="mb-5 text-sm font-semibold text-brand-blue">{t.example}</p><ol className="divide-y divide-slate-300">{t.steps.map(([title, description], index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 first:pt-0"><span className="pt-1 font-mono text-xs text-brand-blue">0{index + 1}</span><div><h3 className="text-lg font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div></li>)}</ol></div>
    </div>
  </section>;
}
