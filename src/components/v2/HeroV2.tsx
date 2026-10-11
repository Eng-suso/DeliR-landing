import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../../artifacts/landing-media/images/hero-evidence-to-decision.png';
import { useLanguage } from '../../i18n/LanguageContext';
import Eyebrow from '../kit/Eyebrow';
import DarkAnimatedBackground from '../DarkAnimatedBackground';
import FloatingCard from '../kit/FloatingCard';
import ProductCrop from '../kit/ProductCrop';
import SplitHeading from '../kit/SplitHeading';
import SourceMatchCard from '../kit/widgets/SourceMatchCard';
import WaitShareRing from '../kit/widgets/WaitShareRing';

const capabilities = [
  'Process Discovery',
  'Process Mining',
  'Process Intelligence',
  'Process Simulation',
  'Transformation & Delivery',
  'Management Systems',
  'Company Memory',
];

const copy = {
  it: {
    eyebrow: 'Per consulenti BPM, Operations e sistemi di gestione',
    headline: 'Un solo sistema per capire, trasformare e governare come lavora il cliente.',
    subheadline: 'DeliR accompagna l’intero incarico. Collega fonti, evidenze, processi, scenari, decisioni e deliverable, dalla discovery alla governance continua.',
    primary: 'Candida un incarico al pilot',
    secondary: 'Guarda un incarico in DeliR',
    assurances: ['Pilot accompagnato', 'Perimetro concordato', 'Nessun abbonamento automatico'],
    assurancesLabel: 'Condizioni del pilot',
    example: 'Esempio dimostrativo · Purchase-to-Pay',
    caption: 'Canvas BPMN di DeliR con il processo Purchase-to-Pay e il pannello delle evidenze collegate alle fonti. Le schede sovrapposte riportano valori del caso dimostrativo.',
    strip: 'Sette capacità, un solo incarico',
  },
  en: {
    eyebrow: 'For BPM, operations and management-system consultants',
    headline: 'One system to understand, transform and govern how the client works.',
    subheadline: 'DeliR supports the entire engagement. It connects sources, evidence, processes, scenarios, decisions and deliverables, from discovery to continuous governance.',
    primary: 'Apply with an engagement',
    secondary: 'See an engagement in DeliR',
    assurances: ['Guided pilot', 'Agreed scope', 'No automatic subscription'],
    assurancesLabel: 'Pilot terms',
    example: 'Demo engagement · Purchase-to-Pay',
    caption: 'DeliR BPMN canvas with the Purchase-to-Pay process and the evidence panel linked to sources. Overlaid cards show values from the demo engagement.',
    strip: 'Seven capabilities, one engagement',
  },
} as const;

export default function HeroV2() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section aria-labelledby="hero-v2-title" className="relative pb-16 pt-8 sm:pt-12 lg:pb-20">
      <div className="kit-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
          <div className="max-w-[38rem]">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitHeading
              as="h1"
              id="hero-v2-title"
              lead={t.headline}
              className="mt-5 text-balance text-[clamp(2.25rem,3.7vw,3.25rem)] leading-[1.08]"
            />
            <p className="mt-6 max-w-[33rem] text-pretty text-[17px] leading-7 text-muted">{t.subheadline}</p>

            <div className="mt-9 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
              <Link to="/pilot" className="btn-solid">
                {t.primary}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a href="/#incarico" className="link-arrow justify-center sm:justify-start">{t.secondary}</a>
            </div>

            <ul aria-label={t.assurancesLabel} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink">
              {t.assurances.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-royal/10">
                    <Check className="h-3 w-3 text-royal" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <figure aria-labelledby="hero-v2-caption" className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
            <div className="relative aspect-[6/5] overflow-hidden rounded-[20px] bg-navy sm:aspect-[5/4]">
              <DarkAnimatedBackground />
              <p className="absolute left-6 top-5 text-[12px] font-medium text-haze sm:left-8 sm:top-7">{t.example}</p>
              <ProductCrop
                src={heroImage}
                alt=""
                width={1600}
                height={1000}
                region={{ x: 420, y: 185, w: 1000, h: 770 }}
                priority
                className="absolute -bottom-px -right-px w-[88%] rounded-tl-xl sm:w-[90%]"
              />
            </div>

            <FloatingCard order={0} className="hidden sm:block sm:-right-4 sm:top-[16%] lg:-right-8">
              <SourceMatchCard />
            </FloatingCard>
            <FloatingCard order={1} className="-bottom-10 left-4 p-3 sm:-bottom-8 sm:-left-6 sm:p-4 lg:-left-12">
              <WaitShareRing />
            </FloatingCard>

            <figcaption id="hero-v2-caption" className="sr-only">{t.caption}</figcaption>
          </figure>
        </div>

        <div className="mt-24 border-t border-slate-200 pt-8">
          <p className="text-[13px] font-medium text-muted">{t.strip}</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {capabilities.map((name) => (
              <li key={name} className="font-grotesk text-[15px] font-medium text-ink">{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
