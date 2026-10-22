import type { productVideoIds } from '../privacy/analytics';

type Localized = { it: string; en: string };
export type ProductVideoId = typeof productVideoIds[number];
export type ProductVideo = {
  id: ProductVideoId;
  seconds: number;
  title: Localized;
  summary: Localized;
  // Text alternative for the silent recording: what happens, in order.
  description: Localized;
};

/**
 * The landing videos (docs/product-videos-2026-10-21.md). They are cut from one
 * end-to-end recording of the demo case in BK-GPT (`npm run media:landing`):
 * the product always in full, slow, with IT/EN labels outside the interface.
 */
export const productVideoPath = (id: ProductVideoId, ext: 'mp4' | 'webm' | 'jpg' | 'it.vtt' | 'en.vtt') => `/product-videos/${id}.${ext}`;

export const narrativeVideos: ProductVideo[] = [
  {
    id: 'problem', seconds: 40,
    title: { it: 'Le informazioni sono sparse', en: 'Information is scattered' },
    summary: { it: 'Interviste lunghe, in testo libero: i passaggi sono sparsi e ognuno racconta una versione diversa.', en: 'Long free-text interviews: the steps are scattered and everyone tells a different version.' },
    description: {
      it: 'Le tre interviste del cliente nel progetto. Il testo della trascrizione di Paolo scorre: richieste via mail, informazioni che si completano a voce, passaggi sparsi tra le risposte. Poi l’intervista di Laura: tre persone, tre versioni dello stesso processo.',
      en: 'The client’s three interviews in the project. Paolo’s transcript scrolls by: requests sent by email, details completed over the phone, steps scattered across the answers. Then Laura’s interview: three people, three versions of the same process.',
    },
  },
  {
    id: 'agitate', seconds: 40,
    title: { it: 'E intanto il processo si blocca', en: 'Meanwhile the process stalls' },
    summary: { it: 'Una soglia che nessuno conosce, un passaggio che nessuno sa chi fa, richieste che aspettano giorni.', en: 'A threshold nobody knows, a step nobody knows who does, requests waiting for days.' },
    description: {
      it: 'Nessuna fonte dice sopra quale cifra serve l’autorizzazione: resta una domanda bloccante. Nelle interviste Paolo non sa chi regolarizza un acquisto urgente e a nessuno è mai stato detto. Intanto, nella heatmap del processo di oggi, le richieste aspettano in media 1 giorno e 9 ore su «Autorizza spesa». Valori simulati.',
      en: 'No source says above what amount approval is needed: it stays a blocking question. In the interviews Paolo does not know who regularises an urgent purchase, and nobody was ever told. Meanwhile, in the heatmap of today’s process, requests wait 1 day 9 hours on average at “Approve spend”. Simulated values.',
    },
  },
];

export const solveVideos: ProductVideo[] = [
  {
    id: 'discovery', seconds: 46,
    title: { it: 'Process Discovery', en: 'Process Discovery' },
    summary: { it: 'Le interviste diventano affermazioni con citazione. Ciò che nessuno dice diventa una domanda aperta.', en: 'Interviews become statements with quotes. What nobody says becomes an open question.' },
    description: {
      it: 'Le interviste del cliente entrano nel progetto. DeliR ne estrae le affermazioni, ognuna con la sua citazione verificata. Il consulente chiede a DeliR di ricostruire il processo: la risposta cita le persone e la soglia di autorizzazione, che nessuna fonte dichiara, resta una domanda aperta.',
      en: 'The client’s interviews go into the project. DeliR extracts their statements, each with a verified quote. The consultant asks DeliR to rebuild the process: the answer quotes people, and the approval threshold, which no source states, stays an open question.',
    },
  },
  {
    id: 'evidence', seconds: 49,
    title: { it: 'Evidenze e BPMN', en: 'Evidence & BPMN' },
    summary: { it: 'Un As-Is in BPMN 2.0 in cui ogni elemento ha la sua fonte, versione dopo versione.', en: 'A BPMN 2.0 As-Is where every element has its source, version after version.' },
    description: {
      it: 'Il processo As-Is in BPMN 2.0, con due corsie e cinque attività. Il pannello Evidenze conferma che il disegno coincide con le fonti al 100% e mostra per ogni elemento la frase dell’intervista che lo sostiene. La cronologia conserva ogni versione, fino a quella validata con il process owner.',
      en: 'The As-Is process in BPMN 2.0, with two lanes and five activities. The Evidence panel confirms the diagram matches the sources at 100% and shows, for each element, the interview sentence that supports it. The history keeps every version, up to the one validated with the process owner.',
    },
  },
  {
    id: 'simulation', seconds: 59,
    title: { it: 'Analisi e simulazione', en: 'Analysis & Simulation' },
    summary: { it: 'Simuli il processo di oggi e lo scenario To-Be: sei KPI in movimento e il collo di bottiglia misurato.', en: 'Simulate today’s process and the To-Be scenario: six live KPIs and a measured bottleneck.' },
    description: {
      it: 'La simulazione dell’As-Is: le richieste attraversano il processo e si accumulano su «Autorizza spesa», mentre sei KPI si aggiornano (coda, tempo di attraversamento, richieste concluse, throughput, costo, occupazione delle risorse). La heatmap misura il collo di bottiglia. Poi lo scenario To-Be, con le stesse richieste e nessuna coda sull’autorizzazione. Valori simulati.',
      en: 'The As-Is simulation: requests flow through the process and pile up at “Approve spend” while six KPIs update (queue, cycle time, completed requests, throughput, cost, resource utilisation). The heatmap measures the bottleneck. Then the To-Be scenario, with the same requests and no queue at approval. Simulated values.',
    },
  },
  {
    id: 'results', seconds: 41,
    title: { it: 'Risultati e consegna', en: 'Results & Deliverables' },
    summary: { it: 'Il confronto As-Is / To-Be e un cruscotto in sola lettura per il process owner.', en: 'The As-Is / To-Be comparison and a read-only dashboard for the process owner.' },
    description: {
      it: 'Il confronto fra As-Is e To-Be mostra la differenza di tempo di attraversamento e di costo per caso, come valori simulati. Prima della consegna DeliR verifica che il lavoro sia completo; il process owner riceve un cruscotto in sola lettura.',
      en: 'The As-Is / To-Be comparison shows the difference in cycle time and cost per case, as simulated values. Before handover DeliR checks the work is complete; the process owner gets a read-only dashboard.',
    },
  },
];

export const walkthroughVideo: ProductVideo = {
  id: 'walkthrough', seconds: 287,
  title: { it: 'La demo completa del prodotto', en: 'The full product demo' },
  summary: { it: 'Tutto il percorso operativo di DeliR in un’unica registrazione, dalle interviste alla consegna.', en: 'DeliR’s whole operating path in one recording, from interviews to handover.' },
  description: {
    it: 'Un’unica registrazione del caso dimostrativo: fonti e affermazioni, discussione con DeliR, processo As-Is con le evidenze, ipotesi To-Be, simulazione As-Is con heatmap, simulazione To-Be, confronto e consegna al process owner.',
    en: 'One recording of the demo case: sources and statements, discussion with DeliR, the As-Is process with its evidence, To-Be hypotheses, As-Is simulation with heatmap, To-Be simulation, comparison and handover to the process owner.',
  },
};

/** "38 s" for short clips, "4:05" for the walkthrough. */
export const formatSeconds = (seconds: number) => seconds < 90
  ? `${Math.round(seconds)} s`
  : `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;

/**
 * Links shared before the videos (old chapters and scenes) open the step that
 * now shows the same part of the product.
 */
export const legacyFragments: Record<string, ProductVideoId> = {
  'product-01': 'results', 'product-02': 'discovery', 'product-03': 'evidence', 'product-04': 'results', 'product-05': 'simulation',
  'scene-fonti-e-affermazioni': 'discovery', 'scene-chat-discovery': 'discovery', 'scene-lacuna-aperta': 'discovery', 'scene-passaggio-nascosto': 'discovery',
  'scene-evidenze-sul-processo': 'evidence', 'scene-review-as-is': 'evidence', 'scene-as-is-corretto': 'evidence', 'scene-process-owner': 'results',
  'scene-ipotesi-to-be': 'simulation', 'scene-review-to-be': 'results', 'scene-simulazione-as-is': 'simulation', 'scene-simulazione-to-be': 'simulation',
  'scene-heatmap-collo-di-bottiglia': 'simulation', 'scene-event-log': 'simulation', 'scene-confronto': 'simulation', 'scene-memoria': 'results',
};
