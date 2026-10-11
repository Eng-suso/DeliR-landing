import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { pilotCtaLabel, pilotRiskReversals, pilotApplicationHref } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Pilot a pagamento · per milestone', title: 'Porta un progetto. Mantieni il pieno controllo.',
    body: 'Testa DeliR su un incarico reale per un cliente, con un perimetro e un obiettivo chiari.',
    kickoff: 'Prima di iniziare concordiamo cosa significa avere successo, cosa consegnerà DeliR e come verrà verificata ogni milestone.',
    example: 'Progetto di esempio: acquisti indiretti',
    steps: [
      ['Definisci il progetto', 'Definisci obiettivo, perimetro, fonti disponibili, persone chiave coinvolte e risultati attesi.'],
      ['Comprendi e migliora', 'DeliR ricostruisce l’As-Is dalle evidenze disponibili, individua le informazioni mancanti, sviluppa opzioni To-Be e confronta scenari alternativi.'],
      ['Verifica e decidi', 'Verifica As-Is, opzioni To-Be, risultati degli scenari, evidenze, assunzioni e punti ancora aperti con le persone coinvolte.'],
    ],
    control: 'Il controllo resta a te',
    firstContact: 'Per il primo confronto non servono documenti del cliente.',
    note: 'Porta il progetto, l’obiettivo e la tempistica prevista.',
  },
  en: {
    eyebrow: 'Paid pilot · milestone-based', title: 'Bring one project. Keep full control.',
    body: 'Test DeliR on a real client engagement with a clear scope and objective.',
    kickoff: 'Before kickoff, we agree what success looks like, what DeliR will deliver, and how each milestone will be reviewed.',
    example: 'Example project: indirect procurement',
    steps: [
      ['Define the project', 'Set the objective, scope, available sources, key stakeholders, and expected outcomes.'],
      ['Understand and improve', 'DeliR reconstructs the As-Is from available evidence, finds missing information, develops To-Be options, and compares alternative scenarios.'],
      ['Review and decide', 'Review the As-Is, To-Be options, scenario results, evidence, assumptions, and remaining points with the people involved.'],
    ],
    control: 'You stay in control',
    firstContact: 'No client documents are needed for the first conversation.',
    note: 'Bring the project, the objective, and the expected timing.',
  },
};

export default function PilotInvitation() {
  const { language } = useLanguage(); const t = copy[language];
  return <section id="pilot" className="premium-pilot scroll-mt-24 bg-white py-14 sm:py-20" aria-labelledby="pilot-invitation-title">
    <div className="section-shell grid items-center gap-10 lg:grid-cols-2">
      <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="pilot-invitation-title" className="landing-title mt-5">{t.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{t.body}</p>
        <p className="mt-4 text-base leading-7 text-slate-600">{t.kickoff}</p>
        <h3 className="mt-7 text-lg font-semibold text-brand-ink">{t.control}</h3>
        <ul className="mt-4 space-y-3">{pilotRiskReversals[language].map(term => <li key={term} className="flex items-start gap-3 text-sm font-semibold leading-6 text-brand-ink"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-blue" /><span>{term}</span></li>)}</ul>
        <p className="mt-7 text-sm font-semibold leading-6 text-brand-ink">{t.firstContact}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t.note}</p>
        <a href={pilotApplicationHref(language)} className="btn-primary mt-6 whitespace-normal">{pilotCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>
      </div>
      <div data-reveal className="milestone-card rounded-3xl border border-slate-200 bg-brand-light p-6 sm:p-8"><p className="mb-5 text-sm font-semibold text-brand-blue">{t.example}</p><ol className="divide-y divide-slate-300">{t.steps.map(([title, description], index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 first:pt-0"><span className="pt-1 font-mono text-xs text-brand-blue">0{index + 1}</span><div><h3 className="text-lg font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div></li>)}</ol></div>
    </div>
  </section>;
}
