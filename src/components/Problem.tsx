import { problemCopy as copy } from '../content/landingCopy';
import { useLanguage } from '../i18n/LanguageContext';
import { Files, ScanSearch, Workflow, ChartNoAxesCombined } from 'lucide-react';

const stageIcons = [Files, ScanSearch, Workflow, ChartNoAxesCombined];



export default function Problem() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="metodo" className="premium-method scroll-mt-24 bg-brand-navy py-12 text-white sm:py-16" aria-labelledby="problem-title">
      <div className="section-shell relative z-10">
        <div data-reveal className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-24">
          <div>
            <p className="landing-eyebrow text-blue-300">{t.eyebrow}</p>
            <h2 id="problem-title" className="mt-6 max-w-[17ch] text-balance font-display text-[clamp(2.4rem,4.4vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-white">{t.title}</h2>
          </div>
          <p className="max-w-[39rem] text-pretty text-[17px] leading-8 text-slate-300 lg:pb-2 lg:text-[19px] lg:leading-9">{t.body}</p>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.chain.map(([number, title, detail], index) => {
              const Icon = stageIcons[index];
              return <div data-reveal data-reveal-delay={index * 60} key={number} className="method-card relative border-t border-white/25 pt-5">
                <div className="flex items-center gap-4">
                  <span className="method-icon"><Icon aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                  <span className="method-number font-mono text-xs text-blue-300">{number}</span>
                </div>
                <h3 className="mt-6 font-display text-[26px] font-semibold tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-2 max-w-[18rem] text-[15px] leading-6 text-slate-300">{detail}</p>
              </div>;
            })}
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-base leading-7 text-blue-200 sm:text-lg sm:leading-8">{t.caption}</p>
      </div>
    </section>
  );
}
