import { ArrowRight, Boxes, BrainCircuit, Compass, Gauge, ShieldCheck } from 'lucide-react';
import visionImage from '../../artifacts/landing-media/vision/images/04-memory-under-the-operating-loop.png';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    chapter: '02 · La piattaforma',
    title: 'Non un altro tool. L’infrastruttura del lavoro consulenziale.',
    body: 'DeliR mantiene lo stesso contesto mentre l’incarico passa dalla comprensione del lavoro reale alla trasformazione, alla consegna e al governo nel tempo.',
    workspace: 'Engagement Workspace',
    workspaceBody: 'Clienti · Progetti · Obiettivi · Fonti · Decisioni · Deliverable',
    stages: [
      ['Understand', 'Discovery, Mining e Process Intelligence'],
      ['Evaluate', 'Simulation e confronto degli scenari'],
      ['Transform', 'Transformation & Delivery'],
      ['Govern', 'Management Systems'],
    ],
    memory: 'Company Memory',
    memoryBody: 'Contesto, provenance, versioni e impatti restano collegati sotto l’intero ciclo operativo.',
    governance: 'Continuous Governance',
    closing: 'Ogni capacità può sostenere un risultato specifico. Insieme, mantengono coerente l’intero incarico.',
    vision: 'Product vision',
    imageAlt: 'Vista DeliR della Company Memory come fondazione persistente sotto l’intero ciclo operativo.',
  },
  en: {
    chapter: '02 · The platform',
    title: 'Not another tool. The infrastructure for consulting work.',
    body: 'DeliR preserves the same context as the engagement moves from understanding real work to transformation, delivery and governance over time.',
    workspace: 'Engagement Workspace',
    workspaceBody: 'Clients · Projects · Objectives · Sources · Decisions · Deliverables',
    stages: [
      ['Understand', 'Discovery, Mining and Process Intelligence'],
      ['Evaluate', 'Simulation and scenario comparison'],
      ['Transform', 'Transformation & Delivery'],
      ['Govern', 'Management Systems'],
    ],
    memory: 'Company Memory',
    memoryBody: 'Context, provenance, versions and impacts stay connected beneath the entire operating cycle.',
    governance: 'Continuous Governance',
    closing: 'Each capability can support a specific outcome. Together, they keep the full engagement coherent.',
    vision: 'Product vision',
    imageAlt: 'DeliR view of Company Memory as the persistent foundation beneath the operating cycle.',
  },
} as const;

const icons = [Compass, Gauge, Boxes, ShieldCheck];

export default function Vision() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="product" className="section-defer relative scroll-mt-28 bg-white py-24 sm:py-28" aria-labelledby="platform-title">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-kicker justify-center"><span className="h-px w-7 bg-blue-600" />{t.chapter}<span className="h-px w-7 bg-blue-600" /></p>
          <h2 id="platform-title" className="section-title mt-6">{t.title}</h2>
          <p className="section-lead mx-auto mt-6">{t.body}</p>
        </div>

        <div className="mt-14 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_26px_80px_-55px_rgba(15,23,42,0.55)] sm:p-7 lg:p-9">
          <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Boxes aria-hidden="true" className="h-5 w-5" /></span>
              <div><h3 className="font-semibold text-slate-950">{t.workspace}</h3><p className="mt-1 text-sm text-slate-600">{t.workspaceBody}</p></div>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 sm:mt-0">{t.governance}<ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {t.stages.map(([title, body], index) => {
              const Icon = icons[index];
              return (
                <article key={title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="text-xs font-mono font-semibold text-slate-600">0{index + 1}</span>
                  <Icon aria-hidden="true" className="mt-6 h-5 w-5 text-blue-700" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-brand-navy p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300"><BrainCircuit aria-hidden="true" className="h-5 w-5" /></span>
              <div><h3 className="font-semibold text-white">{t.memory}</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{t.memoryBody}</p></div>
            </div>
            <span className="vision-badge mt-4 shrink-0 sm:mt-0">{t.vision}</span>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-medium leading-8 text-slate-800">{t.closing}</p>

        <figure className="mx-auto mt-12 max-w-5xl">
          <div className="product-frame relative">
            <span className="vision-badge absolute right-4 top-4 z-10">{t.vision}</span>
            <img src={visionImage} alt={t.imageAlt} width="1600" height="1000" loading="lazy" decoding="async" className="block h-auto w-full" />
          </div>
        </figure>
      </div>
    </section>
  );
}
