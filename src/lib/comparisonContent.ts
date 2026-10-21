type Localized = { it: string; en: string };
export const comparisonSources = {
  visio: { label: 'Microsoft · Visio process diagrams', href: 'https://support.microsoft.com/en-us/visio/process-diagrams-in-visio' },
  visioLinks: { label: 'Microsoft · Shape hyperlinks', href: 'https://support.microsoft.com/en-us/visio/video-add-hyperlinks' },
  visioValidation: { label: 'Microsoft · Diagram validation', href: 'https://support.microsoft.com/en-us/visio/validate-a-structured-diagram' },
  bizagi: { label: 'Bizagi · Modeler', href: 'https://www.bizagi.com/en/platform/modeler' },
  bizagiSimulation: { label: 'Bizagi · Simulation', href: 'https://help.bizagi.com/platform/en/simulation.htm' },
  bizagiAttributes: { label: 'Bizagi · Extended attributes', href: 'https://help.bizagi.com/platform/en/extended_attributes_type.htm' },
  bizagiModels: { label: 'Bizagi · Models and revisions', href: 'https://help.bizagi.com/platform/en/exchanging_processes.htm' },
  miro: { label: 'Miro · BPMN', href: 'https://miro.com/process-mapping/' },
  miroBpmn: { label: 'Miro · BPMN collaboration', href: 'https://miro.com/diagramming/bpmn-diagram/' },
  chatgpt: { label: 'ChatGPT · Files & analysis', href: 'https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt' },
  chatgptProjects: { label: 'ChatGPT · Projects', href: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt' },
  claude: { label: 'Claude · Projects', href: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
  prime: { label: 'PRIME BPM · Platform', href: 'https://www.primebpm.com/us/business-process-management-software' },
  lucidflow: { label: 'LucidFlow · FAQ', href: 'https://lucidflow.ai/faq' },
  lucidflowProduct: { label: 'LucidFlow · Product', href: 'https://lucidflow.ai/' },
} as const;
export const comparisonProducts = [
  { id: 'lucidflow', name: 'LucidFlow' },
  { id: 'prime', name: 'PRIME BPM' },
  { id: 'bizagi', name: 'Bizagi' },
  { id: 'visio', name: 'Visio' },
  { id: 'miro', name: 'Miro' },
  { id: 'assistants', name: 'ChatGPT / Claude' },
] as const;
type ProductId = typeof comparisonProducts[number]['id'];
type SourceId = keyof typeof comparisonSources;
export type ComparisonStatus = 'yes' | 'partial' | 'unknown';
export type ComparisonCell = { status: ComparisonStatus; sources: SourceId[] };
export type ComparisonRow = { id: string; label: Localized; definition: Localized; evidence: string; cells: Record<ProductId, ComparisonCell> };
const ratings = (visio: ComparisonStatus, bizagi: ComparisonStatus, miro: ComparisonStatus, assistants: ComparisonStatus, prime: ComparisonStatus, lucidflow: ComparisonStatus): ComparisonRow['cells'] => ({
  visio: { status: visio, sources: ['visio', 'visioLinks', 'visioValidation'] },
  bizagi: { status: bizagi, sources: ['bizagi', 'bizagiSimulation', 'bizagiAttributes', 'bizagiModels'] },
  miro: { status: miro, sources: ['miro', 'miroBpmn'] },
  assistants: { status: assistants, sources: ['chatgpt', 'chatgptProjects', 'claude'] },
  prime: { status: prime, sources: ['prime'] },
  lucidflow: { status: lucidflow, sources: ['lucidflow', 'lucidflowProduct'] },
});
export const comparisonProductStrengths: Record<ProductId, Localized> = {
  lucidflow: { it: 'Dai documenti a BPMN, analisi dei costi e piano di trasformazione AI.', en: 'Documents to BPMN, cost analysis and an AI transformation plan.' },
  prime: { it: 'Modellazione, analisi, simulazione e monitoraggio dei processi.', en: 'Process modelling, analysis, simulation and monitoring.' },
  bizagi: { it: 'Modellazione BPMN, documentazione, revisioni e simulazione BPSim.', en: 'BPMN modelling, documentation, revisions and BPSim simulation.' },
  visio: { it: 'Diagrammi di processo, notazione BPMN e validazione grafica secondo il piano.', en: 'Process diagrams, BPMN notation and diagram validation depending on plan.' },
  miro: { it: 'Mappatura da appunti con AI e collaborazione visuale sullo stesso canvas.', en: 'AI mapping from notes and visual collaboration on a shared canvas.' },
  assistants: { it: 'Analisi e sintesi dei documenti, con file e conversazioni organizzati in progetti.', en: 'Document analysis and synthesis, with project files and conversations.' },
};
// Public vendor documentation reviewed on 2026-10-21, not account-level testing.
// Partial is an interpretation of the described scope; unknown never means absent.
export const comparisonRows: ComparisonRow[] = [
  {
    id: 'bpmn',
    label: { it: 'Da documenti e interviste a un As-Is strutturato', en: 'From documents and interviews to a structured As-Is' },
    definition: { it: 'Ricostruire il processo attuale dalle fonti, con un modello strutturato da sottoporre a review.', en: 'Reconstruct the current process from sources, with a structured model ready for review.' },
    evidence: '#scene-evidenze',
    cells: ratings('partial', 'partial', 'yes', 'partial', 'partial', 'yes'),
  },
  {
    id: 'review',
    label: { it: 'Trova lacune e ambiguità prima di chiudere l’As-Is', en: 'Find gaps and ambiguities before finalising the As-Is' },
    definition: { it: 'Distinguere ambiguità nelle fonti, problemi del diagramma e review manuale. LucidFlow documenta domande sulle fonti ambigue; la validazione Visio riguarda le regole grafiche. Analisi delle inefficienze e review collaborativa coprono una parte del criterio.', en: 'Distinguish source ambiguity, diagram issues and manual review. LucidFlow documents questions about ambiguous sources; Visio validation checks diagram rules. Inefficiency analysis and collaborative review cover part of this criterion.' },
    evidence: '#scene-lacune',
    cells: ratings('partial', 'unknown', 'partial', 'partial', 'partial', 'yes'),
  },
  {
    id: 'evidence',
    label: { it: 'Risalire da ogni attività alla fonte che la supporta', en: 'Trace each activity back to its supporting source' },
    definition: { it: 'Verificare il collegamento attività-fonte. Visio e Bizagi permettono link o allegati; Miro e gli assistenti conservano il contesto. Queste capacità aiutano, ma non equivalgono a una citazione verificata per ogni attività. Quest’ultimo percorso non è stato verificato per LucidFlow e PRIME BPM.', en: 'Review activity-to-source links. Visio and Bizagi support links or attachments; Miro and assistants retain context. These help, but do not establish verified citations for every activity. That specific workflow was not verified for LucidFlow or PRIME BPM.' },
    evidence: '#scene-evidenze',
    cells: ratings('partial', 'partial', 'partial', 'partial', 'unknown', 'unknown'),
  },
  {
    id: 'memory',
    label: { it: 'Memoria strutturata di fonti, decisioni e cambiamenti dell’incarico', en: 'Structured memory of engagement sources, decisions and changes' },
    definition: { it: 'Conservare il contesto dell’incarico. Revisioni e allegati Bizagi, audit trail e commenti PRIME BPM, canvas Miro, progetti degli assistenti e processi salvati LucidFlow coprono parti di questa esigenza. Il registro delle decisioni e i collegamenti tra fonti restano da valutare nel proprio uso.', en: 'Retain engagement context. Bizagi revisions and attachments, PRIME BPM audit trails and comments, Miro canvases, assistant projects and saved LucidFlow processes cover parts of this need. Assess decision records and source relationships for your own use.' },
    evidence: '#scene-contesto',
    cells: ratings('partial', 'partial', 'partial', 'partial', 'partial', 'partial'),
  },
  {
    id: 'scenarios',
    label: { it: 'Simulare quantitativamente alternative To-Be prima di implementarle', en: 'Quantitatively simulate To-Be alternatives before implementation' },
    definition: { it: 'Bizagi e PRIME BPM documentano la simulazione. LucidFlow documenta stime di costi e ROI prima/dopo: utili, ma non una verifica di simulazione operativa. ChatGPT esegue analisi con codice, il cui modello va costruito e verificato. Un motore quantitativo nativo non è stato verificato per Visio e Miro.', en: 'Bizagi and PRIME BPM document simulation. LucidFlow documents before/after cost and ROI estimates, which do not establish operational simulation. ChatGPT runs code-based analysis whose model must be built and reviewed. A native quantitative engine was not verified for Visio or Miro.' },
    evidence: '#scene-scenari',
    cells: ratings('unknown', 'yes', 'unknown', 'partial', 'yes', 'partial'),
  },
  {
    id: 'redesign',
    label: { it: 'Collegare evidenza → problema → modifica → To-Be mantenendo il perché', en: 'Connect evidence → problem → change → To-Be while retaining the rationale' },
    definition: { it: 'Conservare il ragionamento dietro una proposta. Piani To-Be, documentazione, collegamenti e review collaborativa sono contributi utili. La catena completa e verificabile dalla fonte alla decisione va valutata: non viene attribuita automaticamente a nessuno di questi strumenti.', en: 'Retain a proposal’s rationale. To-Be plans, documentation, links and collaborative review all contribute. Assess the complete, verifiable source-to-decision chain; it is not automatically attributed to these tools.' },
    evidence: '#scene-decisioni',
    cells: ratings('partial', 'partial', 'partial', 'partial', 'partial', 'partial'),
  },
  {
    id: 'workflow',
    label: { it: 'BPMN come parte del workflow', en: 'BPMN as part of the workflow' },
    definition: { it: 'Distinguere notazione grafica, modellatore e motore di esecuzione. Visio, Bizagi, Miro, PRIME BPM e LucidFlow documentano BPMN con capacità diverse. Per gli assistenti, analisi e codice non equivalgono a un modellatore BPMN nativo verificato. Piani e disponibilità variano.', en: 'Distinguish graphical notation, modelling and execution. Visio, Bizagi, Miro, PRIME BPM and LucidFlow document different BPMN capabilities. For assistants, analysis and code do not establish a verified native BPMN modeller. Plans and availability vary.' },
    evidence: '#scene-evidenze',
    cells: ratings('yes', 'yes', 'yes', 'partial', 'yes', 'yes'),
  },
];
