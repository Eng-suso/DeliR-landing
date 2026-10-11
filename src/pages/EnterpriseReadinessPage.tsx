import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDashed,
  Code2,
  Eye,
  Gauge,
  LockKeyhole,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TestTube2,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

type Status = 'Parziale' | 'Gap' | 'Bloccante';

const statusStyles: Record<Status, string> = {
  Parziale: 'border-amber-200 bg-amber-50 text-amber-800',
  Gap: 'border-slate-200 bg-slate-100 text-slate-700',
  Bloccante: 'border-rose-200 bg-rose-50 text-rose-700',
};

const capabilities = [
  {
    icon: Target,
    title: 'Strategia e conversione',
    status: 'Parziale' as Status,
    evidence: 'Value proposition e CTA esistono, ma manca una gerarchia di conversione misurabile per segmento.',
    outcome: 'ICP, promessa, obiezioni, funnel e KPI concordati.',
  },
  {
    icon: Megaphone,
    title: 'Messaging e copy',
    status: 'Parziale' as Status,
    evidence: 'Il problema e il prodotto sono spiegati bene; prove, risultati e trust signal sono ancora deboli.',
    outcome: 'Copy validato con clienti, proof points e messaggi specifici per ruolo.',
  },
  {
    icon: Sparkles,
    title: 'UI/UX e design system',
    status: 'Parziale' as Status,
    evidence: 'Direzione visiva coerente e demo ricca; token, stati, pattern e documentazione non sono formalizzati.',
    outcome: 'Sistema componenti coerente, responsive e mantenibile.',
  },
  {
    icon: Eye,
    title: 'Accessibilità',
    status: 'Gap' as Status,
    evidence: 'Non risultano audit WCAG, skip link, gestione reduced motion o test da tastiera documentati.',
    outcome: 'WCAG 2.2 AA target, tastiera, focus, contrasto e screen reader verificati.',
  },
  {
    icon: Search,
    title: 'SEO e discoverability',
    status: 'Gap' as Status,
    evidence: 'Il documento espone solo un title generico; mancano description, canonical, OG, sitemap, robots e schema.',
    outcome: 'Metadata completi, crawling controllato e pagine semanticamente indicizzabili.',
  },
  {
    icon: Gauge,
    title: 'Performance engineering',
    status: 'Gap' as Status,
    evidence: 'Il build produce un bundle JS principale di circa 804 kB minificato (259 kB gzip), oltre il warning Vite; non esistono budget o misure CWV registrate.',
    outcome: 'LCP < 2,5 s, INP < 200 ms, CLS < 0,1 al P75 e bundle budget in CI.',
  },
  {
    icon: BarChart3,
    title: 'Analytics e CRO',
    status: 'Gap' as Status,
    evidence: 'Nessuna tassonomia eventi, attribution, funnel o piano esperimenti è visibile nel progetto.',
    outcome: 'Eventi affidabili, dashboard funnel, baseline e backlog esperimenti.',
  },
  {
    icon: Users,
    title: 'Lead capture e lifecycle',
    status: 'Bloccante' as Status,
    evidence: 'Il form waitlist simula il successo con un timer: nessun dato viene inviato o conservato.',
    outcome: 'Endpoint reale, CRM/email, validazione server, anti-spam e gestione errori.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy e compliance',
    status: 'Bloccante' as Status,
    evidence: 'Privacy e Terms puntano a #; base giuridica, retention, consenso e informative non sono implementati.',
    outcome: 'Privacy by design, policy reali, registro vendor e consenso verificabile dove necessario.',
  },
  {
    icon: LockKeyhole,
    title: 'Security e supply chain',
    status: 'Bloccante' as Status,
    evidence: 'npm audit rileva 11 vulnerabilità: 4 high, 6 moderate e 1 low; gli header di produzione non sono verificati.',
    outcome: 'Zero High/Critical aperte, header sicuri, rate limit, secret scan e review OWASP.',
  },
  {
    icon: TestTube2,
    title: 'QA e test automation',
    status: 'Gap' as Status,
    evidence: 'Non risultano test unitari, e2e, visual regression, cross-browser o una pagina 404 dedicata.',
    outcome: 'Test dei percorsi critici su mobile/desktop e browser supportati, eseguiti in CI.',
  },
  {
    icon: Code2,
    title: 'Delivery e reliability',
    status: 'Gap' as Status,
    evidence: 'Non sono documentati CI/CD, ambienti, monitoring, alert, rollback, runbook o ownership operativa.',
    outcome: 'Staging e produzione governati, osservabilità, rollback provato e responsabilità chiare.',
  },
];

const mustHaveSkills = [
  ['01', 'Product & conversion strategy', 'Decide chi deve convertire, perché, verso quale azione e con quale metrica.'],
  ['02', 'Enterprise information architecture', 'Costruisce una narrativa breve, scansionabile e coerente con il buying journey.'],
  ['03', 'Conversion copywriting', 'Trasforma feature in outcome, prova e riduzione del rischio percepito.'],
  ['04', 'UI/UX + design system', 'Rende l’esperienza distintiva, consistente e manutenibile su ogni viewport.'],
  ['05', 'Accessibility engineering', 'Integra WCAG, tastiera, focus, semantica e motion safety nel Definition of Done.'],
  ['06', 'SEO + web performance', 'Gestisce metadata, struttura semantica, indicizzazione e Core Web Vitals.'],
  ['07', 'Analytics + experimentation', 'Collega ogni CTA a eventi, funnel, insight e test controllati.'],
  ['08', 'Secure lead engineering', 'Porta i lead dal form al sistema reale con validazione, anti-abuso e gestione errori.'],
  ['09', 'Privacy, legal & security assurance', 'Tratta GDPR, vendor, policy, dipendenze e hardening come requisiti di prodotto.'],
  ['10', 'Automated QA + reliable delivery', 'Converte requisiti in test, quality gate, deploy osservabile e rollback.'],
];

const skillStack = [
  {
    group: 'Orchestrazione',
    items: ['website-enterprise-delivery'],
    note: 'Già presente. È la skill guida per scope, NFR, rischi, GDPR, sicurezza e consegna.',
  },
  {
    group: 'Design e qualità UI',
    items: ['codex-design-agent', 'web-design-guidelines'],
    note: 'La prima è presente; la seconda è consigliata per audit ripetibili dell’interfaccia.',
  },
  {
    group: 'React e performance',
    items: ['vercel-react-best-practices', 'application-performance-performance-optimization'],
    note: 'Da aggiungere per bundle, rendering, Core Web Vitals e performance budget.',
  },
  {
    group: 'Accessibilità',
    items: ['accessibility-compliance-accessibility-audit'],
    note: 'Da rendere obbligatoria prima di ogni release pubblica.',
  },
  {
    group: 'Growth misurabile',
    items: ['analytics-tracking', 'ab-test-setup'],
    note: 'Da attivare dopo la definizione del funnel e nel rispetto del consenso.',
  },
  {
    group: 'Security assurance',
    items: ['api-security-best-practices', 'Security Scanning Tools'],
    note: 'Necessarie quando il form diventa reale e per il gate pre-produzione.',
  },
  {
    group: 'Test end-to-end',
    items: ['playwright'],
    note: 'Già presente come skill; va collegata a test reali e alla pipeline CI.',
  },
];

const roadmap = [
  {
    label: 'P0 · prima di acquisire lead',
    timing: 'Subito',
    items: ['Collegare il form a un backend reale', 'Pubblicare Privacy e Terms', 'Aggiornare le dipendenze vulnerabili', 'Aggiungere validazione server, rate limit e anti-spam'],
  },
  {
    label: 'P1 · prima del go-live',
    timing: '1–2 sprint',
    items: ['SEO tecnico e social preview', 'Audit WCAG e responsive', 'Test e2e dei percorsi critici', 'Security headers, monitoring e pagina 404'],
  },
  {
    label: 'P2 · dopo una baseline affidabile',
    timing: 'Continuo',
    items: ['Event taxonomy e dashboard funnel', 'Ricerca utenti e proof points', 'A/B test con ipotesi predefinite', 'Ottimizzazione CWV su dati reali'],
  },
];

export default function EnterpriseReadinessPage() {
  const blockers = capabilities.filter((item) => item.status === 'Bloccante').length;
  const gaps = capabilities.filter((item) => item.status === 'Gap').length;
  const partial = capabilities.filter((item) => item.status === 'Parziale').length;

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <meta name="robots" content="noindex, nofollow" />
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Torna alla landing
          </Link>
          <span className="font-display text-xl font-bold tracking-tight">DeliR<span className="text-blue-600">.</span></span>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(37,99,235,.35),transparent_38%)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
              Enterprise readiness · 20 settembre 2026
            </div>
            <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_.75fr]">
              <div>
                <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
                  Le skill indispensabili per portare la landing DeliR a livello enterprise.
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300">
                  Audit operativo basato sul repository attuale. Separa ciò che appare completo da ciò che è verificato, misurabile e pronto per sostenere traffico, lead e fiducia aziendale.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3" aria-label="Sintesi audit">
                {[
                  [String(blockers), 'bloccanti', 'text-rose-300'],
                  [String(gaps), 'gap', 'text-slate-200'],
                  [String(partial), 'parziali', 'text-amber-300'],
                ].map(([value, label, color]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className={`font-display text-3xl font-semibold ${color}`}>{value}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="audit-title">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Audit del prodotto</p>
            <h2 id="audit-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Dodici capability, nessuna scorciatoia.</h2>
            <p className="mt-4 text-slate-600">“Parziale” indica che esiste una base visibile ma manca evidenza di qualità. “Gap” indica un controllo assente. “Bloccante” indica un rischio diretto per acquisizione, compliance o sicurezza.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="flex min-h-[290px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[item.status]}`}>{item.status}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.evidence}</p>
                  <div className="mt-auto border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-800"><strong>Exit criterion:</strong> {item.outcome}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" aria-labelledby="skills-title">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Operating model</p>
              <h2 id="skills-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Le 10 skill che servono davvero.</h2>
              <p className="mt-5 leading-relaxed text-slate-600">Non basta una skill “frontend”. Una landing enterprise è un piccolo sistema commerciale: deve convincere, misurare, proteggere dati, funzionare sotto carico e lasciare evidenze verificabili.</p>
            </div>
            <ol className="divide-y divide-slate-200 border-y border-slate-200">
              {mustHaveSkills.map(([number, title, description]) => (
                <li key={number} className="grid gap-3 py-5 sm:grid-cols-[56px_220px_1fr] sm:items-start">
                  <span className="font-mono text-sm font-bold text-blue-600">{number}</span>
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="stack-title">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Skill stack consigliato</p>
            <h2 id="stack-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Dal criterio alla pratica operativa.</h2>
            <p className="mt-4 text-slate-600">Stack minimo per Codex: usa le skill come checklist specialistiche, ma mantieni una sola regia di delivery e quality gate condivisi.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {skillStack.map((skill) => (
              <article key={skill.group} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950"><CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />{skill.group}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skill.items.map((item) => <code key={item} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700">{item}</code>)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{skill.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 text-white" aria-labelledby="roadmap-title">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">Piano di chiusura gap</p>
              <h2 id="roadmap-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Sequenza raccomandata.</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {roadmap.map((phase) => (
                <article key={phase.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{phase.label}</h3>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">{phase.timing}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {phase.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-6 text-sm leading-relaxed text-blue-100">
              <strong>Regola di governance:</strong> nessuna capability è “completa” finché non ha owner, criterio misurabile, evidenza di test e responsabilità post-lancio.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
