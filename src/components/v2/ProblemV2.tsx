import { problemCopy } from '../../content/landingCopy';
import { useLanguage } from '../../i18n/LanguageContext';
import ActionV2 from './ActionV2';
import VideoSlotV2 from './VideoSlotV2';

export default function ProblemV2({ studio = false }: { studio?: boolean }) {
  const { language } = useLanguage();
  const t = problemCopy[language];
  return <section id="piattaforma" aria-labelledby="problem-v2-title" className="v2-section v2-problem">
    <div className="section-shell v2-split">
      <div className="min-w-0">
        <p className="landing-eyebrow">{t.eyebrow}</p>
        <h2 id="problem-v2-title" className="v2-title mt-5">{t.title}</h2>
        <p className="v2-body mt-6">{t.body}</p>
        <ActionV2 className="mt-7" />
      </div>
      <VideoSlotV2 id="problem" studio={studio} />
    </div>
  </section>;
}
