import { ArrowUpRight } from 'lucide-react';
import { hybridExperience } from '../../content/hybridExperience';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HybridProcessPath() {
  const { language } = useLanguage();
  const t = hybridExperience[language];

  return <section id="process-context" className="hybrid-process-path" aria-labelledby="process-path-title">
    <div className="section-shell">
      <div className="hybrid-path-heading">
        <div>
          <p className="landing-eyebrow">{t.eyebrow}</p>
          <h2 id="process-path-title">{t.title}</h2>
        </div>
        <p>{t.intro}</p>
      </div>
      <nav aria-label={t.navigation}>
        <ol className="hybrid-path-steps">
          {t.phases.map((phase, index) => <li key={phase.href}>
            <a href={phase.href}>
              <span aria-hidden="true" className="hybrid-step-node">0{index + 1}</span>
              <span className="hybrid-step-name">{phase.name}<ArrowUpRight aria-hidden="true" size={18} /></span>
              <span className="hybrid-step-description">{phase.description}</span>
            </a>
          </li>)}
        </ol>
      </nav>
    </div>
  </section>;
}
