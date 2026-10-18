import { problemCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import VideoSlotV2 from './VideoSlotV2';

export default function ProblemV2({ studio = false }: { studio?: boolean }) {
  const { language } = useLanguage();
  const t = problemCopy[language];
  return <section id="piattaforma" aria-labelledby="problem-v2-title" className="v2-section">
    <div className="section-shell v2-split">
      <div className="min-w-0"><p className="landing-eyebrow">{t.eyebrow}</p><h2 id="problem-v2-title" className="v2-title mt-5">{t.title}</h2><p className="v2-body mt-5">{t.body}</p></div>
      <VideoSlotV2 id="problem" studio={studio} />
    </div>
  </section>;
}
