import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { ProductVideoDescription, ProductVideoPlayer } from '../components/ProductVideoPlayer';
import { formatSeconds, walkthroughVideo } from '../content/productVideos';
import { useLanguage } from '../i18n/LanguageContext';
import { pilotApplicationHref, productInterestHref } from '../lib/publicOffer';
import '../styles/premium-landing.css';

/**
 * The waitlist reward: the full product demo, reached from the link in the
 * welcome email. Not linked from the site and not indexed.
 */
export default function DemoPage() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <div className="offer-page flex min-h-dvh flex-col bg-brand-light text-brand-ink">
    <SkipLink />
    <header className="border-b border-slate-200 bg-white"><div className="section-shell flex min-h-20 items-center justify-between gap-4">
      <Link to={it ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-blue"><ArrowLeft aria-hidden="true" className="size-4" />{it ? 'Torna a DeliR' : 'Back to DeliR'}</Link>
      <LanguageSwitch />
    </div></header>
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <p className="landing-eyebrow">{it ? 'Riservato alla lista d’attesa' : 'For the waitlist'}</p>
      <h1 className="landing-title mt-4">{it ? `La demo completa di DeliR (${formatSeconds(walkthroughVideo.seconds)})` : `The full DeliR demo (${formatSeconds(walkthroughVideo.seconds)})`}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{it ? 'Grazie per esserti iscritto. Ecco tutto il percorso del prodotto in un’unica registrazione: dalle interviste del cliente al processo As-Is con le fonti, alla simulazione con i KPI, fino alla consegna al process owner. Video senza audio, sul caso dimostrativo.' : 'Thanks for signing up. Here is the whole product path in one recording: from client interviews to the sourced As-Is process, the simulation with its KPIs and the handover to the process owner. Silent video, demo case.'}</p>
      <ProductVideoPlayer video={walkthroughVideo} page="demo" />
      <ProductVideoDescription video={walkthroughVideo} />
      <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-base font-medium leading-7">{it ? 'Hai già un progetto o un processo reale su cui vuoi lavorare?' : 'Already have a real project or process you want to work on?'}</p>
        <a data-pilot-section="demo" href={pilotApplicationHref(language)} className="btn-primary whitespace-normal">{it ? 'Valuta un pilot' : 'Explore a pilot'}<ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
      <p className="mt-6 text-sm leading-6 text-slate-600">{it ? 'Ti hanno girato questo link? ' : 'Someone shared this link with you? '}<a href={productInterestHref(language)} className="font-semibold text-brand-blue underline underline-offset-4">{it ? 'Entra anche tu nella lista d’attesa' : 'Join the waitlist too'}</a>.</p>
    </main><Footer />
  </div>;
}
