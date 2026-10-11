import { faqContent as copy } from '../lib/faqContent';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';


export default function Faq() {
  const { language } = useLanguage();
  const t = copy[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="premium-faq relative scroll-mt-28 border-t border-slate-200 bg-white py-20 sm:py-24" aria-labelledby="faq-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="faq-title" className="landing-title mt-6">{t.title}</h2></div>
        <div>
          {t.faqs.map(([phase, question, answer], index) => {
            const open = openIndex === index;
            return <div data-reveal key={question} className="border-b border-slate-200">
              <button type="button" onClick={() => setOpenIndex(open ? null : index)} className="group flex min-h-16 w-full items-center justify-between py-5 text-left" aria-expanded={open} aria-controls={`faq-panel-${index}`}>
                <span className="pr-6"><span className="mb-2 block text-xs font-semibold tracking-wide text-brand-blue">{phase}</span><span className="block text-base font-medium text-brand-ink group-hover:text-brand-blue sm:text-lg">{question}</span></span>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${open ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-300 bg-white text-slate-500 group-hover:border-brand-blue group-hover:text-brand-blue'}`}>
                  {open ? <Minus aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
                </span>
              </button>
              <div id={`faq-panel-${index}`} role="region" aria-label={question} hidden={!open}>
                <p className="max-w-3xl pb-6 text-sm leading-7 text-slate-600 sm:text-base">{answer}</p>
              </div>
            </div>;
          })}
          <Link to={language === 'it' ? '/security-data' : '/security-data?lang=en'} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.dataLink}</Link>
        </div>
      </div>
    </section>
  );
}
