import { useLanguage } from '../../i18n/LanguageContext';
import Band from '../kit/Band';
import Eyebrow from '../kit/Eyebrow';
import SplitHeading from '../kit/SplitHeading';

const copy = {
  it: {
    eyebrow: 'Il costo della frammentazione',
    lead: 'Il cliente vede un unico incarico.',
    rest: 'Tu devi ricomporlo ogni volta, tra interviste, procedure, fogli di calcolo, modelli e simulazioni che vivono in strumenti diversi.',
  },
  en: {
    eyebrow: 'The cost of fragmentation',
    lead: 'The client sees one engagement.',
    rest: 'You rebuild it every time, across interviews, procedures, spreadsheets, models and simulations that live in separate tools.',
  },
} as const;

export default function ProblemV2() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <Band tone="navy" id="piattaforma" labelledBy="problem-v2-title">
      <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
      <SplitHeading
        id="problem-v2-title"
        tone="dark"
        lead={t.lead}
        rest={t.rest}
        className="mt-6 max-w-[52rem] text-pretty text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2]"
      />
    </Band>
  );
}
