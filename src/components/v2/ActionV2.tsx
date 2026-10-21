import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { interestCtaLabel, productInterestHref } from '../../lib/publicOffer';

export default function ActionV2({ className = '' }: { className?: string }) {
  const { language } = useLanguage();
  return <a href={productInterestHref(language)} className={`btn-primary v2-action ${className}`}>
    {interestCtaLabel[language]}<ArrowRight aria-hidden="true" className="size-4 shrink-0" />
  </a>;
}
