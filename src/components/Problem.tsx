import { FileStack, Link2Off, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    chapter: '01 · Il costo della frammentazione',
    title: 'Il cliente vede un unico incarico. Tu devi ricomporlo ogni volta.',
    body: 'Interviste, procedure, fogli di calcolo, event log, modelli, simulazioni e requisiti vivono in strumenti diversi. Ogni passaggio perde una parte del contesto e rende più difficile capire perché una decisione è stata presa.',
    cards: [
      ['Il processo si frammenta', 'Fonti e versioni raccontano realtà diverse.'],
      ['La decisione perde le prove', 'KPI, assunzioni e raccomandazioni restano separati.'],
      ['Il metodo riparte da zero', 'La conoscenza costruita nell’incarico non diventa patrimonio della practice.'],
    ],
    closing: 'Finché il lavoro rimane frammentato, sei tu a fare da sistema di integrazione. E sei tu ad assorbirne il rischio.',
  },
  en: {
    chapter: '01 · The cost of fragmentation',
    title: 'The client sees one engagement. You have to rebuild it every time.',
    body: 'Interviews, procedures, spreadsheets, event logs, models, simulations and requirements live in different tools. Every handoff loses context and makes it harder to explain why a decision was made.',
    cards: [
      ['The process fragments', 'Sources and versions tell different stories.'],
      ['The decision loses its evidence', 'KPIs, assumptions and recommendations stay separate.'],
      ['The method starts over', 'Knowledge built in one engagement never becomes practice memory.'],
    ],
    closing: 'As long as the work stays fragmented, you are the integration layer—and you absorb the risk.',
  },
} as const;

const icons = [FileStack, Link2Off, RefreshCcw];

export default function Problem() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="problem" className="section-defer relative scroll-mt-28 border-y border-slate-200 bg-slate-950 py-24 text-white sm:py-28" aria-labelledby="problem-title">
      <div className="section-shell">
        <p className="section-kicker !text-blue-300"><span className="h-px w-7 bg-blue-400" />{t.chapter}</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 id="problem-title" className="max-w-[15ch] text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
            {t.title}
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">{t.body}</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.cards.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-blue-300"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </article>
            );
          })}
        </div>

        <blockquote className="mt-14 max-w-5xl border-l-2 border-blue-400 pl-6 text-balance font-display text-2xl font-medium leading-snug text-white sm:text-3xl">
          {t.closing}
        </blockquote>
      </div>
    </section>
  );
}
