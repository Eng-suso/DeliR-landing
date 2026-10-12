import { ArrowDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productClips } from '../lib/productClips';
import { pilotCtaLabel, pilotApplicationHref } from '../lib/publicOffer';
import ProductFilm from './ProductFilm';

const copy = {
  it: {
    eyebrow: 'Per consulenti BPM e Operations', first: 'Software di Process Intelligence', second: 'per Operations efficienti ed efficaci.',
    body: 'Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente. DeliR trasforma la conoscenza dispersa in un As-Is verificato, confronta scenari To-Be e migliora continuamente i processi, così puoi fornire raccomandazioni migliori più rapidamente.',
    mobileBody: 'Dalle fonti del cliente a un As-Is da verificare e scenari To-Be da confrontare. Raccomandazioni migliori, senza ricostruire ogni volta il contesto.', secondary: 'Vedi il prodotto',
  },
  en: {
    eyebrow: 'For BPM and Operations consultants', first: 'Process Intelligence Software', second: 'for Efficient and Effective Operations.',
    body: 'Stop spending weeks reconstructing how your client really works. DeliR turns scattered knowledge into a verified As-Is, compares To-Be scenarios, and continuously improves processes so you deliver better recommendations faster.',
    mobileBody: 'Turn client sources into an As-Is to review and To-Be scenarios to compare. Better recommendations, without rebuilding context every time.', secondary: 'See the product',
  },
};

const narration = {
  it: [
    { start: 0, text: 'Dalle informazioni del cliente a un processo chiaro.' },
    { start: 4, text: 'Verifica il modello, insieme alle sue fonti.' },
    { start: 8, text: 'Porta in review ciò che va chiarito.' },
    { start: 12, text: 'Arriva dal cliente con una proposta che puoi spiegare.' },
  ],
  en: [
    { start: 0, text: 'From client information to a clear process.' },
    { start: 4, text: 'Review the model alongside its sources.' },
    { start: 8, text: 'Bring open questions into the review.' },
    { start: 12, text: 'Bring your client a proposal you can explain.' },
  ],
};

export default function Hero() {
  const { language } = useLanguage();
  const t = copy[language];
  return <section id="hero" className="premium-hero bg-white pb-10 pt-10 sm:pb-14 sm:pt-14" aria-labelledby="hero-title">
    <div className="section-shell grid items-center gap-5 sm:gap-10 lg:!max-w-[1600px] lg:grid-cols-[0.7fr_1.3fr] lg:gap-8 xl:gap-10">
      <div className="min-w-0">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title" className="hero-headline mt-3 sm:mt-5 text-balance font-display text-[clamp(2.25rem,4.2vw,3.85rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-brand-ink lg:text-[clamp(2rem,3.2vw,3rem)]"><span className="block">{t.first}</span>{' '}<span className="block text-brand-blue">{t.second}</span></h1>
        <p className="hidden sm:block mt-5 max-w-[36rem] text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{t.body}</p>
        <p className="mt-3 text-base leading-6 text-slate-600 sm:hidden">{t.mobileBody}</p>
        <div className="mt-4 sm:mt-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <a href={pilotApplicationHref(language)} className="btn-primary whitespace-normal rounded-full px-7">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4" /></a>
          <a href="#caso" className="btn-text min-h-11 justify-center text-brand-blue">{t.secondary}<ArrowDown aria-hidden="true" className="size-4" /></a>
        </div>

      </div>
      <div className="hero-visual min-w-0" data-scroll-visual="hero">
        <ProductFilm key={language} clip={productClips.hero} priority minimal narration={narration[language]} />
      </div>
    </div>
  </section>;
}
