import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productClips } from '../lib/productClips';
import { projectContactHref } from '../lib/publicOffer';
import ProductFilm from './ProductFilm';

const copy = {
  it: {
    eyebrow: 'Per consulenti BPM e Operations', first: 'Dall’AS-IS al TO-BE.', second: 'Pronto per la decisione.',
    body: 'Porta al process owner una proposta che puoi spiegare e difendere. Con DeliR colleghi le fonti al processo, verifichi il modello e confronti gli scenari prima di raccomandare il cambiamento.',
    primary: 'Parliamo del tuo progetto', secondary: 'Vedi il prodotto',
    terms: ['Pilot a pagamento per milestone', 'Perimetro e criteri concordati', 'Primo contatto senza dati del cliente'],
  },
  en: {
    eyebrow: 'For BPM and Operations consultants', first: 'From AS-IS to TO-BE.', second: 'Ready for the decision.',
    body: 'Bring the process owner a proposal you can explain and defend. With DeliR, connect sources to the process, review the model and compare scenarios before recommending a change.',
    primary: 'Discuss your project', secondary: 'See the product',
    terms: ['Paid pilot by milestone', 'Agreed scope and acceptance criteria', 'No client data at first contact'],
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
  return <section className="premium-hero bg-white pb-10 pt-10 sm:pb-14 sm:pt-14" aria-labelledby="hero-title">
    <div className="section-shell grid items-center gap-10 lg:!max-w-[1600px] lg:grid-cols-[0.7fr_1.3fr] lg:gap-8 xl:gap-10">
      <div className="min-w-0">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title" className="mt-5 text-balance font-display text-[clamp(2.25rem,4.2vw,3.85rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-brand-ink lg:text-[clamp(2rem,3.2vw,3rem)]"><span className="block">{t.first}</span><span className="block text-brand-blue">{t.second}</span></h1>
        <p className="mt-5 max-w-[36rem] text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{t.body}</p>
        <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <a href={projectContactHref(language)} className="btn-primary rounded-full px-7">{t.primary}<ArrowRight aria-hidden="true" className="size-4" /></a>
          <a href="#caso" className="btn-secondary border-brand-blue/25 text-brand-blue">{t.secondary}<ArrowDown aria-hidden="true" className="size-4" /></a>
        </div>
        <ul aria-label={language === 'it' ? 'Condizioni del pilot' : 'Pilot terms'} className="mt-5 grid gap-2">{t.terms.map(item => <li key={item} className="inline-flex items-start gap-1.5 text-xs leading-5 text-slate-600"><Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-blue" />{item}</li>)}</ul>
      </div>
      <div className="hero-visual min-w-0" data-scroll-visual="hero">
        <ProductFilm key={language} clip={productClips.hero} priority minimal narration={narration[language]} />
      </div>
    </div>
  </section>;
}
