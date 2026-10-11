type Localized = { it: string; en: string };
export const comparisonSources = {
  chatgpt: { label: 'ChatGPT · Files & analysis', href: 'https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt' },
  claude: { label: 'Claude · Projects', href: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
  artifacts: { label: 'Claude · Artifacts', href: 'https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them' },
  celonis: { label: 'Celonis · Process Management', href: 'https://www.celonis.com/platform/process-management' },
  celonisSimulation: { label: 'Celonis · Simulation', href: 'https://www.celonis.com/blog/simulation-analysis-in-process-mining-definition-applications-and-techniques' },
  signavio: { label: 'SAP Signavio · Process Modeler', href: 'https://www.signavio.com/products/process-modeler/' },
  signavioSimulation: { label: 'SAP Signavio · Simulation', href: 'https://www.signavio.com/video/signavio-tutorial-videos/sap-signavio-process-manager-simulations/' },
  camunda: { label: 'Camunda · Web Modeler', href: 'https://docs.camunda.io/docs/components/modeler/web-modeler/' },
  camundaReview: { label: 'Camunda · Review', href: 'https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-pipeline/' },
  camundaCopilot: { label: 'Camunda · BPMN Copilot', href: 'https://docs.camunda.io/docs/components/early-access/alpha/bpmn-copilot/' },
  camundaTest: { label: 'Camunda · Process testing', href: 'https://docs.camunda.io/docs/components/hub/workspace/modeler/validation/test-your-process/' },
  processmind: { label: 'ProcessMind · Start with a process', href: 'https://processmind.com/resources/docs/getting-started/start-with-process' },
  processmindReview: { label: 'ProcessMind · Documentation & reviews', href: 'https://processmind.com/platform/process-documentation' },
  processmindSimulation: { label: 'ProcessMind · AI & simulation', href: 'https://processmind.com/platform/ai-driven-process-management' },
} as const;
export const comparisonProducts = [
  { id: 'processmind', name: 'ProcessMind', category: { it: 'Mining e simulazione', en: 'Mining & simulation' } },
  { id: 'celonis', name: 'Celonis', category: { it: 'Process intelligence', en: 'Process intelligence' } },
  { id: 'signavio', name: 'SAP Signavio', category: { it: 'Process transformation', en: 'Process transformation' } },
  { id: 'camunda', name: 'Camunda', category: { it: 'Web Modeler', en: 'Web Modeler' } },
  { id: 'assistants', name: 'ChatGPT / Claude', category: { it: 'Chat e artifact standard', en: 'Standard chat & artifacts' } },
] as const;
type ProductId = typeof comparisonProducts[number]['id'];
type SourceId = keyof typeof comparisonSources;
export type ComparisonStatus = 'yes' | 'partial' | 'no';
export type ComparisonCell = { status: ComparisonStatus; sources: SourceId[] };
export type ComparisonRow = { id: string; label: Localized; definition: Localized; evidence: string; cells: Record<ProductId, ComparisonCell> };
const cell = (status: ComparisonStatus, ...sources: SourceId[]): ComparisonCell => ({ status, sources });
// Ratings supplied by the product owner on 2026-10-09, not independent test results.
// Official documentation links provide product context, not proof of every rating.
export const comparisonRows: ComparisonRow[] = [
  {
    id: 'bpmn',
    label: { it: 'Costruire l’AS-IS da documenti e interviste', en: 'Build the AS-IS from documents and interviews' },
    definition: { it: 'Ricostruire il processo attuale partendo da documenti e interviste, mantenendo il contesto necessario alla revisione del modello.', en: 'Reconstruct the current process from documents and interviews, retaining the context needed to review the model.' },
    evidence: '#scene-fonti-e-affermazioni',
    cells: { processmind: cell('partial', 'processmind', 'processmindSimulation'), celonis: cell('no', 'celonis'), signavio: cell('partial', 'signavio'), camunda: cell('no', 'camunda', 'camundaCopilot'), assistants: cell('partial', 'chatgpt', 'claude') },
  },
  {
    id: 'memory',
    label: { it: 'Mantenere memoria del cliente e dell’incarico dall’apertura del progetto fino alla proposta finale', en: 'Retain client and engagement context from project kickoff to the final proposal' },
    definition: { it: 'Conservare fonti, decisioni e contesto dell’incarico in un percorso continuo, dalla raccolta iniziale alla proposta finale.', en: 'Retain sources, decisions and engagement context in a continuous workflow from initial discovery to the final proposal.' },
    evidence: '#scene-memoria',
    cells: { processmind: cell('partial', 'processmindReview'), celonis: cell('partial', 'celonis'), signavio: cell('partial', 'signavio'), camunda: cell('no', 'camunda'), assistants: cell('partial', 'claude') },
  },
  {
    id: 'review',
    label: { it: 'Trovare informazioni mancanti prima di approvare l’AS-IS', en: 'Find missing information before approving the AS-IS' },
    definition: { it: 'Portare in review le informazioni mancanti nelle fonti prima di considerare il processo attuale pronto per l’approvazione.', en: 'Bring missing information in the sources into review before considering the current process ready for approval.' },
    evidence: '#scene-lacuna-aperta',
    cells: { processmind: cell('partial', 'processmindReview'), celonis: cell('no', 'celonis'), signavio: cell('partial', 'signavio'), camunda: cell('partial', 'camundaReview', 'camundaTest'), assistants: cell('partial', 'chatgpt', 'claude') },
  },
  {
    id: 'evidence',
    label: { it: 'Risalire da un’attività alla prova da cui deriva', en: 'Trace an activity back to its supporting evidence' },
    definition: { it: 'Collegare un’attività modellata alla fonte documentale o all’intervista da cui è stata ricostruita, per poterla spiegare e verificare.', en: 'Link a modeled activity to the document or interview it was reconstructed from, so it can be explained and reviewed.' },
    evidence: '#scene-evidenze-sul-processo',
    cells: { processmind: cell('partial', 'processmindReview'), celonis: cell('no', 'celonis'), signavio: cell('partial', 'signavio'), camunda: cell('partial', 'camunda', 'camundaReview'), assistants: cell('no', 'chatgpt', 'claude') },
  },
  {
    id: 'scenarios',
    label: { it: 'Simulare quantitativamente il TO-BE prima di implementarlo', en: 'Simulate the TO-BE quantitatively before implementation' },
    definition: { it: 'Simulare il processo proposto con parametri operativi e confrontare i risultati prima dell’implementazione. Il criterio riguarda un simulatore di processo integrato, non calcoli o codice da costruire e validare separatamente.', en: 'Simulate the proposed process with operating parameters and compare results before implementation. This criterion concerns an integrated process simulator, rather than calculations or code to build and validate separately.' },
    evidence: '#scene-confronto',
    cells: { processmind: cell('yes', 'processmindSimulation'), celonis: cell('yes', 'celonisSimulation'), signavio: cell('yes', 'signavioSimulation'), camunda: cell('no', 'camundaTest'), assistants: cell('no', 'chatgpt', 'artifacts') },
  },
  {
    id: 'redesign',
    label: { it: 'Collegare evidenza → problema → modifica → processo migliorato', en: 'Connect evidence → problem → change → improved process' },
    definition: { it: 'Seguire la motivazione del redesign dalla fonte iniziale al problema individuato, alla modifica proposta e al processo TO-BE.', en: 'Follow the rationale for redesign from the original source to the identified problem, proposed change and TO-BE process.' },
    evidence: '#scene-ipotesi-to-be',
    cells: { processmind: cell('partial', 'processmindReview', 'processmindSimulation'), celonis: cell('partial', 'celonis'), signavio: cell('partial', 'signavio'), camunda: cell('no', 'camunda'), assistants: cell('partial', 'chatgpt', 'claude') },
  },
];
