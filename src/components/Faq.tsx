import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const copy = {
  it: {
    eyebrow: 'Dalla discovery al miglioramento continuo', title: 'Le domande lungo il tuo incarico.',
    dataLink: 'Sicurezza e dati: i dettagli',
    faqs: [
      ['Discovery', 'Può DeliR capire un processo partendo solo da documenti e interviste?', 'Sì. Puoi iniziare da documenti, procedure, interviste e conoscenza operativa, anche senza event log. DeliR organizza queste fonti in un primo As-Is strutturato, con evidenze e punti da chiarire. Il modello viene poi verificato con te e con le persone che svolgono il processo.'],
      ['Intelligence della discovery', 'Cosa succede se il cliente dimentica informazioni importanti o le fonti si contraddicono?', 'DeliR evidenzia lacune, ambiguità e versioni in conflitto, così puoi riportarle al cliente come domande mirate. Le informazioni mancanti restano punti aperti da verificare: non vengono trasformate in fatti. Questo ti aiuta a chiudere la discovery con un contesto più solido.'],
      ['As-Is', 'Come fa DeliR a distinguere ciò che accade davvero da ciò che il cliente pensa accada?', 'Mette a confronto ciò che emerge dalle fonti, conserva le evidenze e rende visibili le assunzioni e le incongruenze. Documenti e interviste descrivono il processo, ma da soli non provano ogni passaggio: la verifica con chi lo esegue, ed eventuali dati operativi disponibili, permette di confermare o correggere l’As-Is.'],
      ['Evidenze', 'Posso vedere da dove arriva ogni attività del processo?', 'Puoi risalire dalle attività alle fonti che le supportano e rivederle nel loro contesto. Quando un passaggio non ha un’evidenza sufficiente, resta da chiarire. Così puoi spiegare al cliente su cosa si basa il modello e dove serve ancora una verifica.'],
      ['Analisi', 'DeliR si limita a trovare problemi o capisce anche quali vale la pena risolvere?', 'DeliR ti aiuta a collegare i problemi al processo e a valutarli rispetto agli obiettivi dell’incarico. Il confronto degli scenari permette di esplorare l’effetto delle alternative sui KPI, con parametri e assunzioni espliciti. La priorità finale resta una decisione tua e del cliente, tenendo conto anche di vincoli, costi e fattibilità.'],
      ['Riprogettazione', 'Può DeliR progettare più modi di migliorare lo stesso processo?', 'Sì. Puoi sviluppare più ipotesi To-Be a partire dallo stesso As-Is, mantenendo collegati il problema, le evidenze e le modifiche proposte. Ogni alternativa può essere discussa e rivista prima di scegliere quale approfondire con il cliente.'],
      ['Simulazione', 'Posso sapere quale To-Be funzionerà meglio prima di proporlo al cliente?', 'Puoi confrontare gli scenari con l’As-Is e vedere quale risulta più adatto agli obiettivi nelle condizioni simulate. I risultati dipendono dai dati, dai parametri e dalle assunzioni utilizzati: aiutano a motivare una raccomandazione, ma non garantiscono il risultato dell’implementazione. I numeri della demo appartengono al caso dimostrativo.'],
      ['Decisione', 'DeliR ricorda perché abbiamo scelto una modifica invece di un’altra?', 'Il contesto dell’incarico mantiene collegati evidenze, problemi, alternative e motivazioni registrate durante la review. Puoi quindi ripercorrere il ragionamento dietro una modifica e spiegare perché è stata scelta rispetto alle altre opzioni.'],
      ['Miglioramento continuo', 'Cosa succede al processo dopo che il To-Be viene approvato?', 'Il To-Be approvato diventa un riferimento per le verifiche successive. Puoi aggiornare il contesto con nuove evidenze, rivedere le ipotesi e confrontare altri scenari mentre il progetto evolve. Le attività successive al pilot si concordano nel perimetro dell’incarico; l’approvazione non avvia da sola l’implementazione o un monitoraggio automatico.'],
      ['Memoria', 'Se torno sul progetto tra sei mesi, DeliR ricorda ancora tutto il perché?', 'Puoi ritrovare fonti, decisioni e motivazioni registrate nello stesso contesto di progetto, finché il workspace è disponibile secondo le condizioni concordate. Accessi, conservazione e cancellazione si definiscono prima del pilot: la memoria del progetto non implica una conservazione illimitata.'],
    ],
  },
  en: {
    eyebrow: 'From discovery to continuous improvement', title: 'Questions throughout your engagement.',
    dataLink: 'Security & Data: the details',
    faqs: [
      ['Discovery', 'Can DeliR understand a process using only documents and interviews?', 'Yes. You can start with documents, procedures, interviews and operational knowledge, even without event logs. DeliR organizes these sources into an initial structured As-Is, with evidence and open questions. You then review the model with the people who perform the process.'],
      ['Discovery intelligence', 'What happens if the client leaves out important information or sources contradict each other?', 'DeliR highlights gaps, ambiguities and conflicting accounts so you can take targeted questions back to the client. Missing information remains open for review rather than being treated as fact. This helps you finish discovery with stronger context.'],
      ['As-Is', 'How does DeliR distinguish what actually happens from what the client thinks happens?', 'It compares the available sources, preserves evidence and makes assumptions and inconsistencies visible. Documents and interviews describe the process, but do not prove every step on their own. Reviewing it with the people who perform it, alongside any available operational data, lets you confirm or correct the As-Is.'],
      ['Evidence', 'Can I see where each process activity comes from?', 'You can trace activities back to their supporting sources and review them in context. A step without sufficient evidence remains open for clarification. This lets you explain what supports the model and where further review is needed.'],
      ['Analysis', 'Does DeliR just find problems, or does it help identify which ones are worth solving?', 'DeliR helps connect problems to the process and assess them against the engagement objectives. Scenario comparison lets you explore how alternatives affect KPIs, with explicit parameters and assumptions. You and the client decide the final priorities, taking constraints, costs and feasibility into account.'],
      ['Redesign', 'Can DeliR design several ways to improve the same process?', 'Yes. You can develop multiple To-Be hypotheses from the same As-Is while keeping problems, evidence and proposed changes connected. Each alternative can be discussed and revised before choosing which to explore further with the client.'],
      ['Simulation', 'Can I know which To-Be will perform better before proposing it to the client?', 'You can compare scenarios against the As-Is and see which best fits the objectives under the simulated conditions. Results depend on the data, parameters and assumptions used. They help support a recommendation, but do not guarantee implementation outcomes. Numbers in the demo belong to the illustrative case.'],
      ['Decision', 'Does DeliR remember why we chose one change over another?', 'The engagement context keeps evidence, problems, alternatives and reasons recorded during review connected. You can retrace the reasoning behind a change and explain why it was chosen over other options.'],
      ['Continuous improvement', 'What happens to the process after the To-Be is approved?', 'The approved To-Be becomes a reference for later reviews. You can update the context with new evidence, revisit assumptions and compare further scenarios as the project evolves. Work after the pilot is agreed within the engagement scope. Approval does not itself trigger implementation or automatic monitoring.'],
      ['Memory', 'If I return to the project in six months, will DeliR still remember the reasoning?', 'You can return to sources, decisions and recorded reasoning in the same project context while the workspace remains available under the agreed terms. Access, retention and deletion are defined before the pilot. Project memory does not imply unlimited retention.'],
    ],
  },
} as const;

export default function Faq() {
  const { language } = useLanguage();
  const t = copy[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="premium-faq relative scroll-mt-28 border-t border-slate-200 bg-white py-20 sm:py-24" aria-labelledby="faq-title">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div data-reveal><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="faq-title" className="landing-title mt-6">{t.title}</h2></div>
        <div>
          {t.faqs.map(([phase, question, answer], index) => {
            const open = openIndex === index;
            return <div data-reveal key={question} className="border-b border-slate-200">
              <button type="button" onClick={() => setOpenIndex(open ? null : index)} className="group flex min-h-16 w-full items-center justify-between py-5 text-left" aria-expanded={open} aria-controls={`faq-panel-${index}`}>
                <span className="pr-6"><span className="mb-2 block text-xs font-semibold tracking-wide text-brand-blue">{phase}</span><span className="block text-base font-medium text-brand-ink group-hover:text-brand-blue sm:text-lg">{question}</span></span>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${open ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-300 bg-white text-slate-500 group-hover:border-brand-blue group-hover:text-brand-blue'}`}>
                  {open ? <Minus aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
                </span>
              </button>
              <div id={`faq-panel-${index}`} role="region" aria-label={question} hidden={!open}>
                <p className="max-w-3xl pb-6 text-sm leading-7 text-slate-600 sm:text-base">{answer}</p>
              </div>
            </div>;
          })}
          <Link to={language === 'it' ? '/security-data' : '/security-data?lang=en'} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue underline underline-offset-4">{t.dataLink}</Link>
        </div>
      </div>
    </section>
  );
}
