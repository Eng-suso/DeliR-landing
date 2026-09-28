import { BookOpenCheck, BriefcaseBusiness, FileCheck2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Costruito per chi firma l’analisi',
    title: 'Più controllo sul delivery. Più valore nel metodo.',
    body: 'DeliR è progettato per consulenti indipendenti e piccole practice che seguono direttamente l’incarico e devono poter sostenere ogni output davanti al cliente.',
    cards: [
      ['Delivery verificabile', 'Mantieni visibili fonti, assunzioni, versioni e decisioni prima che l’output arrivi al cliente.'],
      ['Meno ricostruzioni manuali', 'Riutilizza struttura e metodo senza mescolare i contesti dei clienti o perdere la provenance.'],
      ['Conoscenza che resta', 'Trasforma ciò che impari durante ogni incarico in una base più solida per quello successivo.'],
    ],
  },
  en: {
    eyebrow: 'Built for the person signing off the analysis',
    title: 'More control over delivery. More value in the method.',
    body: 'DeliR is designed for independent consultants and small practices that directly own the engagement and must be able to defend every output in front of the client.',
    cards: [
      ['Verifiable delivery', 'Keep sources, assumptions, versions and decisions visible before the output reaches the client.'],
      ['Less manual reconstruction', 'Reuse structure and method without mixing client contexts or losing provenance.'],
      ['Knowledge that remains', 'Turn what you learn during each engagement into a stronger starting point for the next one.'],
    ],
  },
} as const;

const icons = [FileCheck2, BriefcaseBusiness, BookOpenCheck];

export default function BuiltFor() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section id="consultants" className="section-defer relative scroll-mt-28 border-y border-slate-200 bg-slate-50 py-24 sm:py-28" aria-labelledby="practice-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-32"><p className="section-kicker">{t.eyebrow}</p><h2 id="practice-title" className="section-title mt-6">{t.title}</h2><p className="section-lead mt-6">{t.body}</p></div>
        <div className="space-y-4">
          {t.cards.map(([title, body], index) => { const Icon = icons[index]; return <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 sm:flex sm:gap-5 sm:p-8"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon aria-hidden="true" className="h-5 w-5" /></span><div className="mt-5 sm:mt-0"><h3 className="text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-base leading-7 text-slate-600">{body}</p></div></article>; })}
        </div>
      </div>
    </section>
  );
}
