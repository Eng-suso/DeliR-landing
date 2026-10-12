import { ArrowRight, FileCheck2, Files, GitCompareArrows, RefreshCw, Workflow } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const icons = [Files, FileCheck2, Workflow, GitCompareArrows, RefreshCw];
const copy = {
  it: {
    label: 'Un contesto che resta con te',
    body: 'Documenti, interviste, evidenze e decisioni restano nello stesso contesto, dall’As-Is al confronto degli scenari To-Be.',
    path: 'Dalla conoscenza alle decisioni',
    steps: ['Documenti e interviste', 'Evidenze', 'As-Is', 'To-Be', 'Miglioramento continuo'],
  },
  en: {
    label: 'Context that stays with you',
    body: 'Documents, interviews, evidence and decisions stay in one context, from the As-Is to To-Be scenario comparison.',
    path: 'From knowledge to decisions',
    steps: ['Documents and interviews', 'Evidence', 'As-Is', 'To-Be', 'Continuous improvement'],
  },
};

export default function ProcessBridge() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="process-context" aria-labelledby="process-context-label" className="scroll-mt-24 border-t border-slate-200 bg-brand-mist py-10 sm:py-12">
      <div className="section-shell">
        <p id="process-context-label" className="landing-eyebrow">{t.label}</p>
        <p className="mt-4 max-w-4xl text-pretty text-xl font-medium leading-8 text-brand-ink sm:text-2xl sm:leading-9">{t.body}</p>
        <ol aria-label={t.path} className="mt-7 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-3">
          {t.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <li key={step} className="flex min-w-0 items-center gap-3">
                <span aria-hidden="true" className="font-mono text-xs text-brand-blue sm:hidden">0{index + 1}</span>
                <Icon aria-hidden="true" className="size-5 shrink-0 text-brand-blue" />
                <span className="text-base font-semibold leading-6 text-brand-ink">{step}</span>
                {index < t.steps.length - 1 ? <ArrowRight aria-hidden="true" className="ml-1 hidden size-4 shrink-0 text-brand-blue sm:block" /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
