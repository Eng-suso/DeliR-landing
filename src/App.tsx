import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import { pilotCaptureReady, waitlistCaptureReady } from './lib/leadCaptureReadiness';
import SiteMetadata from './components/SiteMetadata';
import LandingPage from './pages/LandingPage';
import ConsentManager from './components/ConsentManager';

// The primary conversion page is critical content: avoid a second JS/CSS
// waterfall before the hero. Secondary routes still load on demand.
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'));
const PilotPage = lazy(() => import('./pages/PilotPage'));
const SecurityDataPage = lazy(() => import('./pages/SecurityDataPage'));
const ComparisonSourcesPage = lazy(() => import('./pages/ComparisonSourcesPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const EnterpriseReadinessPage = import.meta.env.DEV ? lazy(() => import('./pages/EnterpriseReadinessPage')) : null;
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// Dev-only preview of the v2 direction; eliminated from production builds.
const LandingV2Page = import.meta.env.DEV ? lazy(() => import('./pages/LandingV2Page')) : null;

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <SiteMetadata />
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-dvh bg-[#f2f8ff]" role="status" aria-label="Loading DeliR" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pilot" element={<PilotPage captureEnabled={pilotCaptureReady} />} />
            <Route path="/waitlist" element={<WaitlistPage captureEnabled={waitlistCaptureReady} />} />
            <Route path="/security-data" element={<SecurityDataPage />} />
            <Route path="/comparison-sources" element={<ComparisonSourcesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {EnterpriseReadinessPage ? <Route path="/enterprise-readiness" element={<EnterpriseReadinessPage />} /> : null}
            {LandingV2Page ? <Route path="/v2" element={<LandingV2Page />} /> : null}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <ConsentManager />
      </LanguageProvider>
    </Router>
  );
}
