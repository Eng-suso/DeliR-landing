import { useSearchParams } from 'react-router-dom';
import '../styles/premium-landing.css';
import '../styles/flow-backdrop.css';
import '../styles/landing-hybrid.css';
import { hybridExperience } from '../content/hybridExperience';
import { useLanguage } from '../i18n/LanguageContext';
import SkipLink from '../components/SkipLink';
import FragmentNavigation from '../components/FragmentNavigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HybridProblem from '../components/v2/HybridProblem';
import Comparison from '../components/Comparison';
import BuiltFor from '../components/BuiltFor';
import PilotInvitation from '../components/PilotInvitation';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import PreviewToolbarV2 from '../components/v2/PreviewToolbarV2';
import ProductVideos from '../components/v2/ProductVideos';
import HybridProcessPath from '../components/v2/HybridProcessPath';
import V2Motion from '../components/v2/V2Motion';
import SmoothScroll from '../components/SmoothScroll';

export default function LandingV2Page({ homePath = '/v2' }: { homePath?: '/' | '/v2' }) {
  const [params] = useSearchParams();
  const { language } = useLanguage();
  const studio = params.get('studio') === '1';
  return <div data-client-ready={typeof window !== 'undefined' ? 'true' : 'false'} className="landing-page landing-hybrid relative min-h-dvh">
    <SkipLink />
    <SmoothScroll controlledAnchors />
    <FragmentNavigation smooth />
    <V2Motion />
    {studio ? <div className="relative z-10"><PreviewToolbarV2 /></div> : null}
    <Navbar motionControl={false} readingMode homeHref={`${homePath}${language === 'it' ? '' : '?lang=en'}#hero`} />
    <main id="main-content" className="relative z-10">
      <Hero compact subheadline={hybridExperience[language].subheadline} benefits={hybridExperience[language].benefits} />
      <HybridProcessPath />
      <HybridProblem />
      <ProductVideos />
      <BuiltFor />
      <Comparison />
      <PilotInvitation />
      <Faq />
      <FinalCTA />
    </main>
    <Footer homePath={homePath} />
  </div>;
}
