export const publicContactEmail = 'delir.team@gmail.com';

export function projectContactHref(language: 'it' | 'en') {
  const subject = language === 'it' ? 'DeliR — valutazione pilot' : 'DeliR — pilot enquiry';
  const body = language === 'it'
    ? 'Vorrei valutare un pilot DeliR.\n\nProcesso o problema (senza nomi di clienti):\nObiettivo dell’incarico:\nTempistica indicativa:\n\n'
    : 'I would like to discuss a DeliR pilot.\n\nProcess or problem (without client names):\nEngagement objective:\nIndicative timing:\n\n';
  return `mailto:${publicContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
