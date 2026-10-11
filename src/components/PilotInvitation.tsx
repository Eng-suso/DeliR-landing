import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref, publicContactEmail } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Pilot a pagamento · per milestone', title: 'Un processo. Output chiari. Pagamenti per fasi.',
    body: 'Porta un incarico attivo o in partenza. Il perimetro proposto comprende un As-Is, le ipotesi To-Be e il confronto degli scenari. Attività, durata e criteri di accettazione si concordano prima della firma.',
    example: 'Esempio di perimetro: acquisti indiretti',
    steps: [
      ['Firma e avvio', 'Scegliamo un processo, concordiamo documenti, procedure o interviste disponibili e chi partecipa alla verifica. Prima quota alla firma, con obiettivi e responsabilità definiti.'],
      ['AS-IS e TO-BE', 'Modello BPMN As-Is con fonti collegate e punti aperti; ipotesi To-Be e confronto degli scenari con parametri e assunzioni espliciti. Quote legate agli obiettivi concordati.'],
      ['Consegna al responsabile del processo', 'Consegna dei modelli e del confronto concordati, con fonti, ipotesi e punti da verificare. Formati e criteri di accettazione definiti nel preventivo.'],
    ],
    cta: 'Parliamo del tuo progetto', note: 'Nel primo messaggio bastano processo, obiettivo e tempistica. Per avviare il pilot concordiamo le fonti e chi verifica il modello. Non inviare documenti del cliente nel primo messaggio.',
    quote: 'Importi, ripartizione e calendario vengono definiti nel preventivo prima della firma.',
  },
  en: {
    eyebrow: 'Paid pilot · by milestone', title: 'One process. Clear outputs. Payment in stages.',
    body: 'Bring an active or upcoming engagement. The proposed scope includes an As-Is, To-Be hypotheses and scenario comparison. Activities, duration and acceptance criteria are agreed before signing.',
    example: 'Example scope: indirect procurement',
    steps: [
      ['Signing and kickoff', 'Choose one process, agree which documents, procedures or interviews are available and who takes part in the review. Initial payment at signing, with defined objectives and responsibilities.'],
      ['AS-IS and TO-BE', 'An As-Is BPMN model with linked sources and open questions; To-Be hypotheses and scenario comparison with explicit parameters and assumptions. Payments tied to agreed objectives.'],
      ['Process owner handover', 'Delivery of the agreed models and comparison, with sources, assumptions and points to review. Formats and acceptance criteria are defined in the quote.'],
    ],
    cta: 'Discuss your project', note: 'Start with the process, objective and timing. Before kickoff, agree the sources and who reviews the model. Do not send client documents in the first message.',
    quote: 'Amounts, payment split and schedule are set out in the quote before signing.',
  },
};

export default function PilotInvitation() {
  const { language } = useLanguage(); const t = copy[language];
  return <section id="pilot" className="premium-pilot scroll-mt-24 bg-white py-14 sm:py-20" aria-labelledby="pilot-invitation-title">
    <div className="section-shell grid items-center gap-10 lg:grid-cols-2">
      <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="pilot-invitation-title" className="landing-title mt-5">{t.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{t.body}</p>
        <a href={projectContactHref(language)} className="btn-primary mt-6">{t.cta}<ArrowRight aria-hidden="true" className="size-4" /></a>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">{t.note}</p><a className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>
      </div>
      <div data-reveal className="milestone-card rounded-3xl border border-slate-200 bg-brand-light p-6 sm:p-8"><p className="mb-5 text-sm font-semibold text-brand-blue">{t.example}</p><ol className="divide-y divide-slate-300">{t.steps.map(([title, description], index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 first:pt-0"><span className="pt-1 font-mono text-xs text-brand-blue">0{index + 1}</span><div><h3 className="text-lg font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div></li>)}</ol><p className="border-t border-slate-300 pt-5 text-xs leading-5 text-slate-600">{t.quote}</p></div>
    </div>
  </section>;
}
