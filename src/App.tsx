/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import ScrollToTop from './components/ScrollToTop';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'));
const PilotPage = lazy(() => import('./pages/PilotPage'));
const EnterpriseReadinessPage = lazy(() => import('./pages/EnterpriseReadinessPage'));

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-dvh bg-[#FAFAF8]" role="status" aria-label="Loading DeliR" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pilot" element={<PilotPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/enterprise-readiness" element={<EnterpriseReadinessPage />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

