import { useEffect } from 'react';
import { preload } from 'react-dom';
import { heroPoster, heroPosterSizes, heroPosterSrcSet } from '../lib/heroMedia';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    home: ['DeliR — Fonti, BPMN e scenari per il tuo incarico', 'DeliR collega interviste, evidenze, review BPMN e scenari AS-IS/TO-BE. Valuta un pilot a pagamento per milestone sul tuo progetto di processo.'],
    pilot: ['Pilot DeliR — Milestone, AS-IS e TO-BE', 'Valuta un pilot DeliR a pagamento: perimetro e criteri concordati, milestone AS-IS e TO-BE e consegna al process owner.'],
    waitlist: ['Aggiornamenti DeliR — Contatti', 'Per informazioni sul prodotto DeliR e sul pilot scrivi al team. Le iscrizioni automatiche agli aggiornamenti non sono ancora aperte.'],
    missing: ['Pagina non trovata — DeliR', 'L’indirizzo richiesto non esiste. Torna alla home di DeliR.'],
    privacy: ['Privacy e cookie — DeliR', 'Informazioni sul titolare, sui dati e sulle preferenze cookie di DeliR.'],
  },
  en: {
    home: ['DeliR — Sources, BPMN and scenarios for your engagement', 'DeliR connects interviews, evidence, BPMN review and AS-IS/TO-BE scenarios. Discuss a paid, milestone-based pilot for your process project.'],
    pilot: ['DeliR pilot — Milestones, AS-IS and TO-BE', 'Discuss a paid DeliR pilot with agreed scope, acceptance criteria, AS-IS and TO-BE milestones and handover to the process owner.'],
    waitlist: ['DeliR updates — Contact', 'Contact the team for product and pilot enquiries. Automatic product-update signups are not open yet.'],
    missing: ['Page not found — DeliR', 'The requested address does not exist. Return to the DeliR homepage.'],
    privacy: ['Privacy and cookies — DeliR', 'Information about the controller, data and cookie preferences for DeliR.'],
  },
};

export default function SiteMetadata() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    if (pathname === '/') preload(heroPoster, { as: 'image', imageSrcSet: heroPosterSrcSet, imageSizes: heroPosterSizes, fetchPriority: 'high' });
    const key = pathname === '/' ? 'home' : pathname === '/pilot' ? 'pilot' : pathname === '/waitlist' ? 'waitlist' : pathname === '/privacy' ? 'privacy' : 'missing';
    const [title, description] = copy[language][key];
    document.title = title;
    const setMeta = (attribute: 'name' | 'property', name: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.content = content;
    };
    setMeta('name', 'description', description);
    setMeta('name', 'robots', key === 'missing' || pathname === '/waitlist' || pathname === '/privacy' ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', language === 'it' ? 'it_IT' : 'en_US');
    const canonical = `https://delir.it${pathname}${language === 'en' ? '?lang=en' : ''}`;
    setMeta('property', 'og:url', canonical);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); }
    link.href = canonical;
    for (const locale of ['it', 'en']) {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[hreflang="${locale}"]`);
      if (!alternate) { alternate = document.createElement('link'); alternate.rel = 'alternate'; alternate.hreflang = locale; document.head.append(alternate); }
      alternate.href = `https://delir.it${pathname}${locale === 'en' ? '?lang=en' : ''}`;
    }
  }, [language, pathname]);
  return null;
}
