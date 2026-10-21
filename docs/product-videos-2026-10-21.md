# Video di prodotto v3 — un caso semplice, end-to-end

Data: 21 ottobre 2026. Sostituisce le 17 clip del 9 ottobre e l'hero del 14
ottobre. Sorgente, regole e rigenerazione: BK-GPT
`docs/launch/landing-videos.md`.

## Perché sono stati rifatti

| Problema delle clip precedenti | Evidenza | Scelta v3 |
| --- | --- | --- |
| Testo illeggibile sulla landing | Registrate a 1920 px e mostrate in un riquadro di ~720 px (37%): un testo da 13 px diventa ~5 px. Su mobile servivano crop CSS manuali per 5 clip. | Riprese 1280×720 a densità 1,5 e zoom di camera su ogni momento di lettura. |
| Processo troppo complesso per capirlo in pochi secondi | Caso acquisti indiretti: 6 corsie, 16 attività, percorso urgente. | Una richiesta di acquisto: 3 corsie, 5 attività, 1 decisione. |
| Racconto frammentato | 17 micro-clip (5–33 s) in 5 capitoli, alcune ridondanti. | Un video per beneficio (18–27 s) + hero (23,6 s), tutti dello stesso caso. |
| Interfaccia superata | Registrate prima dei colori del brand (12 ott), del workspace scenari, del decision record e della consegna al cliente. | Riprese sull'ultima versione di BK-GPT, incluse queste funzioni. |
| Inglese con interfaccia italiana | Solo l'hero era localizzato. | Tutti i video in IT ed EN, interfaccia e dati compresi. |

## Mappa landing → video

La home (ibrido V1 + V2, PR #20) mostra tre benefici e tiene contesto e
decisioni in un approfondimento: ogni capitolo ha ora un solo video, senza
selettore di scene. La V1 (`Journey`) usa la stessa mappa.

| Sezione | Video | Cosa si vede |
| --- | --- | --- |
| Hero | `hero` | fonti → processo BPMN → frase che sostiene l'attività → replay As-Is con la coda → scenari To-Be → link al cliente |
| 01 Evidenze | `evidenze` | citazioni verificate dell'intervista; il disegno coincide con le fonti |
| 02 Lacune | `lacune` | procedura vs intervista sulla firma; la soglia resta una domanda aperta |
| 03 Contesto | `contesto` | DeliR ricostruisce l'As-Is dalle fonti; obiettivo, avanzamento e punti aperti del progetto |
| 04 Decisioni | `decisioni` | review su «Autorizza la spesa» con le fonti; consegna con il perché di ogni modifica e link al cruscotto |
| 05 Scenari | `scenari` | replay As-Is, heatmap del collo di bottiglia, scenari ripetuti con intervallo al 95%, decision record |

Le frasi dell'hero restano le stesse, risincronizzate sui cambi di scena
(0 / 4,7 / 9,2 / 13,8 / 18,4 s). I link del confronto competitivo, del percorso
Mappa/Analizza/Simula/Migliora e del registro V2 puntano ai nuovi video
(`#scene-evidenze`, `#scene-lacune`, `#scene-contesto`, `#scene-decisioni`,
`#scene-scenari`). I vecchi link `#scene-<clip>` già condivisi restano validi:
`FragmentNavigation` li sostituisce con la scena che copre lo stesso passaggio
(`legacySceneFragments` in `src/lib/productClips.ts`).

## Formato e consegna

- MP4 H.264 1600×900, muto, una sola sorgente per lingua:
  `public/product-clips/v3/<id>.<it|en>.mp4` (1–3 MB ciascuno).
- Poster JPG 1600×900 in `artifacts/landing-media/images/v3/`, varianti WebP
  dalla pipeline Vite (480–1600 px).
- Descrizioni WebVTT IT/EN per ogni video, allineate ai cambi di scena.
- Riproduzione invariata: autoplay muto solo se visibile, poster con
  riduci-movimento o Save-Data, pausa, dialog a schermo intero.
- Disclaimer nel video: «Azienda, persone e valori dimostrativi · simulazione».
  I valori mostrati sono simulati (Prosimos), non risultati garantiti.

## Verifica — 21 ottobre

- `npm run typecheck`, `npm run lint`, `npm test` (87 test) e `npm run build`
  (16 documenti prerenderizzati): superati.
- Playwright Chromium, suite completa: 55 superati, 13 falliti, 6 saltati. Gli
  stessi 13 falliscono identici su `main` nello stesso ambiente: sono i test di
  riproduzione video, e il Chromium di Playwright disponibile qui non decodifica
  H.264. Da confermare nella CI o con Chrome/Safari.
- `v2-dialog-history`: il ritorno indietro non chiude più il dialog cambiando
  scena (non ci sono più scene alternative); il test ora chiude il dialog e
  verifica che lo scroll venga rilasciato al ritorno sul capitolo.
- Durata, risoluzione (1600×900) e leggibilità dei fotogrammi a 720 px
  verificate con ffprobe e contact sheet; poster ricontrollati uno per uno.

## Punti aperti

- **Watermark bpmn.io**: nascosto solo nelle registrazioni, su richiesta. La
  licenza bpmn.io chiede di non rimuoverlo dai diagrammi renderizzati: da
  verificare prima della pubblicazione (in BK-GPT si riattiva con
  `DELIR_SHOW_BPMN_WATERMARK=1`).
- **Dominio dell'app**: il link del cliente mostra `https://app.delir.it`,
  indicato dal proprietario; nel piano di deploy di BK-GPT il dominio risulta
  ancora da confermare.
- **Mobile**: i video restano 16:9; a 390 px si leggono i momenti zoomati, non
  i testi in campo largo. Prossimo passo possibile: una variante verticale.
