// Shared existing copy: the V2 framework reuses the current landing messaging.

export const heroCopy = {
  it: {
    eyebrow: 'Per consulenti BPM e Operations', first: 'Mappa. Analizza.', second: 'Simula. Migliora.',
    body: 'Ricostruisci i processi del cliente, confronta le alternative e porta raccomandazioni sostenute da evidenze.',
    secondary: 'Vedi il prodotto',
    pilotLead: 'Hai già un progetto reale?',
    pilotAction: 'Avvia un pilot',
    waitlistNote: 'Early access per consulenti e team Operations. Nessun acquisto richiesto.',
  },
  en: {
    eyebrow: 'For BPM and Operations consultants', first: 'Map. Analyze.', second: 'Simulate. Improve.',
    body: 'Reconstruct your client’s processes, compare alternatives, and deliver recommendations backed by evidence.',
    secondary: 'See the product',
    pilotLead: 'Already have a real project?',
    pilotAction: 'Start a pilot',
    waitlistNote: 'Early access for consultants and Operations teams. No purchase required.',
  },
};

export const problemCopy = {
  it: {
    eyebrow: 'Per te, consulente Operations',
    title: 'Il problema non è mappare i processi. È ricostruire la realtà.',
    body: 'Ogni incarico riparte da qui: raccogliere informazioni, rincorrere dettagli mancanti, ricostruire il contesto, mappare l’As-Is e verificare le ipotesi. Poi arriva la parte più difficile: trasformare tutto questo in decisioni che il cliente possa sostenere.',
    chain: [
      ['01', 'Informazioni disperse', 'Documenti, interviste e appunti sono in strumenti diversi. Ritrovare una risposta significa cercare di nuovo.'],
      ['02', 'Evidenze scollegate', 'Le prove restano nei documenti, separate dalle decisioni che dovrebbero sostenere.'],
      ['03', 'Mappe da aggiornare', 'Il processo cambia, ma la mappa resta ferma. Tra progetti e persone, il contesto si perde.'],
      ['04', 'Alternative difficili da confrontare', 'Devi raccomandare un cambiamento senza un confronto chiaro tra le diverse opzioni To-Be.'],
    ],
    caption: 'La competenza non ti manca. È il lavoro intorno alla tua competenza che ti rallenta: ogni ora spesa a ricostruire il contesto è un’ora sottratta al miglioramento del processo.',
  },
  en: {
    eyebrow: 'Dear Operations Consultant',
    title: 'Process Mapping Isn’t the Problem, Reconstructing Reality Is',
    body: 'Every engagement starts with the same work. Collect information. Chase missing details. Rebuild context. Map the As-Is. Validate assumptions. Then the hard part begins: turning all that information into decisions your client can trust.',
    chain: [
      ['01', 'Scattered knowledge', 'Documents, interviews and notes live in different tools. Finding an answer means searching all over again.'],
      ['02', 'Disconnected evidence', 'Evidence stays buried in documents, separated from the decisions it should support.'],
      ['03', 'Outdated process maps', 'The process changes while the map stands still. Context gets lost between projects and people.'],
      ['04', 'Hard-to-compare options', 'You need to recommend a change without a clear comparison of the different To-Be options.'],
    ],
    caption: 'You are not short on expertise. The work around your expertise slows you down. Every hour spent rebuilding context is an hour not spent improving the process.',
  },
} as const;

export const journeyCopy = {
  it: {
    eyebrow: 'La soluzione, nel tuo lavoro',
    title: 'Dalla conoscenza dispersa a raccomandazioni che puoi spiegare.',
    intro: 'DeliR mantiene nello stesso contesto le fonti, l’As-Is da verificare con il cliente e le ipotesi To-Be. Guarda come questo ti aiuta, dall’intervista alla raccomandazione.',
    demo: 'Caso di acquisti indiretti · Azienda, persone e valori dimostrativi',
    modules: [
      { name: 'Evidenze', title: 'Risali alle fonti dietro il processo.', body: 'Apri un’attività BPMN insieme alle evidenze che ne conservano il contesto. Puoi discutere con il cliente da dove viene il modello e cosa resta da verificare.', output: 'Modello, fonti e review nello stesso contesto' },
      { name: 'Lacune', title: 'Scopri cosa le interviste lasciano aperto.', body: 'Una soglia non dichiarata o un passaggio ambiguo resta una domanda da chiarire. Porta le lacune in review prima che diventino assunzioni nel tuo As-Is.', output: 'Informazioni mancanti rese visibili nel discovery' },
      { name: 'Contesto', title: 'Riprendi l’incarico senza ripartire da zero.', body: 'Obiettivo, fonti, decisioni e avanzamento restano nel progetto. Quando torni sul cliente, ritrovi il contesto del lavoro e i punti ancora aperti.', output: 'Contesto dell’incarico conservato nel progetto' },
      { name: 'Decisioni', title: 'Spiega le modifiche che raccomandi.', body: 'Esamina le proposte To-Be sul processo, insieme ai punti da verificare. Discuti le ragioni del cambiamento mantenendo distinte le ipotesi dalle decisioni confermate.', output: 'Proposte di modifica e review sul processo' },
      { name: 'Scenari', title: 'Confronta le opzioni prima di proporre il cambiamento.', body: 'Simula l’As-Is e le ipotesi To-Be. Leggi gli indicatori insieme ai parametri e alle assunzioni: il confronto sostiene la discussione, senza trasformare una simulazione in una promessa di risultato.', output: 'Scenari confrontati con le loro assunzioni' },
    ],
    nav: 'Benefici DeliR', result: 'Cosa ti porti nel lavoro', action: 'Valuta il pilot sul tuo progetto',
    principle: 'Comprendi cosa succede. Valuta cosa potrebbe succedere. Continua a migliorare.',
  },
  en: {
    eyebrow: 'The solution, in your work',
    title: 'Turn scattered knowledge into recommendations you can explain.',
    intro: 'DeliR keeps sources, the As-Is you review with your client, and To-Be hypotheses in one context. See how that supports your work, from interview to recommendation.',
    demo: 'Indirect procurement demo · Fictional company, people and values',
    modules: [
      { name: 'Evidence', title: 'Trace your process back to its sources.', body: 'Open a BPMN activity alongside the evidence that retains its context. Discuss with your client where the model comes from and what still needs verification.', output: 'Model, sources and review in one context' },
      { name: 'Gaps', title: 'Find what process interviews leave unresolved.', body: 'An unstated threshold or an ambiguous handoff stays a question to resolve. Bring gaps into review before they become assumptions in your As-Is.', output: 'Missing information made visible during discovery' },
      { name: 'Context', title: 'Pick up the engagement without starting over.', body: 'Goals, sources, decisions and progress stay in the project. When you return to the client, find the context of your work and the questions still open.', output: 'Engagement context retained in the project' },
      { name: 'Decisions', title: 'Explain the changes you recommend.', body: 'Inspect To-Be proposals on the process alongside points that need verification. Discuss the reasons for change while keeping hypotheses separate from confirmed decisions.', output: 'Proposed changes and review on the process' },
      { name: 'Scenarios', title: 'Compare options before recommending a change.', body: 'Simulate the As-Is and To-Be hypotheses. Read indicators alongside parameters and assumptions: the comparison supports the discussion without turning a simulation into a promise of results.', output: 'Scenarios compared alongside their assumptions' },
    ],
    nav: 'DeliR benefits', result: 'What you take into your work', action: 'Explore a pilot for your project',
    principle: 'Understand what happens. Test what could happen. Keep making it better.',
  },
};

export const comparisonCopy = {
  it: {
    eyebrow: 'Cosa conta nel tuo incarico',
    title: 'Scegli un percorso che puoi spiegare al cliente.',
    intro: 'Strumenti diversi rispondono a esigenze diverse. Confronta le capacità documentate e il lavoro che resta al consulente, in base all’incarico che devi seguire.',
    strengths: 'LucidFlow parte dai documenti e aggiunge analisi economica. PRIME BPM e Bizagi offrono modellazione e simulazione. Visio si concentra sui diagrammi, Miro sulla collaborazione visuale. ChatGPT e Claude aiutano ad analizzare e sintetizzare i documenti.',
    tableTitle: 'Confronta gli strumenti sul percorso consulenziale.',
    feature: 'Capacità nel lavoro del consulente', delir: 'Per il consulente',
    caption: 'Confronto delle capacità per l’analisi di processo',
    demo: 'Demo',
    demoLabel: 'Mostrato nella demo DeliR. Guarda il video',
    cellSources: 'Consulta il criterio e la documentazione di riferimento',
    yes: 'Documentato', partial: 'Parziale', unknown: 'Da verificare',
    legend: '✓ Documentato · ~ Copertura parziale o passaggi manuali · — Da verificare. Ogni simbolo apre le spiegazioni.',
    proof: 'Documentazione pubblica consultata il 21 ottobre 2026. “Da verificare” non significa assente. Piani e configurazioni variano; non abbiamo eseguito test negli account dei competitor. La colonna DeliR rimanda alla demo.',
    reason: 'Porta al cliente il modello e le prove dietro la proposta.',
    reasonBody: 'Con DeliR puoi discutere il processo insieme alle fonti, ai punti aperti e al confronto AS-IS / TO-BE. Questo è il percorso mostrato nella demo.',
    secondary: 'Guarda il percorso completo',
    sources: 'Criteri e documentazione dei prodotti',
  },
  en: {
    eyebrow: 'What matters in your engagement',
    title: 'Choose a workflow you can explain to your client.',
    intro: 'Different tools serve different needs. Compare documented capabilities and the work left to the consultant against the engagement you need to deliver.',
    strengths: 'LucidFlow starts from documents and adds financial analysis. PRIME BPM and Bizagi offer modelling and simulation. Visio focuses on diagrams, Miro on visual collaboration. ChatGPT and Claude help analyse and summarise documents.',
    tableTitle: 'Compare tools against the consulting workflow.',
    feature: 'Capabilities in a consultant’s work', delir: 'For consultants',
    caption: 'Process analysis capability comparison',
    demo: 'Demo',
    demoLabel: 'Shown in the DeliR demo. Watch the video',
    cellSources: 'Read the criterion and reference documentation',
    yes: 'Documented', partial: 'Partial', unknown: 'To verify',
    legend: '✓ Documented · ~ Partial coverage or manual steps · — To verify. Open any symbol for explanations.',
    proof: 'Public documentation reviewed on 21 October 2026. “To verify” does not mean absent. Plans and configurations vary; we have not tested competitor accounts. The DeliR column links to its demo.',
    reason: 'Bring the model and the evidence behind your proposal to the client.',
    reasonBody: 'With DeliR, discuss the process alongside its sources, open questions and AS-IS / TO-BE comparison. This is the workflow shown in the demo.',
    secondary: 'Watch the complete workflow',
    sources: 'Criteria and product documentation',
  },
} as const;

export const pilotCopy = {
  it: {
    eyebrow: 'Pilot a pagamento · per milestone', title: 'Porta un progetto. Mantieni il pieno controllo.',
    body: 'Testa DeliR su un incarico reale per un cliente, con un perimetro e un obiettivo chiari.',
    kickoff: 'Prima di iniziare concordiamo cosa significa avere successo, cosa consegnerà DeliR e come verrà verificata ogni milestone.',
    example: 'Progetto di esempio: acquisti indiretti',
    steps: [
      ['Definisci il progetto', 'Definisci obiettivo, perimetro, fonti disponibili, persone chiave coinvolte e risultati attesi.'],
      ['Comprendi e migliora', 'DeliR ricostruisce l’As-Is dalle evidenze disponibili, individua le informazioni mancanti, sviluppa opzioni To-Be e confronta scenari alternativi.'],
      ['Verifica e decidi', 'Verifica As-Is, opzioni To-Be, risultati degli scenari, evidenze, assunzioni e punti ancora aperti con le persone coinvolte.'],
    ],
    control: 'Il controllo resta a te',
    firstContact: 'Per il primo confronto non servono documenti del cliente.',
    note: 'Porta il progetto, l’obiettivo e la tempistica prevista.',
  },
  en: {
    eyebrow: 'Paid pilot · milestone-based', title: 'Bring one project. Keep full control.',
    body: 'Test DeliR on a real client engagement with a clear scope and objective.',
    kickoff: 'Before kickoff, we agree what success looks like, what DeliR will deliver, and how each milestone will be reviewed.',
    example: 'Example project: indirect procurement',
    steps: [
      ['Define the project', 'Set the objective, scope, available sources, key stakeholders, and expected outcomes.'],
      ['Understand and improve', 'DeliR reconstructs the As-Is from available evidence, finds missing information, develops To-Be options, and compares alternative scenarios.'],
      ['Review and decide', 'Review the As-Is, To-Be options, scenario results, evidence, assumptions, and remaining points with the people involved.'],
    ],
    control: 'You stay in control',
    firstContact: 'No client documents are needed for the first conversation.',
    note: 'Bring the project, the objective, and the expected timing.',
  },
};

export const finalCtaCopy = {
  it: {
    eyebrow: 'Scegli il prossimo passo',
    title: 'Vuoi usare DeliR nel tuo prossimo incarico?',
    intro: 'Entra nella lista d’attesa per l’early access.',
    body: 'Ti contatterò quando potrò aprire l’accesso a nuovi utenti. Se invece hai già un processo o un progetto reale da portare avanti, puoi candidarlo subito per un pilot.',
    pilotLead: 'Hai già un progetto reale?',
    pilotAction: 'Avvia un pilot',
    terms: 'Early access senza acquisto · Pilot separato e su progetto reale',
  },
  en: {
    eyebrow: 'Choose your next step',
    title: 'Want to use DeliR on your next engagement?',
    intro: 'Join the waitlist for early access.',
    body: 'I will contact you when access can open to more users. If you already have a real process or project to work on, you can apply for a pilot now.',
    pilotLead: 'Already have a real project?',
    pilotAction: 'Start a pilot',
    terms: 'Early access with no purchase · Pilot is separate and project-based',
  },
};
