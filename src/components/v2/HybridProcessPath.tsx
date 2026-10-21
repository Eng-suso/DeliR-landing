import { ArrowUpRight } from 'lucide-react';
import { hybridExperience } from '../../content/hybridExperience';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HybridProcessPath() {
  const { language } = useLanguage();
  const t = hybridExperience[language];

  return <section id="process-context" className="hybrid-process-path" aria-labelledby="process-path-title">
    <div className="section-shell">
      <h2 id="process-path-title" className="sr-only">{t.title}</h2>
      <nav aria-label={t.navigation}>
        <ol className="hybrid-path-steps">
          {t.phases.map(phase => <li key={phase.href}>
            <a href={phase.href}>
              <span className="hybrid-step-name">{phase.name}<ArrowUpRight aria-hidden="true" size={18} /></span>
              <span className="sr-only">{phase.description}</span>
            </a>
          </li>)}
        </ol>
      </nav>
    </div>
  </section>;
}
