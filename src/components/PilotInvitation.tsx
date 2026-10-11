import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { projectContactHref, publicContactEmail } from '../lib/publicOffer';

const copy = {
  it: {
    eyebrow: 'Pilot a pagamento · per milestone', title: 'Un processo. Obiettivi concordati. Pagamenti per fasi.',
    body: 'Porta un incarico attivo o in partenza. Definiamo insieme il perimetro, gli output, la durata e i criteri di accettazione. Il preventivo ripartisce il compenso tra firma e raggiungimento delle milestone.',
    steps: [
      ['Firma e avvio', 'Una prima quota alla firma, con perimetro, fonti, responsabilità e obiettivi concordati.'],
      ['AS-IS e TO-BE', 'Quote collegate al raggiungimento degli obiettivi definiti per ricostruzione AS-IS e proposta TO-BE.'],
      ['Consegna al process owner', 'Handover degli output concordati al process owner, secondo i criteri di accettazione del pilot.'],
    ],
    cta: 'Parliamo del tuo progetto', note: 'Nel primo messaggio bastano processo, obiettivo e tempistica. Nessun documento del cliente.',
    quote: 'Importi, ripartizione e calendario vengono definiti nel preventivo prima della firma.',
  },
  en: {
    eyebrow: 'Paid pilot · by milestone', title: 'One process. Agreed objectives. Payment in stages.',
    body: 'Bring an active or upcoming engagement. Together we define scope, outputs, duration and acceptance criteria. The quote splits payment between signing and achieving milestones.',
    steps: [
      ['Signing and kickoff', 'An initial payment at signing, with agreed scope, sources, responsibilities and objectives.'],
      ['AS-IS and TO-BE', 'Payments tied to agreed objectives for AS-IS reconstruction and the TO-BE proposal.'],
      ['Process owner handover', 'Delivery of agreed outputs to the process owner against the pilot’s acceptance criteria.'],
    ],
    cta: 'Discuss your project', note: 'Start with the process, objective and timing. No client documents in the first message.',
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
      <div data-reveal className="milestone-card rounded-3xl border border-slate-200 bg-brand-light p-6 sm:p-8"><ol className="divide-y divide-slate-300">{t.steps.map(([title, description], index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 first:pt-0"><span className="pt-1 font-mono text-xs text-brand-blue">0{index + 1}</span><div><h3 className="text-lg font-semibold text-brand-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div></li>)}</ol><p className="border-t border-slate-300 pt-5 text-xs leading-5 text-slate-600">{t.quote}</p></div>
    </div>
  </section>;
}
