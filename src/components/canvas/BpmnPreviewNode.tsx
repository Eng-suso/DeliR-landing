import { Handle, Position, type NodeProps } from '@xyflow/react';
import { BpmnSymbol, semanticTheme } from './BpmnSymbol';

type CatalogItem = {
  symbolKind: 'event' | 'activity' | 'gateway' | 'data' | 'container' | 'choreography' | 'conversation' | 'artifact';
  variant: string;
  label: string;
  width: number;
  height: number;
};

const catalog: Record<string, CatalogItem> = {
  'start-none': { symbolKind: 'event', variant: 'start-none', label: 'Start', width: 58, height: 58 },
  'end-none': { symbolKind: 'event', variant: 'end-none', label: 'End', width: 58, height: 58 },
  'end-terminate': { symbolKind: 'event', variant: 'end-terminate', label: 'End', width: 58, height: 58 },
  'user-task': { symbolKind: 'activity', variant: 'user', label: 'User task', width: 152, height: 78 },
  'service-task': { symbolKind: 'activity', variant: 'service', label: 'Service task', width: 152, height: 78 },
  'task': { symbolKind: 'activity', variant: 'task', label: 'Task', width: 152, height: 78 },
  'exclusive-gateway': { symbolKind: 'gateway', variant: 'exclusive', label: 'Gateway', width: 70, height: 70 },
  'parallel-gateway': { symbolKind: 'gateway', variant: 'parallel', label: 'Parallel', width: 70, height: 70 },
};

export function BpmnPreviewNode({ data, selected }: NodeProps) {
  const d = data as { catalogId: string; label?: string };
  const item = catalog[d.catalogId] ?? catalog['task'];
  const theme = semanticTheme(item.symbolKind, item.variant);
  const glow = selected ? `drop-shadow(0 0 8px ${theme.accent})` : undefined;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: item.width, height: item.height, filter: glow }}
    >
      <BpmnSymbol item={item} selected={selected} className="h-full w-full" />
      {d.label && (
        <div className="absolute left-1/2 top-[calc(100%+5px)] w-max max-w-40 -translate-x-1/2 text-center text-[10px] font-semibold text-slate-700 pointer-events-none">
          {d.label}
        </div>
      )}
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-500 !opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-500 !opacity-0 !pointer-events-none" />
      <Handle type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-500 !opacity-0 !pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-500 !opacity-0 !pointer-events-none" />
    </div>
  );
}

export const previewNodeTypes = { bpmnPreview: BpmnPreviewNode };
