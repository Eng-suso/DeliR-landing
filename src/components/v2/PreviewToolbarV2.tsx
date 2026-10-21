import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function PreviewToolbarV2() {
  const { language } = useLanguage();
  const it = language === 'it';
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  next.delete('studio');
  const suffix = next.toString();
  return <aside aria-label={it ? 'Produzione video' : 'Video production'} className="v2-preview-bar">
    <div className="section-shell flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
      <p className="text-xs font-medium">{it ? 'Produzione video DeliR' : 'DeliR video production'}</p>
      <div className="flex flex-wrap items-center gap-x-5">
        <Link to={`/v2${suffix ? `?${suffix}` : ''}`} preventScrollReset className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold underline underline-offset-4"><ArrowLeft aria-hidden="true" className="size-3.5" />{it ? 'Torna alla landing' : 'Back to the landing page'}</Link>
      </div>
    </div>
    <div className="section-shell border-t border-slate-200 py-3 text-sm leading-6"><a href="#piano-video" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{it ? 'Consulta le demo esistenti e le indicazioni di produzione' : 'View existing demos and production guidance'}</a></div>
  </aside>;
}
