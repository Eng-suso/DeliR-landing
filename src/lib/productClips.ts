import { heroMedia, heroPoster as hero, heroPosterSrcSet as heroSrcSet } from './heroMedia';
import sources from '../../artifacts/landing-media/images/fonti-e-affermazioni.jpg';
import chat from '../../artifacts/landing-media/images/chat-discovery.jpg';
import gap from '../../artifacts/landing-media/images/lacuna-aperta.jpg';
import hidden from '../../artifacts/landing-media/images/passaggio-nascosto.jpg';
import review from '../../artifacts/landing-media/images/review-as-is.jpg';
import corrected from '../../artifacts/landing-media/images/as-is-corretto.jpg';
import evidence from '../../artifacts/landing-media/images/evidenze-fonti-frame.jpg';
import owner from '../../artifacts/landing-media/images/process-owner.jpg';
import hypothesis from '../../artifacts/landing-media/images/ipotesi-to-be.jpg';
import reviewToBe from '../../artifacts/landing-media/images/review-proposta-frame.jpg';
import simulationAsIs from '../../artifacts/landing-media/images/simulazione-as-is.jpg';
import simulationToBe from '../../artifacts/landing-media/images/simulazione-to-be.jpg';
import heatmap from '../../artifacts/landing-media/images/heatmap-collo-di-bottiglia.jpg';
import eventLog from '../../artifacts/landing-media/images/event-log.jpg';
import comparison from '../../artifacts/landing-media/images/confronto.jpg';
import memory from '../../artifacts/landing-media/images/memoria.jpg';

import sourcesSrcSet from '../../artifacts/landing-media/images/fonti-e-affermazioni.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import chatSrcSet from '../../artifacts/landing-media/images/chat-discovery.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import gapSrcSet from '../../artifacts/landing-media/images/lacuna-aperta.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import hiddenSrcSet from '../../artifacts/landing-media/images/passaggio-nascosto.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import reviewSrcSet from '../../artifacts/landing-media/images/review-as-is.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import correctedSrcSet from '../../artifacts/landing-media/images/as-is-corretto.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import evidenceSrcSet from '../../artifacts/landing-media/images/evidenze-fonti-frame.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import ownerSrcSet from '../../artifacts/landing-media/images/process-owner.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import hypothesisSrcSet from '../../artifacts/landing-media/images/ipotesi-to-be.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import reviewToBeSrcSet from '../../artifacts/landing-media/images/review-proposta-frame.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import simulationAsIsSrcSet from '../../artifacts/landing-media/images/simulazione-as-is.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import simulationToBeSrcSet from '../../artifacts/landing-media/images/simulazione-to-be.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import heatmapSrcSet from '../../artifacts/landing-media/images/heatmap-collo-di-bottiglia.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import eventLogSrcSet from '../../artifacts/landing-media/images/event-log.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import comparisonSrcSet from '../../artifacts/landing-media/images/confronto.jpg?w=480;960;1440;1920&format=webp&as=srcset';
import memorySrcSet from '../../artifacts/landing-media/images/memoria.jpg?w=480;960;1440;1920&format=webp&as=srcset';

type Localized = { it: string; en: string };
export type ProductClip = {
  id: string;
  poster: string;
  posterSrcSet: string;
  duration: number;
  width: number;
  height: number;
  title: Localized;
  description: Localized;
  localizedMedia?: Record<'it' | 'en', { poster: string; posterSrcSet: string; mp4: string; captions: string }>;
};

const posterSets: Record<string, string> = {
  [hero]: heroSrcSet,
  [sources]: sourcesSrcSet,
  [chat]: chatSrcSet,
  [gap]: gapSrcSet,
  [hidden]: hiddenSrcSet,
  [review]: reviewSrcSet,
  [corrected]: correctedSrcSet,
  [evidence]: evidenceSrcSet,
  [owner]: ownerSrcSet,
  [hypothesis]: hypothesisSrcSet,
  [reviewToBe]: reviewToBeSrcSet,
  [simulationAsIs]: simulationAsIsSrcSet,
  [simulationToBe]: simulationToBeSrcSet,
  [heatmap]: heatmapSrcSet,
  [eventLog]: eventLogSrcSet,
  [comparison]: comparisonSrcSet,
  [memory]: memorySrcSet,
};

function clip(id: string, poster: string, duration: number, title: Localized, description: Localized): ProductClip {
  return { id, poster, posterSrcSet: posterSets[poster], duration, width: 1920, height: 1080, title, description };
}

// The uploaded recordings identify the people and company as fictional demo data.
// Descriptions are text alternatives for the silent recordings, not outcome claims.
export const productClips = {
  hero: { ...clip('hero-loop', hero, 25,
    { it: 'DeliR in azione', en: 'DeliR in action' },
    { it: 'Il caso dimostrativo segue le fonti del cliente, il modello BPMN e le evidenze delle attività, la simulazione AS-IS, il confronto TO-BE e la condivisione del processo con il cliente. I valori mostrati sono simulati.', en: 'The demo follows client sources, the BPMN model and activity evidence, AS-IS simulation, TO-BE comparison and sharing the process with the client. The values shown are simulated.' }), localizedMedia: heroMedia },
  sources: clip('fonti-e-affermazioni', sources, 12.7,
    { it: 'Fonti e affermazioni', en: 'Sources and statements' },
    { it: 'Il progetto raccoglie le fonti dell’incarico. La registrazione apre le interviste e le informazioni da cui ricostruire il processo.', en: 'The project gathers engagement sources. The recording opens interviews and information used to reconstruct the process.' }),
  chat: clip('chat-discovery', chat, 18,
    { it: 'Chat di processo', en: 'Process chat' },
    { it: 'La chat di processo collega la conversazione alle evidenze AS-IS, ai ruoli e alle eccezioni. La richiesta di una decisione resta distinta dal messaggio.', en: 'Process chat connects the conversation to AS-IS evidence, roles and exceptions. A decision request stays separate from the message.' }),
  gap: clip('lacuna-aperta', gap, 10.87,
    { it: 'Lacuna aperta', en: 'Open question' },
    { it: 'Una soglia di autorizzazione non dichiarata nelle fonti rimane un punto da chiarire nel caso dimostrativo.', en: 'An authorization threshold absent from the sources remains an open question in the demo case.' }),
  hidden: clip('passaggio-nascosto', hidden, 13.9,
    { it: 'Passaggio nascosto', en: 'Hidden handoff' },
    { it: 'Le interviste mostrano prospettive diverse sul processo. La registrazione segue un passaggio operativo attraverso le fonti disponibili.', en: 'Interviews show different perspectives on the process. The recording follows an operating handoff through available sources.' }),
  review: clip('review-as-is', review, 28.63,
    { it: 'Review AS-IS', en: 'AS-IS review' },
    { it: 'Il canvas AS-IS viene esaminato per attività. La review affianca al modello i punti da discutere e le proposte.', en: 'The AS-IS canvas is examined activity by activity. Review places discussion points and proposals alongside the model.' }),
  corrected: clip('as-is-corretto', corrected, 13.2,
    { it: 'AS-IS corretto', en: 'Corrected AS-IS' },
    { it: 'La registrazione mostra il modello AS-IS dopo la correzione, nel contesto del processo dimostrativo.', en: 'The recording shows the AS-IS model after correction, in the context of the demo process.' }),
  evidence: clip('evidenze-sul-processo', evidence, 11.1,
    { it: 'Evidenze sul processo', en: 'Process evidence' },
    { it: 'Un’attività del canvas BPMN viene aperta insieme al pannello di conoscenza ed evidenze che ne conserva il contesto.', en: 'A BPMN canvas activity is opened alongside the knowledge and evidence panel that retains its context.' }),
  owner: clip('process-owner', owner, 11.07,
    { it: 'Process owner', en: 'Process owner' },
    { it: 'La review presenta una proposta e un punto da verificare con il process owner prima di confermare il modello.', en: 'Review presents a proposal and a point to check with the process owner before confirming the model.' }),
  hypothesis: clip('ipotesi-to-be', hypothesis, 7.13,
    { it: 'Ipotesi TO-BE', en: 'TO-BE hypothesis' },
    { it: 'La registrazione passa dal contesto AS-IS alle ipotesi di modifica del processo nel caso dimostrativo.', en: 'The recording moves from AS-IS context to proposed process changes in the demo case.' }),
  reviewToBe: clip('review-to-be', reviewToBe, 32.5,
    { it: 'Review TO-BE', en: 'TO-BE review' },
    { it: 'Le proposte TO-BE vengono esaminate sul processo, distinguendo la modifica ipotizzata dai punti ancora da verificare.', en: 'TO-BE proposals are reviewed on the process, separating the proposed change from points still requiring verification.' }),
  simulationAsIs: clip('simulazione-as-is', simulationAsIs, 12.2,
    { it: 'Simulazione AS-IS', en: 'AS-IS simulation' },
    { it: 'Il replay della simulazione AS-IS mostra il flusso e gli indicatori della run dimostrativa.', en: 'The AS-IS simulation replay shows the flow and indicators of the demo run.' }),
  simulationToBe: clip('simulazione-to-be', simulationToBe, 12.9,
    { it: 'Simulazione TO-BE', en: 'TO-BE simulation' },
    { it: 'Il replay TO-BE mostra l’esecuzione dello scenario ipotizzato. I risultati dipendono dai parametri della simulazione.', en: 'The TO-BE replay shows the proposed scenario running. Results depend on simulation parameters.' }),
  heatmap: clip('heatmap-collo-di-bottiglia', heatmap, 7.93,
    { it: 'Heatmap e colli di bottiglia', en: 'Heatmap and bottlenecks' },
    { it: 'La heatmap evidenzia l’attesa sul modello e apre il dettaglio dell’attività nel risultato della simulazione dimostrativa.', en: 'The heatmap highlights waiting on the model and opens the activity detail in the demo simulation results.' }),
  eventLog: clip('event-log', eventLog, 14.77,
    { it: 'Event log', en: 'Event log' },
    { it: 'La registrazione apre gli eventi della run per leggere il dettaglio delle attività e dell’esecuzione.', en: 'The recording opens run events to inspect activity and execution details.' }),
  comparison: clip('confronto', comparison, 5.33,
    { it: 'Confronto degli scenari', en: 'Scenario comparison' },
    { it: 'Gli scenari AS-IS e TO-BE vengono confrontati sullo stesso processo. Le differenze mostrate sono valori del caso dimostrativo, non risultati garantiti.', en: 'AS-IS and TO-BE scenarios are compared on the same process. The differences shown are demo values, not guaranteed results.' }),
  memory: clip('memoria', memory, 9.63,
    { it: 'Contesto dell’incarico', en: 'Engagement context' },
    { it: 'La panoramica del progetto conserva obiettivo, avanzamento, fonti, decisioni e deliverable del caso dimostrativo.', en: 'The project overview retains the goal, progress, sources, decisions and deliverables of the demo engagement.' }),
} satisfies Record<string, ProductClip>;

export const chapterClips: readonly (readonly ProductClip[])[] = [
  [productClips.sources, productClips.memory],
  [productClips.chat, productClips.hidden, productClips.gap],
  [productClips.evidence, productClips.review, productClips.corrected, productClips.owner],
  [productClips.heatmap, productClips.eventLog],
  [productClips.hypothesis, productClips.reviewToBe, productClips.simulationAsIs, productClips.simulationToBe, productClips.comparison],
];
