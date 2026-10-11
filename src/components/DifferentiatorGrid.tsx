import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const proofLinks = [
  { id: 'evidence', href: '#scene-evidenze-sul-processo' },
  { id: 'gaps', href: '#scene-lacuna-aperta' },
  { id: 'reconciliation', href: '#scene-passaggio-nascosto' },
  { id: 'memory', href: '#scene-memoria' },
  { id: 'decisions', href: '#scene-review-to-be' },
  { id: 'continuity', href: '#caso' },
];

const copy = {
  it: {
    action: 'Vedi nella demo',
    items: [
      { name: 'Tracciabilità delle evidenze', title: 'Risali dai passaggi del processo alle evidenze reali.', body: 'Sostieni le raccomandazioni con fonti che puoi aprire, discutere e verificare con il cliente.' },
      { name: 'Individuazione delle lacune', title: 'Trova ciò che interviste e documenti lasciano aperto.', body: 'Porta le informazioni mancanti in review prima che diventino assunzioni nella prossima raccomandazione.' },
      { name: 'Confronto tra le fonti', title: 'Chiarisci le informazioni discordanti prima di modellare.', body: 'Confronta le prospettive sul processo e verifica con il process owner come si collegano in un As-Is condiviso.' },
      { name: 'Memoria dell’incarico', title: 'Mantieni collegati informazioni, decisioni e documenti del cliente.', body: 'Riprendi il lavoro ritrovando il contesto del progetto e i punti ancora da chiarire.' },
      { name: 'Motivazioni delle modifiche', title: 'Spiega perché proponi di cambiare il processo.', body: 'Discuti la raccomandazione insieme alle evidenze e alla review che la sostengono.' },
      { name: 'Continuità del contesto', title: 'Porta lo stesso contesto dal discovery al miglioramento.', body: 'Mantieni allineati raccolta delle informazioni, review e confronto degli scenari lungo l’incarico.' },
    ],
  },
  en: {
    action: 'See it in the demo',
    items: [
      { name: 'Evidence traceability', title: 'Trace process steps back to real evidence.', body: 'Defend recommendations with sources you can open, discuss and verify with your client.' },
      { name: 'Gap detection', title: 'Catch what interviews and documents leave unresolved.', body: 'Bring missing information into review before it becomes an assumption in your next recommendation.' },
      { name: 'Source reconciliation', title: 'Clarify conflicting client information before modeling.', body: 'Compare perspectives on the process and review with the process owner how they fit into a shared As-Is.' },
      { name: 'Engagement memory', title: 'Keep client insights, decisions and documents connected.', body: 'Pick up your work with the project context and unresolved questions at hand.' },
      { name: 'Decision provenance', title: 'Explain why you recommend changing the process.', body: 'Discuss the recommendation alongside the evidence and review that support it.' },
      { name: 'Context continuity', title: 'Carry the same context from discovery to improvement.', body: 'Keep information gathering, review and scenario comparison aligned throughout the engagement.' },
    ],
  },
};

export default function DifferentiatorGrid() {
  const { language } = useLanguage();
  const t = copy[language];

  return <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {proofLinks.map((proof, index) => {
      const item = t.items[index];
      return <li key={proof.id} data-differentiator={proof.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <p className="flex items-start gap-3 text-xs font-semibold leading-5 text-brand-blue"><span aria-hidden="true" className="font-mono">0{index + 1}</span><span>{item.name}</span></p>
        <h3 className="mt-4 text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-brand-ink">{item.title}</h3>
        <p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p>
        <a href={proof.href} aria-label={`${t.action}: ${item.name}`} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 text-sm font-semibold text-brand-blue underline underline-offset-4 hover:text-brand-ink">{t.action}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a>
      </li>;
    })}
  </ol>;
}
