import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Journey from '../components/Journey';
import Differentiation from '../components/Differentiation';
import BuiltFor from '../components/BuiltFor';
import ManagerSwitch from '../components/ManagerSwitch';
import Vision from '../components/Vision';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import PremiumBackground from '../components/PremiumBackground';
import Lenis from 'lenis';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative">
      <PremiumBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Problem />
        <Journey />
        <Differentiation />
        <BuiltFor />
        <ManagerSwitch />
        <Vision />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
