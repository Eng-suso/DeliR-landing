import PremiumBackground from '../components/PremiumBackground';
import SkipLink from '../components/SkipLink';
import NavbarV2 from '../components/v2/NavbarV2';
import HeroV2 from '../components/v2/HeroV2';
import ProblemV2 from '../components/v2/ProblemV2';

// Dev-only preview of the v2 direction, compared side by side with the current landing page.
export default function LandingV2Page() {
  return (
    <div className="relative min-h-dvh font-grotesk text-ink">
      <SkipLink />
      <PremiumBackground />
      <NavbarV2 />
      <main id="main-content" className="relative z-10">
        <HeroV2 />
        <ProblemV2 />
      </main>
    </div>
  );
}
