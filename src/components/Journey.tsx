import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectImage from '../../artifacts/landing-media/images/01-project-control-room.png';
import discoveryImage from '../../artifacts/landing-media/images/02-ai-process-discovery.png';
import evidenceImage from '../../artifacts/landing-media/images/04-bpmn-evidence.png';
import bottleneckImage from '../../artifacts/landing-media/images/05-bottleneck-heatmap.png';
import businessCaseImage from '../../artifacts/landing-media/images/07-business-case.png';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    chapter: '04 · L’incarico',
    title: 'Dalla domanda iniziale a una decisione che puoi sostenere.',
    body: 'Lo stesso incarico Purchase-to-Pay attraversa cinque momenti. Fonti, assunzioni e decisioni restano collegate mentre il lavoro avanza.',
    steps: [
      ['Imposta l’incarico', 'Definisci obiettivi, perimetro, milestone, decisioni e deliverable. Il lavoro parte da un contesto condiviso, non da una pagina vuota.'],
      ['Ricomponi le evidenze', 'Trasforma fonti diverse in informazioni verificabili, contraddizioni e questioni da chiarire con il cliente.'],
      ['Verifica l’As-Is', 'Collega ogni elemento del processo alle fonti e separa fatti, parafrasi e assunzioni ancora aperte.'],
      ['Misura la criticità', 'Rendi visibili attese, varianti, carico, code e colli di bottiglia prima di progettare il cambiamento.'],
      ['Sostieni la raccomandazione', 'Confronta gli scenari e porta al cliente impatto, condizioni, trade-off e percorso di implementazione.'],
    ],
    cta: 'Valuta un incarico con DeliR',
    labels: ['Control room del progetto', 'Discovery guidata dalle fonti', 'BPMN collegato alle evidenze', 'Heatmap dei colli di bottiglia', 'Business case dello scenario'],
  },
  en: {
    chapter: '04 · The engagement',
    title: 'From the initial question to a decision you can defend.',
    body: 'The same Purchase-to-Pay engagement moves through five moments. Sources, assumptions and decisions stay connected as the work progresses.',
    steps: [
      ['Set up the engagement', 'Define objectives, scope, milestones, decisions and deliverables. Work starts from shared context, not a blank page.'],
      ['Reconstruct the evidence', 'Turn different sources into verifiable information, contradictions and questions to resolve with the client.'],
      ['Verify the As-Is', 'Link every process element to its sources and separate facts, paraphrases and open assumptions.'],
      ['Measure the constraint', 'Make waits, variants, load, queues and bottlenecks visible before designing change.'],
      ['Defend the recommendation', 'Compare scenarios and bring the client impact, conditions, trade-offs and an implementation path.'],
    ],
    cta: 'Evaluate an engagement with DeliR',
    labels: ['Project control room', 'Source-led discovery', 'BPMN linked to evidence', 'Bottleneck heatmap', 'Scenario business case'],
  },
} as const;

const images = [projectImage, discoveryImage, evidenceImage, bottleneckImage, businessCaseImage];

export default function Journey() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="incarico" className="section-defer relative scroll-mt-28 bg-white py-24 sm:py-28" aria-labelledby="journey-title">
      <div className="section-shell">
        <div className="max-w-4xl">
          <p className="section-kicker"><span className="h-px w-7 bg-blue-600" />{t.chapter}</p>
          <h2 id="journey-title" className="section-title mt-6">{t.title}</h2>
          <p className="section-lead mt-6">{t.body}</p>
        </div>

        <ol className="mt-16 space-y-20 sm:space-y-24">
          {t.steps.map(([title, body], index) => (
            <li key={title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy font-mono text-sm font-semibold text-white">{String(index + 1).padStart(2, '0')}</span><span className="h-px w-12 bg-slate-300" /></div>
                <h3 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">{body}</p>
              </div>
              <figure className={`product-frame ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <img src={images[index]} alt={t.labels[index]} width="1600" height="1000" loading="lazy" decoding="async" className="block aspect-[16/10] w-full object-cover object-top" />
              </figure>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex justify-center"><Link to="/pilot" className="btn-primary">{t.cta}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}
