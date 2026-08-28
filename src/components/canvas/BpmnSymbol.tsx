// Copied from products/delir/frontend — renders BPMN shape SVGs

export type BpmnCatalogItem = {
  id: string;
  symbolKind: 'event' | 'activity' | 'gateway' | 'data' | 'container' | 'choreography' | 'conversation' | 'artifact';
  variant: string;
  label: string;
  width: number;
  height: number;
};

export function BpmnSymbol({ item, selected = false, className = '' }: { item: Pick<BpmnCatalogItem, 'symbolKind' | 'variant' | 'label'>; selected?: boolean; className?: string }) {
  const variant = item.variant || ''; const theme = semanticTheme(item.symbolKind, variant); const stroke = theme.stroke; const accent = theme.accent; const fill = theme.fill;
  const base = `block overflow-visible ${className}`;
  if (item.symbolKind === 'event') {
    const phase = variant.startsWith('end') ? 'end' : (variant.startsWith('intermediate') || variant.startsWith('boundary') ? 'intermediate' : 'start');
    const eventStrokeWidth = phase === 'end' ? 5 : 2.5;
    return <svg viewBox="0 0 64 64" className={base}><circle cx="32" cy="32" r="24" fill={fill} stroke={stroke} strokeWidth={eventStrokeWidth} strokeDasharray={variant.startsWith('boundary') ? '5 3' : undefined} />{phase === 'intermediate' ? <circle cx="32" cy="32" r="19" fill="none" stroke={stroke} strokeWidth="2" /> : null}<EventMark variant={variant} stroke={stroke} /></svg>;
  }
  if (item.symbolKind === 'activity') return <svg viewBox="0 0 160 84" className={base}><rect x="5" y="5" width="150" height="74" rx="10" fill={fill} stroke={stroke} strokeWidth={variant.includes('call') ? 5 : 2.5} />{variant.includes('transaction') && <rect x="10" y="10" width="140" height="64" rx="8" fill="none" stroke={accent} strokeWidth="1.5" />}<ActivityMark variant={variant} stroke={stroke} /></svg>;
  if (item.symbolKind === 'gateway') return <svg viewBox="0 0 80 80" className={base}><path d="M40 4 76 40 40 76 4 40Z" fill={fill} stroke={stroke} strokeWidth="2.5" /><GatewayMark variant={variant} stroke={stroke} /></svg>;
  if (item.symbolKind === 'data') return <svg viewBox="0 0 80 84" className={base}>{variant === 'store' ? <><ellipse cx="40" cy="15" rx="26" ry="9" fill="white" stroke={stroke} strokeWidth="2" /><path d="M14 15v49c0 12 52 12 52 0V15" fill="white" stroke={stroke} strokeWidth="2" /><ellipse cx="40" cy="64" rx="26" ry="9" fill="none" stroke={stroke} strokeWidth="2" /></> : <><path d="M17 4h34l12 12v64H17z" fill="white" stroke={stroke} strokeWidth="2" /><path d="M51 4v13h12" fill="none" stroke={stroke} strokeWidth="2" /></>}</svg>;
  if (item.symbolKind === 'container') return <svg viewBox="0 0 190 100" className={base}><rect x="4" y="4" width="182" height="92" rx="3" fill={fill} stroke={stroke} strokeWidth="2" />{variant === 'pool' && <path d="M28 4v92" stroke={stroke} strokeWidth="2" />}{variant === 'lane' && <path d="M4 28h182" stroke={stroke} strokeWidth="2" />}</svg>;
  return <svg viewBox="0 0 100 36" className={base}><path d="M8 18h76" stroke={stroke} strokeWidth="2" strokeDasharray={variant === 'message' ? '7 5' : variant === 'association' ? '2 5' : undefined} />{variant !== 'association' && <path d="m75 11 12 7-12 7" fill="none" stroke={stroke} strokeWidth="2" />}</svg>;
}

export function semanticTheme(kind: BpmnCatalogItem['symbolKind'], variant = '') {
  if (kind === 'event' && variant.startsWith('start')) return { stroke: '#16a34a', accent: '#4ade80', fill: '#effdf3', glow: 'rgba(34,197,94,.68)' };
  if (kind === 'event' && variant.startsWith('end')) return { stroke: '#dc2626', accent: '#fb7185', fill: '#fff1f2', glow: 'rgba(239,68,68,.68)' };
  if (kind === 'event' && (variant.startsWith('intermediate') || variant.startsWith('boundary'))) return { stroke: '#ca8a04', accent: '#facc15', fill: '#fefce8', glow: 'rgba(250,204,21,.65)' };
  if (kind === 'activity') return { stroke: '#2563eb', accent: '#60a5fa', fill: '#eff6ff', glow: 'rgba(59,130,246,.68)' };
  if (kind === 'gateway') return { stroke: '#7e22ce', accent: '#c084fc', fill: '#faf5ff', glow: 'rgba(168,85,247,.68)' };
  return { stroke: '#475569', accent: '#94a3b8', fill: '#f8fafc', glow: 'rgba(100,116,139,.42)' };
}

function EventMark({ variant, stroke }: { variant: string; stroke: string }) {
  if (variant.includes('message')) return <path d="M18 23h28v18H18zM18 23l14 10 14-10" fill="none" stroke={stroke} strokeWidth="2" />;
  if (variant.includes('timer')) return <><circle cx="32" cy="32" r="12" fill="none" stroke={stroke} strokeWidth="2" /><path d="M32 24v9l6 4" stroke={stroke} strokeWidth="2" /></>;
  if (variant.includes('signal')) return <path d="m32 19 13 25H19z" fill="none" stroke={stroke} strokeWidth="2" />;
  if (variant.includes('error')) return <path d="m35 18-11 15h9l-4 13 12-17h-9z" fill={stroke} />;
  if (variant.includes('terminate')) return <circle cx="32" cy="32" r="13" fill={stroke} />;
  if (variant.includes('parallel')) return <path d="M32 19v26M19 32h26" stroke={stroke} strokeWidth="3" />;
  return null;
}

function ActivityMark({ variant, stroke }: { variant: string; stroke: string }) {
  if (variant === 'user') return <><circle cx="23" cy="25" r="6" fill="none" stroke={stroke} strokeWidth="2" /><path d="M13 47c2-10 18-10 20 0" fill="none" stroke={stroke} strokeWidth="2" /></>;
  if (variant === 'service') return <circle cx="23" cy="35" r="10" fill="none" stroke={stroke} strokeWidth="3" />;
  if (variant === 'script') return <path d="M15 22h17v25H15zM19 29h9m-9 6h9" fill="none" stroke={stroke} strokeWidth="2" />;
  if (variant.includes('subprocess')) return <path d="M75 63h12m-6-6v12" stroke={stroke} strokeWidth="2" />;
  return null;
}

function GatewayMark({ variant, stroke }: { variant: string; stroke: string }) {
  if (variant === 'parallel') return <path d="M40 24v32M24 40h32" stroke={stroke} strokeWidth="4" />;
  if (variant === 'inclusive') return <circle cx="40" cy="40" r="13" fill="none" stroke={stroke} strokeWidth="3" />;
  return <path d="m28 28 24 24m0-24L28 52" stroke={stroke} strokeWidth="3" />;
}
