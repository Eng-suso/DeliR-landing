import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { trackPilotEvent } from '../privacy/analytics';

export default function PilotFunnelTracking() {
  const { language } = useLanguage();
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const target = new URL(anchor.href);
      if (target.origin !== location.origin || target.pathname !== '/pilot') return;
      trackPilotEvent('pilot_cta_clicked', language, anchor.closest('section')?.id || (anchor.closest('header') ? 'navigation' : 'other'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [language]);
  return null;
}
