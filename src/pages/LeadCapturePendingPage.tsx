import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LanguageSwitch from '../components/LanguageSwitch';
import SkipLink from '../components/SkipLink';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref, publicContactEmail } from '../lib/publicOffer';

type Props = { kind: 'pilot' | 'waitlist' };

const copy = {
  it: {
    back: 'Torna alla pagina principale',
    eyebrow: 'DeliR · accesso anticipato',
    pilotTitle: 'Le candidature al pilot non sono ancora aperte.',
    waitlistTitle: 'Le iscrizioni agli aggiornamenti non sono ancora aperte.',
    body: 'Stiamo completando il canale di richiesta e l’informativa privacy. Nel frattempo puoi esplorare un caso dimostrativo costruito con schermate del prodotto.',
    action: 'Esplora DeliR',
  },
  en: {
    back: 'Return to the homepage',
    eyebrow: 'DeliR · early access',
    pilotTitle: 'Pilot applications are not open yet.',
    waitlistTitle: 'Product update signups are not open yet.',
    body: 'We are completing the request channel and privacy notice. Meanwhile, explore a demo case using real product screens.',
    action: 'Explore DeliR',
  },
} as const;

export default function LeadCapturePendingPage({ kind }: Props) {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="flex min-h-dvh flex-col bg-[#f2f8ff] text-brand-ink">
      <SkipLink />
      <header className="border-b border-slate-200 bg-white">
        <div className="section-shell flex min-h-20 items-center justify-between gap-4">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-blue"><ArrowLeft aria-hidden="true" className="h-4 w-4" />{t.back}</Link>
          <LanguageSwitch />
        </div>
      </header>
      <main id="main-content" className="section-shell flex flex-1 flex-col justify-center py-20 sm:py-24">
        <p className="landing-eyebrow"><span aria-hidden="true" className="h-px w-7 bg-brand-blue" />{t.eyebrow}</p>
        <h1 className="mt-6 max-w-[47rem] text-balance font-display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">{kind === 'pilot' ? t.pilotTitle : t.waitlistTitle}</h1>
        <p className="mt-7 max-w-[42rem] text-[17px] leading-8 text-slate-600">{t.body}</p>
        <Link to="/" className="btn-primary mt-9 self-start">{t.action}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        <a href={projectContactHref(language)} className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-brand-blue underline underline-offset-4">{publicContactEmail}</a>
      </main>
      <Footer />
    </div>
  );
}
