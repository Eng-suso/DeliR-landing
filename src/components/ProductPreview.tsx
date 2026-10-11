import { useRef, useState } from 'react';
import { Maximize2, Minus, Plus, X } from 'lucide-react';

type ProductPreviewProps = {
  src: string;
  alt: string;
  title: string;
  openLabel: string;
  closeLabel: string;
  zoomLabel: string;
  fitLabel: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
};

export default function ProductPreview({
  src, alt, title, openLabel, closeLabel, zoomLabel, fitLabel, loading = 'lazy', priority = false,
}: ProductPreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const openPreview = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };

  const closePreview = () => dialogRef.current?.close();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPreview}
        aria-label={`${openLabel}: ${title}`}
        className="group relative block w-full overflow-hidden rounded-[10px] bg-white text-left shadow-[0_20px_65px_-45px_rgba(7,33,47,0.55)] transition-[box-shadow] duration-200 hover:shadow-[0_24px_70px_-35px_rgba(7,33,47,0.55)]"
      >
        <img src={src} alt={alt} width="1600" height="1000" loading={loading} fetchPriority={priority ? 'high' : undefined} decoding="async" className="h-auto w-full" />
        <span aria-hidden="true" className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white/95 px-3 text-xs font-semibold text-brand-ink shadow-sm transition-colors group-hover:bg-[#E8F4F8] sm:bottom-4 sm:right-4">
          <Maximize2 className="h-4 w-4" />{openLabel}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={title}
        onClose={() => { setOpen(false); setZoomed(false); triggerRef.current?.focus(); }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[1720px] overflow-hidden rounded-xl border border-slate-200 bg-[#F4F7F8] p-0 text-brand-ink shadow-2xl backdrop:bg-[#071A26]/85 sm:max-h-[calc(100dvh-48px)] sm:w-[calc(100vw-48px)]"
      >
        <div className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 sm:px-5">
          <p className="min-w-0 truncate text-sm font-semibold">{title}</p>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? fitLabel : zoomLabel} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-brand-ink transition-colors hover:bg-slate-100">
              {zoomed ? <Minus aria-hidden="true" className="h-5 w-5" /> : <Plus aria-hidden="true" className="h-5 w-5" />}
            </button>
            <button type="button" onClick={closePreview} aria-label={closeLabel} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-brand-ink transition-colors hover:bg-slate-100">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="max-h-[calc(100dvh-82px)] overflow-auto overscroll-contain p-3 sm:max-h-[calc(100dvh-106px)] sm:p-5">
          {open ? <img src={src} alt={alt} width="1600" height="1000" className={zoomed ? 'h-auto w-[1600px] max-w-none' : 'mx-auto h-auto max-w-full'} /> : null}
        </div>
      </dialog>
    </>
  );
}
