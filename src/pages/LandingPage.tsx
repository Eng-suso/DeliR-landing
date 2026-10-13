import '../styles/premium-landing.css';
import ScrollExperience from '../components/ScrollExperience';
import PremiumBackground from '../components/PremiumBackground';
import FragmentNavigation from '../components/FragmentNavigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductInterestSummary from '../components/ProductInterestSummary';
import PilotSummary from '../components/PilotSummary';
import PilotFunnelTracking from '../components/PilotFunnelTracking';
import ProcessBridge from '../components/ProcessBridge';
import Problem from '../components/Problem';
import Journey from '../components/Journey';
import Comparison from '../components/Comparison';
import BuiltFor from '../components/BuiltFor';
import PilotInvitation from '../components/PilotInvitation';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import SkipLink from '../components/SkipLink';
import SmoothScroll from '../components/SmoothScroll';

export default function LandingPage() {
  return (
    <div data-client-ready={typeof window !== 'undefined' ? 'true' : 'false'} className="landing-page relative min-h-screen bg-white">
      <SkipLink />
      <PremiumBackground />
      <SmoothScroll />
      <ScrollExperience />
      <PilotFunnelTracking />
      <FragmentNavigation />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <ProductInterestSummary />
        <ProcessBridge />
        <Problem />
        <Journey />
        <PilotSummary />
        <Comparison />
        <BuiltFor />
        <PilotInvitation />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
