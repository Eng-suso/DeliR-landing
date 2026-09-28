import { ArrowRight, CheckCircle2, ClipboardCheck, SearchCheck, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Pilot DeliR',
    title: 'Porta un incarico reale. Valutiamo insieme dove DeliR crea valore.',
    body: 'Il pilot parte da un progetto attivo o in partenza. Valutiamo il fit, concordiamo il perimetro e definiamo i criteri di successo prima di iniziare.',
    fitTitle: 'È adatto quando devi:',
    fit: ['analizzare o migliorare un processo reale', 'ricomporre fonti, stakeholder e decisioni', 'valutare scenari To-Be o un business case', 'progettare delivery o sistemi di gestione'],
    steps: [
      ['Descrivi l’incarico', 'Bastano obiettivo, problema e tempistica. Non servono documenti del cliente.'],
      ['Valutiamo il fit', 'Verifichiamo insieme dove DeliR può sostenere il lavoro.'],
      ['Concordiamo il pilot', 'Perimetro e criteri di successo vengono definiti prima di iniziare.'],
    ],
    assurances: ['Pilot accompagnato', 'Nessun abbonamento automatico', 'Contesti cliente separati'],
    cta: 'Candida un incarico al pilot',
    privacy: 'Nella candidatura non inserire nomi di clienti, dati personali o informazioni riservate.',
  },
  en: {
    eyebrow: 'DeliR pilot',
    title: 'Bring a real engagement. Let’s evaluate where DeliR creates value.',
    body: 'The pilot starts from an active or upcoming project. We assess fit, agree scope and define success criteria before starting.',
    fitTitle: 'It fits when you need to:',
    fit: ['analyze or improve a real process', 'reconstruct sources, stakeholders and decisions', 'evaluate To-Be scenarios or a business case', 'design delivery or management systems'],
    steps: [
      ['Describe the engagement', 'Objective, problem and timing are enough. No client documents are required.'],
      ['We assess fit', 'Together we identify where DeliR can support the work.'],
      ['We agree the pilot', 'Scope and success criteria are defined before starting.'],
    ],
    assurances: ['Guided pilot', 'No automatic subscription', 'Client contexts remain separate'],
    cta: 'Apply with an engagement',
    privacy: 'Do not include client names, personal data or confidential information in the application.',
  },
} as const;

const icons = [Send, SearchCheck, ClipboardCheck];

export default function PilotInvitation() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section id="pilot" className="section-defer relative scroll-mt-28 bg-white py-24 sm:py-28" aria-labelledby="pilot-invitation-title">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] border border-blue-200 bg-blue-50/60 shadow-[0_30px_90px_-60px_rgba(30,64,175,0.55)]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
            <div>
              <p className="section-kicker">{t.eyebrow}</p>
              <h2 id="pilot-invitation-title" className="section-title mt-6">{t.title}</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">{t.body}</p>
              <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-slate-700">{t.fitTitle}</h3>
              <ul className="mt-4 space-y-3">{t.fit.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />{item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <ol className="space-y-7">{t.steps.map(([title, body], index) => { const Icon = icons[index]; return <li key={title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white"><Icon aria-hidden="true" className="h-5 w-5" /></span><div><p className="text-xs font-mono font-semibold text-blue-700">0{index + 1}</p><h3 className="mt-1 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div></li>; })}</ol>
              <div className="mt-8 border-t border-slate-200 pt-6"><ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">{t.assurances.map((item) => <li key={item} className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-blue-700" />{item}</li>)}</ul><Link to="/pilot" className="btn-primary mt-6 w-full">{t.cta}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link><p className="mt-4 text-center text-xs leading-5 text-slate-500">{t.privacy}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
