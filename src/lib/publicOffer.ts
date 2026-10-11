export const publicContactEmail = 'delir.team@gmail.com';

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
