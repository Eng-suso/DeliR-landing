import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { trackInterestEvent, trackPilotEvent } from '../privacy/analytics';
import { conversationBookingUrl, conversationHref } from '../lib/publicOffer';

export default function PilotFunnelTracking() {
  const { language } = useLanguage();
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.getAttribute('href') === conversationHref(language)) {
        trackInterestEvent(conversationBookingUrl ? 'conversation_booking_clicked' : 'conversation_contact_clicked', language, 'conversation');
        return;
      }
      const target = new URL(anchor.href);
      if (target.origin === location.origin && target.pathname === '/waitlist') {
        trackInterestEvent('interest_cta_clicked', language, anchor.dataset.interestSection || anchor.closest('section')?.id || 'other');
        return;
      }
      if (target.origin !== location.origin || target.pathname !== '/pilot') return;
      trackPilotEvent('pilot_cta_clicked', language, anchor.dataset.pilotSection || anchor.closest('section')?.id || (anchor.closest('header') ? 'navigation' : 'other'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [language]);
  return null;
}
