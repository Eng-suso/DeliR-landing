# DeliR — revisione UI/UX e verifica del sito

## Perimetro

Home, percorso dei video, confronto, informazioni sui dati, offerta pilot, FAQ, contatti, lingua inglese, pagine secondarie e 404. Il lavoro riguarda la landing promozionale: non è un audit dell'applicazione DeliR o dei prodotti concorrenti.

Richieste applicate: blu come colore di enfasi, righe animate recuperate dalla geometria del commit `e6f11a1`, video originale grande nella hero, frasi complete e testi commerciali approvati preservati. Nessuna nuova metrica o prova cliente inventata.

## Problemi risolti

| Evidenza nel codice/interfaccia | Correzione | Conseguenza per il visitatore |
|---|---|---|
| Sfondi bianchi semitrasparenti con opacità diverse; aloni e decorazioni locali | Un solo fondo con righe blu leggere. Sezioni chiare trasparenti, schede bianche opache, sezioni di enfasi blu | La profondità delle superfici segue regole costanti |
| Sezione dati con separatori e superfici poco distinguibili | Tre schede con stesso fondo, bordo, raggio e spaziatura | Titoli e risposte si distinguono dal fondo |
| Superfici scure quasi nere | Metodo, pannello prodotto, DeliR nella matrice, CTA finale e footer in blu | Identità visiva coerente |
| Titolo della CTA finale scuro su superficie scura | Titolo bianco esplicito | Contrasto leggibile |
| Movimento continuo senza comando dedicato | Pulsante pausa dello sfondo nella navigazione, utilizzabile da tastiera | Le righe possono essere fermate senza bloccare i video |
| Animazioni SVG e libreria Motion per un fondo decorativo | SVG statico con animazione CSS del contenitore, pausa su scheda nascosta, reduced motion e Save-Data | Minore lavoro JavaScript per il fondo |
| Apertura delle fonti via hash impediva una chiusura affidabile | Stato di chiusura distinto dal link diretto; riapertura dalle celle | Il pannello si apre, si chiude e si riapre correttamente |
| Font e alcune superfici del pilot dipendevano da una precedente visita alla home | Font condiviso e caricamento esplicito degli stili del pilot | Entrata diretta e navigazione interna coerenti |
| La pagina principale era lazy, con un secondo passaggio di JavaScript e CSS prima della hero | Home caricata direttamente; pagine secondarie ancora lazy | Rimosso un passaggio dal percorso di apertura della landing |
| Note piccole insufficientemente contrastate sul fondo azzurro; trasparenza dell'animazione FAQ | Colore secondario più scuro, animazioni dei testi a opacità piena e FAQ statiche con reduced motion | Contrasto stabile anche durante il movimento |
| Safari poteva perdere lo scroll iniziale; un'attesa dei font ritardava gli anchor | Ripristino in layout effect prima del paint e correzione dopo i font; annullamento su input del visitatore | Il link porta alla scena senza attendere i font o scavalcare un gesto |
| Frase del video non aggiornata durante un seek a riproduzione ferma su Safari | Aggiornamento anche sugli eventi seeking/seeked | La frase segue la posizione selezionata |
| Primo avvio mobile fuori dall'attivazione del clic | Montaggio sincrono del solo filmato richiesto e chiamata play nella stessa azione | Avvio al primo clic, mantenendo l'opt-in e il caricamento solo quando necessario |
| Scansione Tailwind senza un perimetro esplicito | Scansione limitata a `src`; report esclusi dal watcher Vite | CSS e sviluppo separati dai materiali di verifica |

## Regole di movimento e caricamento

- Lenis riservato a desktop con mouse; scorrimento nativo su touch, reduced motion e Save-Data.
- Reveal brevi tramite Web Animations; il contenuto è leggibile prima dell'animazione. Focus e link diretti non devono attendere il reveal.
- Parallasse leggera via scroll timeline CSS sui browser compatibili; gli altri mantengono il layout statico.
- Le animazioni rispettano la preferenza di movimento ridotto. I video mantengono i propri controlli e la riproduzione volontaria su mobile.
- Poster hero precaricato con `srcset` responsive; font condiviso; fonti del confronto montate solo quando richieste.
- Su mobile le sezioni fuori schermo usano `content-visibility: auto` con altezza intrinseca memorizzata. Hero, destinazioni dei link e sezioni con focus restano immediate. La prova locale con CPU 4× ha rilevato meno tempo di layout (1,24 s contro 2,06 s e 1,60 s nelle due esecuzioni di controllo); è un confronto esplorativo, non un miglioramento percentuale garantito. [Riferimento sul rendering differito](https://web.dev/articles/content-visibility).
- Nessun nuovo tracker e nessun invio di email durante i controlli.

## Evidenze

Screenshot e verifica mirata: `artifacts/qa/premium-ui-2026-10-09/visual/`. Il controllo della gerarchia usa screenshot dei singoli viewport: le schermate full-page dei browser possono rappresentare il fondo fisso solo nella prima porzione dell'immagine.

Verifica mirata iniziale: 320, 390, 820, 1130 e 1440 px senza overflow; pausa dello sfondo da tastiera; dialog video e ritorno del focus; link diretto alle fonti e chiusura; reduced motion; zero errori JavaScript e zero violazioni automatiche Axe WCAG A/AA sulla home mobile. Il controllo automatico non sostituisce una certificazione WCAG.

Test unitari: 22 passati; copertura della logica inclusa 100% linee, statement e funzioni, 94,73% branch. Cataloghi statici di immagini/media e confronto esclusi dal denominatore e verificati nel browser.

### Esito finale dei controlli

- TypeScript, ESLint e build di produzione passati. Nessuna pubblicazione effettuata.
- Suite E2E completa: 108 casi su Chromium desktop, WebKit desktop, Pixel 7 emulato e iPhone 14/WebKit emulato. Prima esecuzione: 64 passati, 36 esclusi per profilo, 8 falliti. Tutti gli 8 sono poi passati nei ricontrolli dopo le correzioni; 72 scenari distinti verificati. Le esecuzioni iniziali non sono presentate come una suite passata al primo tentativo.
- Alcuni controlli iniziavano durante la pagina lazy-loading: ora attendono il montaggio del contenuto prima delle asserzioni sulla posizione o sul testo, senza cambiare il comportamento del sito per i test.
- Ulteriore regressione video Chromium: 6/6 passati sulla versione finale del player, inclusi opt-in, pausa fuori viewport, errore di caricamento, dialog in inglese, Full HD e frase completa durante il seek.
- Dopo l'ottimizzazione del rendering mobile: ulteriori 12/12 E2E passati su Chrome mobile e WebKit mobile. Verificati video, opt-in, capitoli, FAQ, menu dopo scroll, tastiera, apertura/chiusura fonti, link diretti e reload.
- Dopo il caricamento diretto della home: ricontrollo su quattro profili con 8 passati, 3 esclusi per profilo e 1 attesa del pilot fallita. Il test verificava il titolo durante il fallback lazy; aggiunta l'attesa del montaggio, il singolo ricontrollo WebKit mobile è passato (21,8 s). I 9 controlli attivi risultano quindi verificati, senza presentarli come una singola esecuzione priva di errori. La ricompilazione dopo la modifica al test ha prodotto gli stessi hash di JavaScript e CSS.
- Ricontrollo di ogni sezione su 320, 390 e 820 px: 21/21 passaggi senza overflow; FAQ e ritorno alla hero funzionanti; zero errori JavaScript e zero violazioni automatiche Axe sulla home mobile.
- Verifica finale del build di produzione su 320, 390, 820, 1130 e 1440 px: niente overflow; Lenis e parallasse leggera funzionanti su desktop, scroll nativo con reduced motion; controllo dello sfondo da tastiera; ritorno del focus dal dialog; font condiviso sulle route secondarie. Zero errori JavaScript.
- Axe WCAG A/AA e WCAG 2.2 AA nella verifica mirata: zero violazioni automatiche su home mobile, pilot, aggiornamenti e 404; home desktop verificata anche nella suite E2E.
- FFprobe: 34/34 asset attivi (17 MP4 e 17 WebM) a 1920×1080. Anche le dimensioni intrinseche del player Chromium sono state controllate. In questa esecuzione WebKit/Windows mobile ha restituito `videoWidth=346` pur usando il medesimo file Full HD; questa misura non viene usata per attestare la risoluzione del file.

La verifica WebKit è emulazione su Windows, non Safari su macOS o un iPhone fisico. La [documentazione Playwright](https://playwright.dev/docs/browsers) distingue i codec delle piattaforme e raccomanda macOS per la maggiore fedeltà a Safari nei video. Il codice di Playwright contiene inoltre una [gestione delle peculiarità RAF WebKit su Windows](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/page.ts).

Risultati: `e2e-results.json`, `e2e-recheck.json`, `e2e-final-recheck.json`, `e2e-media-recheck.json`, `e2e-chromium-media-final.json`, `media-resolution.json` e `visual/verification.json` in `artifacts/qa/premium-ui-2026-10-09/`. Gli screenshot delle prime anomalie sono conservati in `initial-test-results/`.

L'ultima regressione mobile è in `e2e-mobile-rendering-final.json`; lo scorrimento delle sezioni e Axe in `visual/mobile-rendering-verification.json`; la prova di rendering in `after/mobile-runtime-rendering.json`.

Il controllo del caricamento iniziale è in `e2e-startup-final.json` e `e2e-startup-recheck.json`; la schermata del fallback del pilot è conservata in `startup-test-results/`.

### Prestazioni: risultato e punto ancora aperto

Ultima misura valida sul build finale, una navigazione a freddo per profilo con Chromium visibile e una nuova finestra per ciascun profilo:

| Profilo | Performance | Accessibilità / best practices / SEO | LCP | TBT | CLS |
|---|---:|---|---:|---:|---:|
| Mobile simulato | 58/100 | 100 / 100 / 100 | 3,04 s | 3,14 s | 0 |
| Desktop 1440×900 | 70/100 | 100 / 100 / 100 | 0,59 s | 0,93 s | 0 |

**Il budget di performance del progetto (70 mobile, 85 desktop) non è raggiunto in queste misure.** Il caricamento iniziale e il lavoro sul main thread restano un punto aperto: non viene dichiarata un'ottimizzazione completa o una release pronta sulla sola base della UI.

Le esecuzioni locali sono state molto variabili: mobile 44–64, desktop 70–100 nelle diverse fasi; l'indice di calibrazione della macchina è variato da 104 a 990. Le ultime due misure hanno indici 756,5 e 886. Non sono un confronto controllato né una mediana sullo stesso ambiente. Le modifiche riducono il numero di passaggi di caricamento e differiscono il rendering, ma questi dati non dimostrano un aumento percentuale delle prestazioni rispetto alla versione iniziale.

Una precedente esecuzione desktop ha restituito `NO_FCP`: è esclusa dalla valutazione, con categorie `null`, non trattata come uno score zero del sito. Nessun errore JavaScript è stato rilevato nella verifica guidata del build finale, che ha nuovamente passato cinque larghezze, controlli del movimento e Axe sulle quattro route.

Per chiudere il punto prestazioni servono un profiling del lavoro iniziale in condizioni CPU stabili e almeno tre esecuzioni comparabili per profilo, oltre a una verifica su Safari/macOS o dispositivo fisico. Non vengono dedotti INP o Core Web Vitals reali dal solo Lighthouse locale.

Report validi finali: `delivery-foreground/lighthouse-summary.json` e i due report completi nella stessa directory. Tutte le misure precedenti e quella non valida restano disponibili in `baseline/`, `after/`, `after-repeat/`, `final/` e `delivery/`. Il build finale conserva gli hash `index-B_mj8PUB.js` e `index-BK6G6wSj.css` verificati nei controlli del caricamento.

## Limiti della valutazione

La UI ora ha una gerarchia esplicita e verificabile. Non viene attribuito un punteggio commerciale 85/85: policy pubbliche definitive, prove cliente autorizzate, risultati misurati e verifica indipendente della differenziazione restano materiali da fornire. Il confronto conserva i giudizi forniti dal team DeliR e la relativa attribuzione.

I risultati Lighthouse sono misure locali di laboratorio, non Core Web Vitals sul traffico reale né una previsione di conversione. La pubblicazione e il dominio definitivo sono fuori dal perimetro di questo intervento locale.

Riferimento tecnico per il perimetro di scansione CSS: [documentazione Tailwind](https://tailwindcss.com/docs/detecting-classes-in-source-files).
