export const publicContactEmail = 'contact@delir.it';

export function projectContactHref(language: 'it' | 'en') {
  const subject = language === 'it' ? 'DeliR — valutazione pilot' : 'DeliR — pilot enquiry';
  const body = language === 'it'
    ? 'Vorrei valutare un pilot DeliR.\n\nProcesso o problema (senza nomi di clienti):\nObiettivo dell’incarico:\nTempistica indicativa:\n\n'
    : 'I would like to discuss a DeliR pilot.\n\nProcess or problem (without client names):\nEngagement objective:\nIndicative timing:\n\n';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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

export const interestCtaLabel = {
  it: 'Entra nella lista d’attesa',
  en: 'Join the waitlist',
} as const;

export const waitlistRiskReversals = {
  it: ['Iscrizione gratuita', 'Senza impegno', 'Nessuna carta'],
  en: ['Free signup', 'No commitment', 'No card required'],
} as const;

export function productInterestHref(language: 'it' | 'en') {
  return `/waitlist${language === 'en' ? '?lang=en' : ''}`;
}

export function productInterestEmailHref(language: 'it' | 'en') {
  const subject = language === 'it' ? 'DeliR — lista d’attesa' : 'DeliR — waitlist';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}`;
}
