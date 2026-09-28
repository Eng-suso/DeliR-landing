import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Vision from '../components/Vision';
import ManagerSwitch from '../components/ManagerSwitch';
import Journey from '../components/Journey';
import Outcomes from '../components/Outcomes';
import Differentiation from '../components/Differentiation';
import BuiltFor from '../components/BuiltFor';
import PilotInvitation from '../components/PilotInvitation';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import PremiumBackground from '../components/PremiumBackground';
import SkipLink from '../components/SkipLink';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent relative">
      <SkipLink />
      <PremiumBackground />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <Problem />
        <Vision />
        <ManagerSwitch />
        <Journey />
        <Outcomes />
        <Differentiation />
        <BuiltFor />
        <PilotInvitation />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
