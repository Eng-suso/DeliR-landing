import { ArrowLeft, Clapperboard } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function PreviewToolbarV2({ studio }: { studio: boolean }) {
  const { language } = useLanguage();
  const it = language === 'it';
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  if (studio) next.delete('studio'); else next.set('studio', '1');
  const suffix = next.toString();
  return <aside aria-label={it ? 'Strumenti anteprima V2' : 'V2 preview tools'} className="v2-preview-bar">
    <div className="section-shell flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
      <p className="text-xs font-medium">{it ? 'Anteprima DeliR' : 'DeliR preview'}</p>
      <div className="flex flex-wrap items-center gap-x-5">
        <Link to={it ? '/' : '/?lang=en'} className="inline-flex min-h-11 items-center gap-1.5 text-xs underline underline-offset-4"><ArrowLeft aria-hidden="true" className="size-3.5" />{it ? 'Sito attuale' : 'Current site'}</Link>
        <Link to={`/v2${suffix ? `?${suffix}` : ''}`} preventScrollReset className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold underline underline-offset-4" aria-current={studio ? 'page' : undefined}><Clapperboard aria-hidden="true" className="size-3.5" />{studio ? (it ? 'Nascondi piano video' : 'Hide video plan') : (it ? 'Mostra piano video' : 'Show video plan')}</Link>
      </div>
    </div>
    {studio ? <div className="section-shell border-t border-slate-200 py-3 text-sm leading-6"><a href="#piano-video" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{it ? 'Consulta le demo esistenti e le indicazioni di produzione' : 'View existing demos and production guidance'}</a></div> : null}
  </aside>;
}
