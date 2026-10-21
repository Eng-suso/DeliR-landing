import { problemCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HybridProblem() {
  const { language } = useLanguage();
  const t = problemCopy[language];
  return <section id="metodo" className="hybrid-problem" aria-labelledby="problem-title">
    <div className="section-shell hybrid-problem-layout">
      <div className="hybrid-problem-intro" data-reveal>
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="problem-title" className="landing-title">{t.title}</h2>
        <p>{t.body}</p>
      </div>
      <ol className="hybrid-problem-sequence">
        {t.chain.map(([number, title, detail]) => <li key={number}>
          <span aria-hidden="true" className="hybrid-problem-number">{number}</span>
          <div><h3>{title}</h3><p>{detail}</p></div>
        </li>)}
      </ol>
      <p className="hybrid-problem-conclusion">{t.caption}</p>
    </div>
  </section>;
}
