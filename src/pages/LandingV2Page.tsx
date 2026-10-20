import { useSearchParams } from 'react-router-dom';
import '../styles/premium-landing.css';
import '../styles/flow-backdrop.css';
import '../styles/landing-hybrid.css';
import { comparisonCopy } from '../content/landingCopy';
import { useLanguage } from '../i18n/LanguageContext';
import SkipLink from '../components/SkipLink';
import FragmentNavigation from '../components/FragmentNavigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Comparison from '../components/Comparison';
import BuiltFor from '../components/BuiltFor';
import PilotInvitation from '../components/PilotInvitation';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import PreviewToolbarV2 from '../components/v2/PreviewToolbarV2';
import HybridJourney from '../components/v2/HybridJourney';
import HybridVideoPlan from '../components/v2/HybridVideoPlan';
import HybridProcessPath from '../components/v2/HybridProcessPath';

export default function LandingV2Page() {
  const [params] = useSearchParams();
  const { language } = useLanguage();
  const studio = params.get('studio') === '1';
  return <div data-client-ready={typeof window !== 'undefined' ? 'true' : 'false'} className="landing-page landing-hybrid relative min-h-dvh">
    <SkipLink />
    <div aria-hidden="true" className="flow-background flow-background-fixed"><div className="cloud-field" /></div>
    <FragmentNavigation />
    <div className="relative z-10"><PreviewToolbarV2 studio={studio} /></div>
    <Navbar motionControl={false} homeHref={language === 'it' ? '/v2#hero' : '/v2?lang=en#hero'} />
    <main id="main-content" className="relative z-10">
      <Hero compact />
      {studio ? <HybridVideoPlan /> : null}
      <HybridProcessPath />
      <Problem />
      <HybridJourney />
      <BuiltFor />
      <details className="hybrid-comparison section-shell">
        <summary>{comparisonCopy[language].tableTitle}</summary>
        <Comparison />
      </details>
      <PilotInvitation />
      <Faq />
      <FinalCTA />
    </main>
    <Footer homePath="/v2" />
  </div>;
}
