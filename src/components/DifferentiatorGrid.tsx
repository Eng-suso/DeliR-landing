import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const proofLinks = [
  { id: 'evidence', href: '#scene-evidenze' },
  { id: 'gaps', href: '#scene-lacune' },
  { id: 'reconciliation', href: '#scene-lacune' },
  { id: 'memory', href: '#scene-contesto' },
  { id: 'decisions', href: '#scene-decisioni' },
  { id: 'continuity', href: '#caso' },
];

const copy = {
  it: {
    action: 'Vedi nella demo',
    items: [
      { name: 'Tracciabilità delle evidenze', body: 'Fonti consultabili accanto alle attività BPMN.' },
      { name: 'Individuazione delle lacune', body: 'Informazioni mancanti e punti aperti da verificare.' },
      { name: 'Confronto tra le fonti', body: 'Prospettive diverse da discutere con il responsabile del processo.' },
      { name: 'Memoria dell’incarico', body: 'Obiettivi, documenti e decisioni conservati nel progetto.' },
      { name: 'Motivazioni delle modifiche', body: 'Proposte da discutere insieme alle evidenze che le sostengono.' },
      { name: 'Continuità del contesto', body: 'Un contesto condiviso tra raccolta delle informazioni, verifica e scenari.' },
    ],
  },
  en: {
    action: 'See it in the demo',
    items: [
      { name: 'Evidence traceability', body: 'Sources available alongside BPMN activities.' },
      { name: 'Gap detection', body: 'Missing information and open questions to review.' },
      { name: 'Source reconciliation', body: 'Different perspectives to discuss with the process owner.' },
      { name: 'Engagement memory', body: 'Goals, documents and decisions retained in the project.' },
      { name: 'Decision provenance', body: 'Proposals to discuss alongside their supporting evidence.' },
      { name: 'Context continuity', body: 'One shared context across discovery, review and scenarios.' },
    ],
  },
};

export default function DifferentiatorGrid() {
  const { language } = useLanguage();
  const t = copy[language];

  return <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {proofLinks.map((proof, index) => {
      const item = t.items[index];
      return <li key={proof.id} data-differentiator={proof.id} className="flex min-w-0 flex-col border-b border-slate-200 py-3 sm:p-4">

        <h3 className="mt-2 font-display text-lg font-semibold leading-6 text-brand-ink">{item.name}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
        <a href={proof.href} aria-label={`${t.action}: ${item.name}`} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-1 text-sm font-semibold text-brand-blue underline underline-offset-4 hover:text-brand-ink">{t.action}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a>
      </li>;
    })}
  </ol>;
}
