export const metadataCopy = {
  it: {
    home: ['DeliR | Process Intelligence per consulenti BPM e Operations', 'Collega documenti e interviste alle evidenze, ricostruisci l’As-Is e confronta le ipotesi To-Be. Segnala il tuo interesse a provare DeliR nel tuo lavoro.'],
    pilot: ['Pilot DeliR — Milestone, AS-IS e TO-BE', 'Valuta un pilot DeliR a pagamento: perimetro e criteri concordati, milestone AS-IS e TO-BE e consegna al process owner.'],
    waitlist: ['Prova DeliR — Richiesta di accesso', 'Segnala il tuo interesse a provare DeliR e indica il tipo di attività. La richiesta non comporta acquisti e non dà accesso immediato.'],
    missing: ['Pagina non trovata — DeliR', 'L’indirizzo richiesto non esiste. Torna alla home di DeliR.'],
    comparison: ['Criteri del confronto — DeliR', 'Ambito, criteri e documentazione di riferimento per il confronto degli strumenti di analisi di processo.'],
    security: ['Sicurezza e dati — DeliR', 'Hosting, accessi, AI e gestione dei dati: cosa definire prima di un pilot DeliR con dati reali.'],
    privacy: ['Privacy e cookie — DeliR', 'Informazioni sul titolare, sui dati e sulle preferenze cookie di DeliR.'],
  },
  en: {
    home: ['DeliR | Process Intelligence for BPM & Operations Consultants', 'Connect documents and interviews to evidence, reconstruct the As-Is and compare To-Be hypotheses. Tell us you would like to try DeliR in your work.'],
    pilot: ['DeliR pilot — Milestones, AS-IS and TO-BE', 'Discuss a paid DeliR pilot with agreed scope, acceptance criteria, AS-IS and TO-BE milestones and handover to the process owner.'],
    waitlist: ['Try DeliR — Access request', 'Tell us you would like to try DeliR and indicate your practice type. A request does not commit you to a purchase or grant immediate access.'],
    missing: ['Page not found — DeliR', 'The requested address does not exist. Return to the DeliR homepage.'],
    comparison: ['Comparison criteria — DeliR', 'Scope, criteria and reference documentation for the process analysis tool comparison.'],
    security: ['Security & Data — DeliR', 'Hosting, access, AI and data handling: what to define before a DeliR pilot with real data.'],
    privacy: ['Privacy and cookies — DeliR', 'Information about the controller, data and cookie preferences for DeliR.'],
  },
};

export const siteRoutes = ['/', '/pilot', '/security-data', '/comparison-sources', '/privacy', '/waitlist'] as const;
export function pageMetadata(pathname: string, language: 'it' | 'en') {
  const key = pathname === '/' ? 'home' : pathname === '/pilot' ? 'pilot' : pathname === '/waitlist' ? 'waitlist' : pathname === '/privacy' ? 'privacy' : pathname === '/security-data' ? 'security' : pathname === '/comparison-sources' ? 'comparison' : 'missing';
  const [title, description] = metadataCopy[language][key];
  return { title, description, key, robots: key === 'missing' || key === 'waitlist' || key === 'privacy' ? 'noindex, follow' : 'index, follow', canonical: `https://delir.it${pathname}${language === 'en' ? '?lang=en' : ''}` };
}
