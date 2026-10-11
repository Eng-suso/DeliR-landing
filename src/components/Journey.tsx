import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { chapterClips } from '../lib/productClips';
import { useFragment } from '../lib/useFragment';
import ClipExplorer from './ClipExplorer';

const copy = {
  it: {
    eyebrow: 'Il prodotto, passo per passo', title: 'Segui una decisione. Guarda le prove.',
    intro: 'Dalle interviste al modello verificato, fino al confronto degli scenari. Esplora il passaggio che conta per il tuo incarico.',
    demo: 'Caso di acquisti indiretti · Azienda, persone e valori dimostrativi',
    modules: [
      { name: 'Workspace', title: 'Ritrova il contesto dell’incarico.', body: 'Fonti, decisioni aperte e avanzamento sono nello stesso progetto: puoi riprendere il lavoro senza ricostruire il contesto da zero.', output: 'Contesto e fonti raccolti nel progetto', initial: 'memoria' },
      { name: 'Process Discovery', title: 'Chiarisci le lacune prima di modellare.', body: 'Confronta le informazioni nelle interviste e porta in review ciò che va chiarito. Una soglia non dichiarata resta una domanda, prima di diventare una regola nel modello.', output: 'Informazioni e punti aperti da verificare', initial: 'chat-discovery' },
      { name: 'Process Intelligence', title: 'Apri un’attività. Risali alle fonti.', body: 'Discuti il BPMN insieme alle evidenze che lo sostengono. La review rende visibili proposte e correzioni accanto al modello.', output: 'Modello AS-IS con evidenze e review', initial: 'evidenze-sul-processo' },
      { name: 'Process Mining', title: 'Individua dove il flusso si ferma.', body: 'Leggi attese e colli di bottiglia sul processo. Quando sono disponibili event log adeguati, puoi collegare l’analisi quantitativa al contesto operativo.', output: 'Attese, criticità e dettaglio degli eventi', initial: 'heatmap-collo-di-bottiglia' },
      { name: 'Simulation & Delivery', title: 'Confronta l’AS-IS con l’ipotesi TO-BE.', body: 'Esamina gli indicatori insieme alle assunzioni di scenario. Il confronto aiuta a discutere la proposta prima dell’implementazione; i valori della demo non sono risultati garantiti.', output: 'Confronto degli scenari per la raccomandazione', initial: 'confronto' },
    ],
    nav: 'Viste del prodotto', result: 'Cosa valuti', action: 'Valuta il pilot sul tuo progetto',
  },
  en: {
    eyebrow: 'The product, step by step', title: 'Follow a decision. Inspect the evidence.',
    intro: 'From interviews to a reviewed model and scenario comparison. Explore the step that matters for your engagement.',
    demo: 'Indirect procurement demo · Fictional company, people and values',
    modules: [
      { name: 'Workspace', title: 'Keep the engagement context at hand.', body: 'Sources, open decisions and progress share one project so you can pick up the work without rebuilding its context.', output: 'Project context and collected sources', initial: 'memoria' },
      { name: 'Process Discovery', title: 'Resolve gaps before modeling.', body: 'Compare interview information and review what needs clarification. An unstated threshold stays a question before becoming a rule in the model.', output: 'Information and open questions to review', initial: 'chat-discovery' },
      { name: 'Process Intelligence', title: 'Open an activity. Trace its sources.', body: 'Discuss BPMN alongside its supporting evidence. Review keeps proposals and corrections next to the model.', output: 'AS-IS model with evidence and review', initial: 'evidenze-sul-processo' },
      { name: 'Process Mining', title: 'Find where the flow stalls.', body: 'Inspect waits and bottlenecks on the process. Suitable event logs connect quantitative analysis to the operating context.', output: 'Waits, constraints and event detail', initial: 'heatmap-collo-di-bottiglia' },
      { name: 'Simulation & Delivery', title: 'Compare AS-IS with the TO-BE hypothesis.', body: 'Inspect indicators alongside scenario assumptions. Compare the proposal before implementation; demo values are not guaranteed outcomes.', output: 'Scenario comparison for the recommendation', initial: 'confronto' },
    ],
    nav: 'Product views', result: 'What you evaluate', action: 'Explore a pilot for your project',
  },
};

export default function Journey() {
  const { language } = useLanguage();
  const fragment = useFragment();
  const t = copy[language];
  const chapterIndex = /^product-0[1-5]$/.test(fragment) ? Number(fragment.slice(-1)) - 1 : -1;
  const sceneIndex = fragment.startsWith('scene-') ? chapterClips.findIndex(clips => clips.some(clip => `scene-${clip.id}` === fragment)) : -1;
  const activeIndex = chapterIndex >= 0 ? chapterIndex : sceneIndex >= 0 ? sceneIndex : 2;

  return (
    <section id="caso" className="premium-journey scroll-mt-24 border-y border-slate-200 bg-brand-light py-14 sm:py-20" aria-labelledby="journey-title">
      <div className="section-shell">
        <div data-reveal className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="journey-title" className="landing-title mt-4 max-w-[22ch]">{t.title}</h2></div>
          <p className="max-w-xl text-base leading-7 text-slate-600">{t.intro}</p>
        </div>
        <nav aria-label={t.nav} className="mt-8">
          <ol className="grid gap-2 min-[400px]:grid-cols-2 lg:grid-cols-5">
            {t.modules.map((module, index) => <li key={module.name}><a href={`#product-0${index + 1}`} aria-current={index === activeIndex ? 'step' : undefined} className={`product-index-link h-full ${index === activeIndex ? '!border-brand-blue !bg-brand-blue !text-white' : ''}`}><span aria-hidden="true" className="font-mono text-xs">0{index + 1}</span><span>{module.name}</span></a></li>)}
          </ol>
        </nav>
        {t.modules.map((module, index) => <article id={`product-0${index + 1}`} data-product-module={module.name} hidden={index !== activeIndex} key={module.name} className="scroll-mt-24 pt-8">
          {index === activeIndex ? <div className="grid gap-7 lg:grid-cols-[0.37fr_0.63fr] lg:items-start lg:gap-9">
            <div data-reveal className="journey-description lg:pt-6">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">0{index + 1} / {module.name}</span>
              <h3 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">{module.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{module.body}</p>
              <div className="mt-6 border-l-2 border-brand-blue pl-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{t.result}</p><p className="mt-2 text-sm leading-6 text-slate-700">{module.output}</p></div>
              <p className="mt-6 text-xs leading-5 text-slate-500">{t.demo}</p>
            </div>
            <ClipExplorer clips={chapterClips[index]} name={module.name} initial={module.initial} />
          </div> : null}
        </article>)}
        <div className="mt-7 flex justify-end"><a href="#pilot" className="btn-text">{t.action}<ArrowRight aria-hidden="true" className="size-4" /></a></div>
      </div>
    </section>
  );
}
