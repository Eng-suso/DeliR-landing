import { ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { conversationBookingUrl, conversationHref } from '../lib/publicOffer';

export default function FounderConversation() {
  const { language } = useLanguage();
  const it = language === 'it';
  return <section id="conversation" aria-labelledby="conversation-title" className="scroll-mt-24 border-y border-slate-200 bg-brand-light py-12 sm:py-16">
    <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
      <div>
        <p className="landing-eyebrow">{it ? 'Un confronto con chi lo costruisce' : 'A conversation with the person building it'}</p>
        <h2 id="conversation-title" className="landing-title mt-4">{it ? 'Prima di provarlo, vuoi parlarne?' : 'Want to talk before trying it?'}</h2>
        <p className="mt-5 text-base leading-7 text-slate-600">{it ? 'Sono Sohayb e sto costruendo DeliR. Vorrei capire come lavori oggi, dove perdi il contesto dei processi e cosa ti servirebbe per usare il prodotto.' : 'I’m Sohayb, and I’m building DeliR. I’d like to understand how you work today, where process context gets lost, and what you would need to use the product.'}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <MessageCircle aria-hidden="true" className="size-7 text-brand-blue" />
        <p className="mt-4 text-base leading-7 text-slate-600">{it ? 'Puoi chiarire un dubbio o raccontarmi il tuo modo di lavorare, anche se non hai un incarico attivo. Il primo contatto non avvia un pilot e non comporta un acquisto.' : 'Ask a question or tell me how you work, even without an active engagement. An initial conversation does not start a pilot or commit you to a purchase.'}</p>
        <a data-interest-section="conversation" href={conversationHref(language)} className="btn-secondary mt-5 whitespace-normal">{conversationBookingUrl ? (it ? 'Prenota un confronto senza impegno' : 'Book a no-obligation conversation') : (it ? 'Parliamone senza impegno' : 'Talk without obligation')}<ArrowRight aria-hidden="true" className="size-4" /></a>
        <p className="mt-3 text-xs leading-5 text-slate-600">{conversationBookingUrl ? (it ? 'Si apre Calendly per scegliere un orario. ' : 'Opens Calendly to choose a time. ') : (it ? 'Si apre il tuo programma email. ' : 'Opens your email app. ')}{it ? 'Non inviare documenti o dati dei clienti.' : 'Do not send client documents or data.'}</p>
      </div>
    </div>
  </section>;
}
