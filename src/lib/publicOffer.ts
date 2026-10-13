export const publicContactEmail = 'contact@delir.it';

export function projectContactHref(language: 'it' | 'en') {
  const subject = language === 'it' ? 'DeliR — valutazione pilot' : 'DeliR — pilot enquiry';
  const body = language === 'it'
    ? 'Vorrei valutare un pilot DeliR.\n\nProcesso o problema (senza nomi di clienti):\nObiettivo dell’incarico:\nTempistica indicativa:\n\n'
    : 'I would like to discuss a DeliR pilot.\n\nProcess or problem (without client names):\nEngagement objective:\nIndicative timing:\n\n';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Shared between the hero and pilot offer to keep public terms consistent.
export const pilotRiskReversals = {
  it: [
    'Conosci perimetro e prezzo prima di iniziare',
    'Paghi solo quando ogni milestone viene consegnata',
    'Puoi fermarti in qualsiasi momento, senza impegni a lungo termine',
  ],
  en: [
    'Know the scope and price before you start',
    'Pay only when each milestone is delivered',
    'Stop anytime, no long-term commitment',
  ],
} as const;

export const pilotCtaLabel = {
  it: 'Testa DeliR sul tuo progetto',
  en: 'Test DeliR on Your Project',
} as const;

export function pilotApplicationHref(language: 'it' | 'en') {
  return `/pilot${language === 'en' ? '?lang=en' : ''}#application`;
}

export const interestCtaLabel = { it: 'Entra nella lista d’attesa', en: 'Join the waitlist' } as const;
export function productInterestHref(language: 'it' | 'en') {
  return `/waitlist${language === 'en' ? '?lang=en' : ''}`;
}
export function conversationHref(language: 'it' | 'en') {
  if (conversationBookingUrl) return conversationBookingUrl;
  const subject = language === 'it' ? 'DeliR — confronto senza impegno' : 'DeliR — no-obligation conversation';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}`;
}

// A public event link only. Until supplied, the real email contact remains usable.
export function validateConversationBookingUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['calendly.com', 'www.calendly.com'].includes(url.hostname)
      && !url.username && !url.password && !url.port && url.pathname !== '/' ? url.href : null;
  } catch { return null; }
}
export const conversationBookingUrl = validateConversationBookingUrl(import.meta.env.VITE_CONVERSATION_BOOKING_URL?.trim() ?? '');
export function productInterestEmailHref(language: 'it' | 'en') {
  const subject = language === 'it' ? 'DeliR — lista d’attesa' : 'DeliR — waitlist';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}`;
}
