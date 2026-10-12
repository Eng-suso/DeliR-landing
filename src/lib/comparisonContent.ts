type Localized = { it: string; en: string };
export const comparisonSources = {
  visio: { label: 'Microsoft · Visio process diagrams', href: 'https://support.microsoft.com/en-us/visio/process-diagrams-in-visio' },
  bizagi: { label: 'Bizagi · Modeler', href: 'https://www.bizagi.com/en/platform/modeler' },
  bizagiSimulation: { label: 'Bizagi · Simulation', href: 'https://help.bizagi.com/platform/en/simulation.htm' },
  miro: { label: 'Miro · BPMN', href: 'https://miro.com/process-mapping/' },
  chatgpt: { label: 'ChatGPT · Files & analysis', href: 'https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt' },
  claude: { label: 'Claude · Projects', href: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
  prime: { label: 'PRIME BPM · Platform', href: 'https://www.primebpm.com/us/business-process-management-software' },
  lucidflow: { label: 'LucidFlow · FAQ', href: 'https://lucidflow.ai/faq' },
} as const;
export const comparisonProducts = [
  { id: 'visio', name: 'Visio' },
  { id: 'bizagi', name: 'Bizagi' },
  { id: 'miro', name: 'Miro' },
  { id: 'assistants', name: 'ChatGPT / Claude' },
  { id: 'prime', name: 'PRIME BPM' },
  { id: 'lucidflow', name: 'LucidFlow' },
] as const;
type ProductId = typeof comparisonProducts[number]['id'];
type SourceId = keyof typeof comparisonSources;
export type ComparisonStatus = 'yes' | 'no';
export type ComparisonCell = { status: ComparisonStatus; sources: SourceId[] };
export type ComparisonRow = { id: string; label: Localized; definition: Localized; evidence: string; cells: Record<ProductId, ComparisonCell> };
const ratings = (visio: ComparisonStatus, bizagi: ComparisonStatus, miro: ComparisonStatus, assistants: ComparisonStatus, prime: ComparisonStatus, lucidflow: ComparisonStatus): ComparisonRow['cells'] => ({
  visio: { status: visio, sources: ['visio'] },
  bizagi: { status: bizagi, sources: ['bizagi', 'bizagiSimulation'] },
  miro: { status: miro, sources: ['miro'] },
  assistants: { status: assistants, sources: ['chatgpt', 'claude'] },
  prime: { status: prime, sources: ['prime'] },
  lucidflow: { status: lucidflow, sources: ['lucidflow'] },
});
// Exact matrix supplied by the product owner on 2026-10-11.
// Official links provide context, not independent verification of each rating.
export const comparisonRows: ComparisonRow[] = [
  {
    id: 'bpmn',
    label: { it: 'Da documenti e interviste a un As-Is strutturato', en: 'From documents and interviews to a structured As-Is' },
    definition: { it: 'Ricostruire il processo attuale dalle fonti, con un modello strutturato da sottoporre a review.', en: 'Reconstruct the current process from sources, with a structured model ready for review.' },
    evidence: '#scene-fonti-e-affermazioni',
    cells: ratings('no', 'no', 'yes', 'no', 'yes', 'yes'),
  },
  {
    id: 'review',
    label: { it: 'Trova lacune e ambiguità prima di chiudere l’As-Is', en: 'Find gaps and ambiguities before finalising the As-Is' },
    definition: { it: 'Evidenziare informazioni mancanti e punti ambigui prima di confermare il modello attuale.', en: 'Surface missing information and ambiguous points before confirming the current model.' },
    evidence: '#scene-lacuna-aperta',
    cells: ratings('no', 'no', 'no', 'no', 'yes', 'yes'),
  },
  {
    id: 'evidence',
    label: { it: 'Risalire da ogni attività alla fonte che la supporta', en: 'Trace each activity back to its supporting source' },
    definition: { it: 'Collegare l’attività modellata alla fonte documentale o all’intervista che la supporta, per poterla verificare.', en: 'Link the modelled activity to its supporting document or interview so it can be reviewed.' },
    evidence: '#scene-evidenze-sul-processo',
    cells: ratings('no', 'no', 'no', 'no', 'no', 'no'),
  },
  {
    id: 'memory',
    label: { it: 'Memoria strutturata di fonti, decisioni e cambiamenti dell’incarico', en: 'Structured memory of engagement sources, decisions and changes' },
    definition: { it: 'Mantenere fonti, decisioni e cambiamenti collegati nel contesto persistente dell’incarico.', en: 'Keep sources, decisions and changes connected in persistent engagement context.' },
    evidence: '#scene-memoria',
    cells: ratings('no', 'no', 'no', 'no', 'no', 'no'),
  },
  {
    id: 'scenarios',
    label: { it: 'Simulare quantitativamente alternative To-Be prima di implementarle', en: 'Quantitatively simulate To-Be alternatives before implementation' },
    definition: { it: 'Confrontare alternative con parametri operativi e assunzioni espliciti, prima dell’implementazione. Il criterio riguarda il workflow di simulazione del prodotto, non codice su misura.', en: 'Compare alternatives using explicit operating parameters and assumptions before implementation. The criterion concerns the product’s simulation workflow, rather than custom code.' },
    evidence: '#scene-confronto',
    cells: ratings('no', 'yes', 'no', 'no', 'yes', 'yes'),
  },
  {
    id: 'redesign',
    label: { it: 'Collegare evidenza → problema → modifica → To-Be mantenendo il perché', en: 'Connect evidence → problem → change → To-Be while retaining the rationale' },
    definition: { it: 'Seguire il perché della proposta dalla fonte iniziale al problema, alla modifica e allo scenario To-Be.', en: 'Follow the proposal’s rationale from its original source to the problem, change and To-Be scenario.' },
    evidence: '#scene-ipotesi-to-be',
    cells: ratings('no', 'no', 'no', 'no', 'no', 'no'),
  },
  {
    id: 'workflow',
    label: { it: 'BPMN come parte del workflow', en: 'BPMN as part of the workflow' },
    definition: { it: 'Usare BPMN nel percorso di lavoro sul processo; disponibilità ed elementi supportati dipendono dal prodotto e dal piano.', en: 'Use BPMN within the process workflow; availability and supported elements depend on the product and plan.' },
    evidence: '#scene-review-as-is',
    cells: ratings('yes', 'yes', 'yes', 'no', 'yes', 'yes'),
  },
];
