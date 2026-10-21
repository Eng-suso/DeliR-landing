# Allineamento responsive al Figma B2B V2

> Registro dell’esplorazione Figma precedente. `/v2` mostra ora la versione ibrida descritta in `docs/landing-hybrid.md`. Le misure e i test di questa nota appartengono alla precedente composizione, non alla nuova anteprima.

18 ottobre 2026. Anteprima `/v2`, PR #20.

## Riferimenti e misure disponibili

Letti nel browser dal file pubblico; le misure sotto sono quelle mostrate sulle selezioni Figma.

| Elemento | Nodo | Dimensione |
| --- | --- | --- |
| Pagina desktop V2 | `3:941` | 1440 × 8180 |
| Pagina mobile V2 | `37:5727` | 414 × 11588 |
| Header e hero desktop | `3:1326` | 1440 × 782 |
| Riga contenuti hero | `3:1337` | 1303 × 530 |
| Colonna messaggio | `3:1338` | 586 × 530 |
| Visual/form nel riferimento | `3:1349` | 637 × 530 |

La griglia desktop a 1440px riprende le colonne 586 e 637 con 80px fra loro. Il contenitore è centrato; il gutter risultante è 68,5px. Non fissiamo l’altezza della pagina o dei testi: il riferimento contiene placeholder, DeliR contiene messaggi reali. I rapporti degli altri media e le dimensioni tipografiche sono stime dalla lettura visiva, non token esportati dal file.

## Composizioni riprese

| Sezione | Desktop | Mobile |
| --- | --- | --- |
| Header | Logo, contatto e CTA sulla stessa riga | Contatto su fascia separata; logo e CTA restano nella riga principale |
| Hero | Messaggio con tre benefici e CTA a sinistra; visual a destra | Messaggio → tre benefici → CTA e rassicurazione → visual |
| Fascia successiva | Blocco di credibilità/percorso | Stesso ruolo, adattato su più righe |
| Problema | Testo/CTA a sinistra, visual a destra | Testo e CTA, senza il visual desktop |
| Prima prova | Un media largo e CTA | Tre schede: un media e due immagini demo di supporto, poi CTA |
| Benefici | Tre sezioni, immagini alternate sinistra/destra/sinistra | Immagine prima del testo in tutte le sezioni, CTA per ciascuna |
| Seconda prova | Un media largo e CTA | Una sola scheda e CTA |
| Confronto | Titolo centrato, CTA, matrice | Sei differenziatori in verticale e CTA in fondo |
| Come funziona | Tre schede affiancate su fascia chiara | Tre schede verticali e CTA |
| Prima delle FAQ | Nessuna fascia aggiuntiva | Fascia di credibilità aggiuntiva |
| FAQ | Titolo e domande nella stessa colonna, CTA sotto | Titolo a sinistra e domande sotto, CTA a larghezza piena |
| Chiusura | Messaggio centrato e CTA | Visual introduttivo, messaggio e CTA |
| Footer | Fascia compatta | Fascia compatta con collegamenti a capo |

## Adattamenti al prodotto

Il telefono fittizio del wireframe è sostituito dall’email pubblica già presente nel sito. Lingua e menu accessibile sono conservati come utilità DeliR. Il lead form nel visual della hero resta un video/immagine del prodotto: la CTA continua al percorso lista d’attesa esistente. Le prove sociali senza testimonianze disponibili diventano esempi dimostrativi espliciti, non risultati cliente. La chiusura mobile riusa il poster hero, senza richiedere un ottavo video.

Il primo titolo della hero diventa H1; la seconda parte dello stesso testo esistente diventa sottotitolo. I tre benefici riprendono output già presenti nella landing. Nessuna nuova promessa commerciale. La matrice desktop conserva tutti i sette criteri esistenti; il mobile mette in evidenza i sei differenziatori principali e collega alla documentazione completa.

Il piano `?studio=1` può mostrare anche il media problema su mobile per consultare la scheda di registrazione; la pagina normale lo omette come il riferimento. Per quello slot viene richiesta solo la variante desktop. Negli altri slot la variante mobile ha un’inquadratura e un formato propri, non un semplice ridimensionamento.

## Tablet

Nel riferimento consultato non c’è un frame tablet. Il comportamento è quindi progettato:

- Sotto 768px: composizione mobile, sei differenziatori in una colonna, prove mobile e visual finale.
- Da 768 a 1023px: hero e benefici verticali con media limitati a 637px, differenziatori in due colonne, passaggi su una colonna; niente matrice compressa.
- Da 1024px: composizione desktop, matrice e colonne alternate.

Sono verificati 320, 375, 414, 768, 834, 1024 e 1440px. Gli stili sono circoscritti a `.landing-v2`, senza ereditare il footer scuro e il rendering differito della vecchia `.landing-page`, che alteravano geometria e contrasto nell’anteprima.

## Limite della fedeltà verificabile

Il connettore Figma ha restituito `Looks like you don't have edit access to this file` sia per design context sia per screenshot. È stato possibile leggere il file pubblico, la gerarchia, le composizioni e le misure delle selezioni dal browser. Non sono disponibili tutti i token di Auto Layout, font e spaziature interne per una verifica numerica completa.

Questa revisione allinea le composizioni osservate e le misure elencate; non certifica un’identità al pixel di ogni blocco. L’accesso inspect/design context al file permetterà di chiudere la verifica delle restanti misure. Colori, font, contenuti e immagini rimangono quelli di DeliR come richiesto.

## Evidenza locale della revisione

Lint, TypeScript e build superati; 82 test unitari/componenti superati. Playwright su V2, home e prerender: 17 test superati in Chromium e Safari mobile, con una scansione axe duplicata saltata intenzionalmente. Le verifiche responsive coprono 320, 375, 414, 768, 834, 1024 e 1440px: ordine dei benefici, numero di schede prova, visibilità del visual problema e del finale, soglia della matrice, rapporto hero e visual desktop largo 637px a 1440px. Verificati anche menu, Escape, attivazione da tastiera, FAQ, lingua, piano e assenza di richieste ai video pianificati.

Axe sulla V2 studio a 375 e 1440px non rileva violazioni automatiche A/AA nei criteri controllati; resta necessaria una verifica completa con tecnologie assistive prima del rilascio pubblico. Lighthouse mobile locale, una misurazione con poster statici: performance 94, accessibilità 100, best practices 100, LCP 2,76s e CLS 0. Le registrazioni definitive richiederanno una nuova verifica di leggibilità e prestazioni.
