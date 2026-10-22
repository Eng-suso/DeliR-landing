import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import LandingV2Page from './pages/LandingV2Page';
import PilotPage from './pages/PilotPage';
import SecurityDataPage from './pages/SecurityDataPage';
import ComparisonSourcesPage from './pages/ComparisonSourcesPage';
import PrivacyPage from './pages/PrivacyPage';
import WaitlistPage from './pages/WaitlistPage';
import DemoPage from './pages/DemoPage';
import NotFoundPage from './pages/NotFoundPage';
import { pilotCaptureReady, waitlistCaptureReady } from './lib/leadCaptureReadiness';
export { pageMetadata, siteRoutes } from './lib/siteMetadata';
export { structuredData } from './lib/structuredData';

// Render the same public components and readiness flags as the browser application.
export function renderPage(pathname: string, language: 'it' | 'en') {
  const page = pathname === '/v2' ? <LandingV2Page /> : pathname === '/' ? <LandingV2Page homePath="/" /> : pathname === '/pilot' ? <PilotPage captureEnabled={pilotCaptureReady} /> : pathname === '/security-data' ? <SecurityDataPage /> : pathname === '/comparison-sources' ? <ComparisonSourcesPage /> : pathname === '/privacy' ? <PrivacyPage /> : pathname === '/waitlist' ? <WaitlistPage captureEnabled={waitlistCaptureReady} /> : pathname === '/demo' ? <DemoPage /> : <NotFoundPage />;
  return renderToString(<StaticRouter location={`${pathname}?lang=${language}`}><LanguageProvider>{page}</LanguageProvider></StaticRouter>);
}
