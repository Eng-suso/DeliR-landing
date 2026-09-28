import { ArrowDown, ArrowRight, CheckCircle2, FileCheck2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import heroImage from '../../artifacts/landing-media/images/hero-evidence-to-decision.png';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Per consulenti BPM, Operations e sistemi di gestione',
    headline: 'Un solo sistema per capire, trasformare e governare come lavora il cliente.',
    subheadline: 'DeliR accompagna l’intero incarico. Collega fonti, evidenze, processi, dati, scenari, decisioni e deliverable, dalla discovery all’implementazione e alla governance continua.',
    primary: 'Candida un incarico al pilot',
    secondary: 'Guarda un incarico in DeliR',
    assurances: ['Pilot accompagnato', 'Perimetro concordato', 'Nessun abbonamento automatico'],
    label: 'Processo verificato sulle fonti',
    caption: 'Canvas BPMN di DeliR con processo Purchase-to-Pay e pannello delle evidenze collegate alle fonti.',
  },
  en: {
    eyebrow: 'For BPM, operations and management-system consultants',
    headline: 'One system to understand, transform and govern how the client works.',
    subheadline: 'DeliR supports the entire engagement. It connects sources, evidence, processes, data, scenarios, decisions and deliverables from discovery to implementation and continuous governance.',
    primary: 'Apply with an engagement',
    secondary: 'See an engagement in DeliR',
    assurances: ['Guided pilot', 'Agreed scope', 'No automatic subscription'],
    label: 'Process verified against sources',
    caption: 'DeliR BPMN canvas showing a Purchase-to-Pay process and the evidence panel linked to source material.',
  },
} as const;

export default function Hero() {
  const { language } = useLanguage();
  const t = copy[language];
  const reduceMotion = useReducedMotion();
  const enter = (delay: number, distance = 18) => ({
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay, ease: 'easeOut' as const },
  });

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40 lg:min-h-[880px]" aria-labelledby="hero-title">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/55" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-pattern opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
        <div className="max-w-2xl">
          <motion.p {...enter(0.04, 10)} className="section-kicker">
            <span className="h-px w-7 bg-blue-600" />{t.eyebrow}
          </motion.p>
          <motion.h1 {...enter(0.11)} id="hero-title" className="mt-6 max-w-[14ch] text-balance font-display text-[clamp(2.8rem,5.7vw,5.15rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-brand-ink">
            {t.headline}
          </motion.h1>
          <motion.p {...enter(0.19)} className="mt-7 max-w-xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
            {t.subheadline}
          </motion.p>
          <motion.div {...enter(0.27)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/pilot" className="btn-primary w-full sm:w-auto">
              {t.primary}<ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href="#incarico" className="btn-secondary w-full sm:w-auto">
              {t.secondary}<ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </motion.div>
          <motion.ul {...enter(0.33, 10)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600" aria-label={language === 'it' ? 'Condizioni del pilot' : 'Pilot terms'}>
            {t.assurances.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-blue-700" />{item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.figure {...enter(0.16, 26)} className="relative mx-auto w-full max-w-3xl" aria-labelledby="hero-product-caption">
          <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-[2rem] bg-blue-200/40 blur-3xl" />
          <div className="product-frame">
            <div className="flex min-h-12 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                <FileCheck2 aria-hidden="true" className="h-3.5 w-3.5" />{t.label}
              </span>
            </div>
            <img src={heroImage} alt={t.caption} width="1600" height="1000" fetchPriority="high" decoding="async" className="block h-auto w-full" />
          </div>
          <figcaption id="hero-product-caption" className="sr-only">{t.caption}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
