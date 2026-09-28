import { ArrowRight, DatabaseZap, FileSearch, GitCompareArrows, LineChart, Network, Rocket, ShieldCheck } from 'lucide-react';
import discoveryImage from '../../artifacts/landing-media/images/02-ai-process-discovery.png';
import intelligenceImage from '../../artifacts/landing-media/images/04-bpmn-evidence.png';
import miningImage from '../../artifacts/landing-media/images/05-bottleneck-heatmap.png';
import simulationImage from '../../artifacts/landing-media/images/06-simulation-replay.png';
import deliveryImage from '../../artifacts/landing-media/images/07-business-case.png';
import managementImage from '../../artifacts/landing-media/vision/images/02-management-system-engine.png';
import memoryImage from '../../artifacts/landing-media/vision/images/01-company-memory-temporal-provenance.png';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    chapter: '03 · Le capacità',
    title: 'Parti dal risultato che serve al cliente. Mantieni tutto collegato.',
    body: 'Usa una capacità per un’esigenza mirata oppure combinale nello stesso incarico senza ricostruire ogni volta fonti, assunzioni e decisioni.',
    groups: { understand: 'Comprendere', evaluate: 'Valutare', transform: 'Trasformare', govern: 'Governare' },
    capabilities: [
      ['Process Discovery', 'Ricostruisci ciò che accade davvero.', 'Trasforma interviste, documenti, procedure e conoscenza operativa in claim verificabili, contraddizioni, informazioni mancanti e prime ipotesi di processo.', 'Evidenze · Claim · Gap informativi · Bozza del processo'],
      ['Process Mining', 'Osserva come il processo si comporta nei dati.', 'Analizza event log, varianti, attese, rilavorazioni e colli di bottiglia per distinguere il processo dichiarato da quello realmente eseguito.', 'Varianti · Tempi · Code · WIP · Colli di bottiglia'],
      ['Process Intelligence', 'Collega processo, evidenze e responsabilità.', 'Costruisci un As-Is verificabile in cui attività, ruoli, sistemi, rischi, KPI ed eccezioni restano collegati alle fonti che li sostengono.', 'As-Is · BPMN · KPI · Rischi · Provenance'],
      ['Process Simulation', 'Valuta le alternative prima di raccomandarle.', 'Simula baseline e scenari To-Be, esplicita vincoli e assunzioni e confronta l’effetto delle alternative su tempi, costi, capacità e servizio.', 'Baseline · What-if · Confronto scenari · Impatto stimato'],
      ['Transformation & Delivery', 'Porta la decisione nella realtà.', 'Trasforma la raccomandazione in business case, requisiti, RACI, SOP, roadmap, piano di implementazione e monitoraggio dei risultati.', 'Business case · Requisiti · RACI · SOP · Roadmap'],
      ['Management Systems', 'Costruisci un sistema che rimane governabile.', 'Collega requisiti, rischi, controlli, owner, procedure, audit, finding e azioni correttive per mantenere il sistema di gestione pronto al cambiamento.', 'Gap analysis · Controlli · Audit readiness · CAPA'],
      ['Company Memory', 'Conserva il contesto, non soltanto i file.', 'Mantieni nel tempo persone, processi, sistemi, evidenze, decisioni, requisiti, KPI e cambiamenti con versioni, provenance e separazione dei clienti.', 'Memoria temporale · Versioni · Provenance · Impact history'],
    ],
    vision: 'Product vision',
  },
  en: {
    chapter: '03 · The capabilities',
    title: 'Start with the outcome the client needs. Keep everything connected.',
    body: 'Use one capability for a focused need or combine them in one engagement without rebuilding sources, assumptions and decisions at every stage.',
    groups: { understand: 'Understand', evaluate: 'Evaluate', transform: 'Transform', govern: 'Govern' },
    capabilities: [
      ['Process Discovery', 'Reconstruct what really happens.', 'Turn interviews, documents, procedures and operational knowledge into verifiable claims, contradictions, missing information and initial process hypotheses.', 'Evidence · Claims · Information gaps · Process draft'],
      ['Process Mining', 'Observe how the process behaves in data.', 'Analyze event logs, variants, waits, rework and bottlenecks to distinguish the stated process from what is actually executed.', 'Variants · Time · Queues · WIP · Bottlenecks'],
      ['Process Intelligence', 'Connect process, evidence and accountability.', 'Build a verifiable As-Is where activities, roles, systems, risks, KPIs and exceptions remain linked to their supporting sources.', 'As-Is · BPMN · KPIs · Risks · Provenance'],
      ['Process Simulation', 'Evaluate alternatives before recommending them.', 'Simulate baselines and To-Be scenarios, make constraints and assumptions explicit and compare their effect on time, cost, capacity and service.', 'Baseline · What-if · Scenario comparison · Estimated impact'],
      ['Transformation & Delivery', 'Carry the decision into reality.', 'Turn the recommendation into a business case, requirements, RACI, SOPs, roadmap, implementation plan and results monitoring.', 'Business case · Requirements · RACI · SOPs · Roadmap'],
      ['Management Systems', 'Build a system that stays governable.', 'Connect requirements, risks, controls, owners, procedures, audits, findings and corrective actions so the management system remains ready for change.', 'Gap analysis · Controls · Audit readiness · CAPA'],
      ['Company Memory', 'Preserve context, not just files.', 'Maintain people, processes, systems, evidence, decisions, requirements, KPIs and change over time with versions, provenance and client isolation.', 'Temporal memory · Versions · Provenance · Impact history'],
    ],
    vision: 'Product vision',
  },
} as const;

const icons = [FileSearch, DatabaseZap, Network, GitCompareArrows, Rocket, ShieldCheck, LineChart];
const images = [discoveryImage, miningImage, intelligenceImage, simulationImage, deliveryImage, managementImage, memoryImage];

function CapabilityCard({ item, index, vision }: { item: readonly string[]; index: number; vision: string }) {
  const Icon = icons[index];
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_-42px_rgba(15,23,42,0.5)]">
      <div className="relative border-b border-slate-200 bg-slate-50">
        {index >= 5 ? <span className="vision-badge absolute right-3 top-3 z-10">{vision}</span> : null}
        <img src={images[index]} alt="" width="1600" height="1000" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon aria-hidden="true" className="h-5 w-5" /></span>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{item[0]}</p>
        </div>
        <h4 className="mt-5 text-xl font-semibold text-slate-950">{item[1]}</h4>
        <p className="mt-3 text-sm leading-6 text-slate-600">{item[2]}</p>
        <p className="mt-5 border-t border-slate-200 pt-4 text-xs font-semibold leading-5 text-slate-500">{item[3]}</p>
      </div>
    </article>
  );
}

export default function ManagerSwitch() {
  const { language } = useLanguage();
  const t = copy[language];
  const c = t.capabilities;

  return (
    <section id="capabilities" className="section-defer relative scroll-mt-28 bg-brand-mist py-24 sm:py-28" aria-labelledby="capabilities-title">
      <div className="section-shell">
        <div className="max-w-4xl">
          <p className="section-kicker"><span className="h-px w-7 bg-blue-600" />{t.chapter}</p>
          <h2 id="capabilities-title" className="section-title mt-6">{t.title}</h2>
          <p className="section-lead mt-6">{t.body}</p>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-4"><span className="font-mono text-sm font-semibold text-blue-700">01</span><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{t.groups.understand}</h3><span className="h-px flex-1 bg-slate-300" /></div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">{c.slice(0, 3).map((item, index) => <CapabilityCard key={item[0]} item={item} index={index} vision={t.vision} />)}</div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div><div className="flex items-center gap-4"><span className="font-mono text-sm font-semibold text-blue-700">02</span><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{t.groups.evaluate}</h3><span className="h-px flex-1 bg-slate-300" /></div><div className="mt-6"><CapabilityCard item={c[3]} index={3} vision={t.vision} /></div></div>
          <div><div className="flex items-center gap-4"><span className="font-mono text-sm font-semibold text-blue-700">03</span><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{t.groups.transform}</h3><span className="h-px flex-1 bg-slate-300" /></div><div className="mt-6"><CapabilityCard item={c[4]} index={4} vision={t.vision} /></div></div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-4"><span className="font-mono text-sm font-semibold text-blue-700">04</span><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{t.groups.govern}</h3><span className="h-px flex-1 bg-slate-300" /></div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">{c.slice(5).map((item, offset) => <CapabilityCard key={item[0]} item={item} index={offset + 5} vision={t.vision} />)}</div>
        </div>

        <div className="mt-10 flex justify-end"><a href="#incarico" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-blue-700 hover:text-blue-900">{language === 'it' ? 'Segui un incarico end-to-end' : 'Follow an end-to-end engagement'}<ArrowRight aria-hidden="true" className="h-4 w-4" /></a></div>
      </div>
    </section>
  );
}
