import { heroMedia } from './heroMedia';
import evidenceIt from '../../artifacts/landing-media/images/v3/evidenze.it.jpg';
import evidenceItSet from '../../artifacts/landing-media/images/v3/evidenze.it.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import evidenceEn from '../../artifacts/landing-media/images/v3/evidenze.en.jpg';
import evidenceEnSet from '../../artifacts/landing-media/images/v3/evidenze.en.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import gapsIt from '../../artifacts/landing-media/images/v3/lacune.it.jpg';
import gapsItSet from '../../artifacts/landing-media/images/v3/lacune.it.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import gapsEn from '../../artifacts/landing-media/images/v3/lacune.en.jpg';
import gapsEnSet from '../../artifacts/landing-media/images/v3/lacune.en.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import contextIt from '../../artifacts/landing-media/images/v3/contesto.it.jpg';
import contextItSet from '../../artifacts/landing-media/images/v3/contesto.it.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import contextEn from '../../artifacts/landing-media/images/v3/contesto.en.jpg';
import contextEnSet from '../../artifacts/landing-media/images/v3/contesto.en.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import decisionsIt from '../../artifacts/landing-media/images/v3/decisioni.it.jpg';
import decisionsItSet from '../../artifacts/landing-media/images/v3/decisioni.it.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import decisionsEn from '../../artifacts/landing-media/images/v3/decisioni.en.jpg';
import decisionsEnSet from '../../artifacts/landing-media/images/v3/decisioni.en.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import scenariosIt from '../../artifacts/landing-media/images/v3/scenari.it.jpg';
import scenariosItSet from '../../artifacts/landing-media/images/v3/scenari.it.jpg?w=480;960;1440;1600&format=webp&as=srcset';
import scenariosEn from '../../artifacts/landing-media/images/v3/scenari.en.jpg';
import scenariosEnSet from '../../artifacts/landing-media/images/v3/scenari.en.jpg?w=480;960;1440;1600&format=webp&as=srcset';

type Localized = { it: string; en: string };
export type ClipMedia = { poster: string; posterSrcSet: string; mp4: string; captions: string };
export type ProductClip = {
  id: string;
  poster: string;
  posterSrcSet: string;
  duration: number;
  width: number;
  height: number;
  title: Localized;
  description: Localized;
  localizedMedia: Record<'it' | 'en', ClipMedia>;
};

const media = (id: string, it: [string, string], en: [string, string]): ProductClip['localizedMedia'] => ({
  it: { poster: it[0], posterSrcSet: it[1], mp4: `/product-clips/v3/${id}.it.mp4`, captions: `/product-clips/v3/${id}.it.vtt` },
  en: { poster: en[0], posterSrcSet: en[1], mp4: `/product-clips/v3/${id}.en.mp4`, captions: `/product-clips/v3/${id}.en.vtt` },
});

// One demo case end to end: a purchase request at a fictional company, recorded
// in the product with the interface in each language (BK-GPT e2e/launch-media/simple).
// Descriptions are text alternatives for the silent recordings, not outcome claims.
export const productClips = {
  hero: {
    id: 'hero-loop', poster: heroMedia.it.poster, posterSrcSet: heroMedia.it.posterSrcSet, duration: 23.6, width: 1600, height: 900, localizedMedia: heroMedia,
    title: { it: 'DeliR in azione', en: 'DeliR in action' },
    description: {
      it: 'Una richiesta di acquisto, dal caso dimostrativo: le fonti del cliente diventano un processo BPMN, ogni attività è collegata alla frase che la sostiene, la simulazione As-Is mostra il collo di bottiglia, gli scenari To-Be vengono confrontati e il processo va al cliente con un link. Azienda, persone e valori sono dimostrativi; i risultati sono simulati.',
      en: 'A purchase request from the demo case: client sources become a BPMN process, each activity is linked to the sentence behind it, the As-Is simulation shows the bottleneck, To-Be scenarios are compared and the process goes to the client through a link. Company, people and values are fictional; results are simulated.',
    },
  },
  evidence: {
    id: 'evidenze', poster: evidenceIt, posterSrcSet: evidenceItSet, duration: 21.2, width: 1600, height: 900, localizedMedia: media('evidenze', [evidenceIt, evidenceItSet], [evidenceEn, evidenceEnSet]),
    title: { it: 'Dalle fonti al processo', en: 'From sources to process' },
    description: {
      it: 'Si apre l’intervista all’Ufficio Acquisti: ogni affermazione ha la sua citazione verificata. Poi il processo As-Is: il pannello delle evidenze conferma che il disegno coincide con le fonti e mostra la frase che sostiene «Autorizza la spesa».',
      en: 'The Purchasing interview opens: each statement has its verified quote. Then the As-Is process: the evidence panel confirms the diagram matches the sources and shows the sentence behind «Approve spend».',
    },
  },
  gaps: {
    id: 'lacune', poster: gapsIt, posterSrcSet: gapsItSet, duration: 21.4, width: 1600, height: 900, localizedMedia: media('lacune', [gapsIt, gapsItSet], [gapsEn, gapsEnSet]),
    title: { it: 'Versioni che non tornano', en: 'Versions that don’t match' },
    description: {
      it: 'Il confronto tra le fonti mostra una divergenza: la procedura dice che la firma arriva entro un giorno lavorativo, l’intervista che la responsabile firma solo il martedì e il giovedì. La soglia di importo, che nessuna fonte dichiara, resta una domanda aperta per il cliente.',
      en: 'Comparing the sources shows a divergence: the procedure says sign-off comes within one working day, the interview says the manager signs only on Tuesdays and Thursdays. The amount threshold, which no source states, stays an open question for the client.',
    },
  },
  context: {
    id: 'contesto', poster: contextIt, posterSrcSet: contextItSet, duration: 18.3, width: 1600, height: 900, localizedMedia: media('contesto', [contextIt, contextItSet], [contextEn, contextEnSet]),
    title: { it: 'Il contesto dell’incarico', en: 'Engagement context' },
    description: {
      it: 'Il consulente chiede a DeliR di ricostruire l’As-Is dalle fonti: la risposta arriva con le affermazioni estratte, la divergenza trovata e la domanda aperta. Il progetto conserva obiettivo, avanzamento e punti aperti dell’incarico.',
      en: 'The consultant asks DeliR to rebuild the As-Is from the sources: the answer comes with the extracted statements, the divergence found and the open question. The project keeps the engagement goal, progress and open points.',
    },
  },
  decisions: {
    id: 'decisioni', poster: decisionsIt, posterSrcSet: decisionsItSet, duration: 26.7, width: 1600, height: 900, localizedMedia: media('decisioni', [decisionsIt, decisionsItSet], [decisionsEn, decisionsEnSet]),
    title: { it: 'Modifiche spiegate, fino al cliente', en: 'Explained changes, through to the client' },
    description: {
      it: 'In review, DeliR propone il To-Be su «Autorizza la spesa» citando le fonti e indica cosa verificare con la process owner. Nella consegna ogni modifica riporta il perché e le fonti; il cliente riceve un link al cruscotto in sola lettura.',
      en: 'In review, DeliR proposes the To-Be for «Approve spend», quoting the sources, and flags what to check with the process owner. At handover each change carries its reason and sources; the client gets a read-only dashboard link.',
    },
  },
  scenarios: {
    id: 'scenari', poster: scenariosIt, posterSrcSet: scenariosItSet, duration: 27.3, width: 1600, height: 900, localizedMedia: media('scenari', [scenariosIt, scenariosItSet], [scenariosEn, scenariosEnSet]),
    title: { it: 'Simulazione e scenari', en: 'Simulation and scenarios' },
    description: {
      it: 'Il replay dell’As-Is mostra le richieste in coda su «Autorizza la spesa»; la heatmap lo indica come collo di bottiglia. Gli scenari To-Be, ripetuti sullo stesso seed, riportano tempo e costo per richiesta con l’intervallo al 95%, e il decision record. Valori simulati del caso dimostrativo, non risultati garantiti.',
      en: 'The As-Is replay shows requests queuing at «Approve spend»; the heatmap marks it as the bottleneck. To-Be scenarios, repeated on the same seed, report time and cost per request with a 95% interval, and the decision record. Simulated demo values, not guaranteed results.',
    },
  },
} satisfies Record<string, ProductClip>;

// Scene links published before v3 (comparison, shared URLs) open the recording
// that now covers the same step.
export const legacySceneFragments: Record<string, string> = {
  'scene-fonti-e-affermazioni': 'scene-evidenze',
  'scene-evidenze-sul-processo': 'scene-evidenze',
  'scene-review-as-is': 'scene-evidenze',
  'scene-as-is-corretto': 'scene-evidenze',
  'scene-process-owner': 'scene-decisioni',
  'scene-lacuna-aperta': 'scene-lacune',
  'scene-passaggio-nascosto': 'scene-lacune',
  'scene-chat-discovery': 'scene-contesto',
  'scene-memoria': 'scene-contesto',
  'scene-review-to-be': 'scene-decisioni',
  'scene-ipotesi-to-be': 'scene-decisioni',
  'scene-confronto': 'scene-scenari',
  'scene-simulazione-as-is': 'scene-scenari',
  'scene-simulazione-to-be': 'scene-scenari',
  'scene-heatmap-collo-di-bottiglia': 'scene-scenari',
  'scene-event-log': 'scene-scenari',
};

