import { useSearchParams } from 'react-router-dom';
import '../styles/landing-v2.css';
import SkipLink from '../components/SkipLink';
import FragmentNavigation from '../components/FragmentNavigation';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import NavbarV2 from '../components/v2/NavbarV2';
import HeroV2 from '../components/v2/HeroV2';
import ProblemV2 from '../components/v2/ProblemV2';
import PreviewToolbarV2 from '../components/v2/PreviewToolbarV2';
import { BenefitsV2, ComparisonV2, ContextStripV2, HowItWorksV2, ProofV2 } from '../components/v2/StorySectionsV2';

// Figma B2B V2 sequence, using DeliR's existing tokens, copy and conversion paths.
export default function LandingV2Page() {
  const [params] = useSearchParams();
  const studio = params.get('studio') === '1';
  return <div className="landing-page landing-v2 min-h-dvh font-sans">
    <SkipLink />
    <FragmentNavigation />
    <PreviewToolbarV2 studio={studio} />
    <NavbarV2 />
    <main id="main-content">
      <HeroV2 studio={studio} />
      <ContextStripV2 />
      <ProblemV2 studio={studio} />
      <ProofV2 variant="as-is" studio={studio} />
      <BenefitsV2 studio={studio} />
      <ProofV2 variant="decision" studio={studio} />
      <ComparisonV2 />
      <HowItWorksV2 />
      <Faq />
      <FinalCTA />
    </main>
    <Footer />
  </div>;
}
