# Media della landing V2

Le registrazioni approvate vanno in `public/landing-v2/media/`. Il piano è in `docs/landing-v2-video-guide.md` e nel sito `/v2?studio=1`.

Nomi: `<slot>.<desktop|mobile>.<it|en>.<mp4|webm|webp|vtt>`.
Non aggiungere sorgenti di montaggio o dati reali. I file sono pubblici.
Finché lo slot è `planned`, il sito usa solo anteprime già presenti nel progetto.

Queste istruzioni restano in `docs/`: la cartella pubblica deve contenere solo asset destinati al sito. La pipeline verifica il pacchetto reale contro la lista di file pubblicabili prima del deploy.
