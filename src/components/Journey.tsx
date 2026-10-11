import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productClips } from '../lib/productClips';
import { useFragment } from '../lib/useFragment';
import ClipExplorer from './ClipExplorer';

// Keep scene deep links and give each recording one home in the story.
const benefits = [
  { id: 'product-03', initial: 'evidenze-sul-processo', clips: [productClips.evidence, productClips.sources, productClips.review, productClips.corrected, productClips.owner] },
  { id: 'product-02', initial: 'lacuna-aperta', clips: [productClips.gap, productClips.chat, productClips.hidden] },
  { id: 'product-01', initial: 'memoria', clips: [productClips.memory] },
  { id: 'product-04', initial: 'review-to-be', clips: [productClips.reviewToBe, productClips.hypothesis] },
  { id: 'product-05', initial: 'confronto', clips: [productClips.comparison, productClips.simulationAsIs, productClips.simulationToBe, productClips.heatmap, productClips.eventLog] },
];

const copy = {
  it: {
    eyebrow: 'La soluzione, nel tuo lavoro',
    title: 'Dalla conoscenza dispersa a raccomandazioni che puoi spiegare.',
    intro: 'DeliR mantiene nello stesso contesto le fonti, l’As-Is da verificare con il cliente e le ipotesi To-Be. Guarda come questo ti aiuta, dall’intervista alla raccomandazione.',
    demo: 'Caso di acquisti indiretti · Azienda, persone e valori dimostrativi',
    modules: [
      { name: 'Evidenze', title: 'Risali alle fonti dietro il processo.', body: 'Apri un’attività BPMN insieme alle evidenze che ne conservano il contesto. Puoi discutere con il cliente da dove viene il modello e cosa resta da verificare.', output: 'Modello, fonti e review nello stesso contesto' },
      { name: 'Lacune', title: 'Scopri cosa le interviste lasciano aperto.', body: 'Una soglia non dichiarata o un passaggio ambiguo resta una domanda da chiarire. Porta le lacune in review prima che diventino assunzioni nel tuo As-Is.', output: 'Informazioni mancanti rese visibili nel discovery' },
      { name: 'Contesto', title: 'Riprendi l’incarico senza ripartire da zero.', body: 'Obiettivo, fonti, decisioni e avanzamento restano nel progetto. Quando torni sul cliente, ritrovi il contesto del lavoro e i punti ancora aperti.', output: 'Contesto dell’incarico conservato nel progetto' },
      { name: 'Decisioni', title: 'Spiega le modifiche che raccomandi.', body: 'Esamina le proposte To-Be sul processo, insieme ai punti da verificare. Discuti le ragioni del cambiamento mantenendo distinte le ipotesi dalle decisioni confermate.', output: 'Proposte di modifica e review sul processo' },
      { name: 'Scenari', title: 'Confronta le opzioni prima di proporre il cambiamento.', body: 'Simula l’As-Is e le ipotesi To-Be. Leggi gli indicatori insieme ai parametri e alle assunzioni: il confronto sostiene la discussione, senza trasformare una simulazione in una promessa di risultato.', output: 'Scenari confrontati con le loro assunzioni' },
    ],
    nav: 'Benefici DeliR', result: 'Cosa ti porti nel lavoro', action: 'Valuta il pilot sul tuo progetto',
    principle: 'Comprendi cosa succede. Valuta cosa potrebbe succedere. Continua a migliorare.',
  },
  en: {
    eyebrow: 'The solution, in your work',
    title: 'Turn scattered knowledge into recommendations you can explain.',
    intro: 'DeliR keeps sources, the As-Is you review with your client, and To-Be hypotheses in one context. See how that supports your work, from interview to recommendation.',
    demo: 'Indirect procurement demo · Fictional company, people and values',
    modules: [
      { name: 'Evidence', title: 'Trace your process back to its sources.', body: 'Open a BPMN activity alongside the evidence that retains its context. Discuss with your client where the model comes from and what still needs verification.', output: 'Model, sources and review in one context' },
      { name: 'Gaps', title: 'Find what process interviews leave unresolved.', body: 'An unstated threshold or an ambiguous handoff stays a question to resolve. Bring gaps into review before they become assumptions in your As-Is.', output: 'Missing information made visible during discovery' },
      { name: 'Context', title: 'Pick up the engagement without starting over.', body: 'Goals, sources, decisions and progress stay in the project. When you return to the client, find the context of your work and the questions still open.', output: 'Engagement context retained in the project' },
      { name: 'Decisions', title: 'Explain the changes you recommend.', body: 'Inspect To-Be proposals on the process alongside points that need verification. Discuss the reasons for change while keeping hypotheses separate from confirmed decisions.', output: 'Proposed changes and review on the process' },
      { name: 'Scenarios', title: 'Compare options before recommending a change.', body: 'Simulate the As-Is and To-Be hypotheses. Read indicators alongside parameters and assumptions: the comparison supports the discussion without turning a simulation into a promise of results.', output: 'Scenarios compared alongside their assumptions' },
    ],
    nav: 'DeliR benefits', result: 'What you take into your work', action: 'Explore a pilot for your project',
    principle: 'Understand what happens. Test what could happen. Keep making it better.',
  },
};

export default function Journey() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];

  return (
    <section id="caso" className="premium-journey scroll-mt-24 border-y border-slate-200 bg-brand-light py-14 sm:py-20" aria-labelledby="journey-title">
      <div className="section-shell">
        <div data-reveal className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="journey-title" className="landing-title mt-4 max-w-[24ch]">{t.title}</h2></div>
          <div><p className="max-w-xl text-base leading-7 text-slate-600">{t.intro}</p><p className="mt-4 text-xs leading-5 text-slate-600">{t.demo}</p></div>
        </div>
        <nav aria-label={t.nav} className="mt-8">
          <ol className="grid gap-2 min-[400px]:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit, index) => {
              const selected = fragment === benefit.id || benefit.clips.some(clip => fragment === `scene-${clip.id}`);
              return <li key={benefit.id}><a href={`#${benefit.id}`} aria-current={selected ? 'location' : undefined} className={`product-index-link h-full ${selected ? '!border-brand-blue !bg-brand-blue !text-white' : ''}`}><span aria-hidden="true" className="font-mono text-xs">0{index + 1}</span><span>{t.modules[index].name}</span></a></li>;
            })}
          </ol>
        </nav>
        <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-16 lg:space-y-20">
          {benefits.map((benefit, index) => {
            const module = t.modules[index];
            return <article id={benefit.id} aria-labelledby={`${benefit.id}-title`} data-product-module={module.name} data-product-benefit={index < 4 ? 'true' : undefined} key={benefit.id} className={`scroll-mt-24 ${index > 0 ? 'border-t border-slate-200 pt-10 sm:pt-14' : ''}`}>
              <div className="grid gap-7 lg:grid-cols-[0.37fr_0.63fr] lg:items-start lg:gap-9">
                <div data-reveal className="journey-description min-w-0 lg:pt-6">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">0{index + 1} / {module.name}</span>
                  <h3 id={`${benefit.id}-title`} className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
                  <div className="mt-6 border-l-2 border-brand-blue pl-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{t.result}</p><p className="mt-2 text-sm leading-6 text-slate-700">{module.output}</p></div>
                </div>
                <ClipExplorer clips={benefit.clips} name={module.name} initial={benefit.initial} />
              </div>
            </article>;
          })}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 lg:flex-row lg:items-center lg:justify-between"><p className="max-w-2xl text-base font-medium leading-7 text-brand-ink">{t.principle}</p><a href="#pilot" className="btn-text">{t.action}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
      </div>
    </section>
  );
}
