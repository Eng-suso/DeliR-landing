import '@xyflow/react/dist/style.css';
import { Background, ReactFlow, ReactFlowProvider, MarkerType, type Edge, type Node } from '@xyflow/react';
import { previewNodeTypes } from './BpmnPreviewNode';

// ─── Hardcoded P2P process (Procure-to-Pay) ────────────────────────────────
const nodes: Node[] = [
  // ---- Pool / Lanes simulated via background labels only ----

  // AP Lane
  {
    id: 'start',
    type: 'bpmnPreview',
    position: { x: 60, y: 140 },
    data: { catalogId: 'start-none', label: 'Invoice received' },
    draggable: false, selectable: false,
  },
  {
    id: 'receive',
    type: 'bpmnPreview',
    position: { x: 180, y: 120 },
    data: { catalogId: 'user-task', label: 'Register Invoice' },
    draggable: false, selectable: false,
  },
  {
    id: 'check_po',
    type: 'bpmnPreview',
    position: { x: 400, y: 120 },
    data: { catalogId: 'user-task', label: 'Verify vs PO' },
    draggable: false, selectable: false,
  },
  {
    id: 'gw_match',
    type: 'bpmnPreview',
    position: { x: 618, y: 130 },
    data: { catalogId: 'exclusive-gateway', label: 'PO match?' },
    draggable: false, selectable: false,
  },

  // Finance Lane
  {
    id: 'approve',
    type: 'bpmnPreview',
    position: { x: 760, y: 40 },
    data: { catalogId: 'user-task', label: 'Finance Approval' },
    draggable: false, selectable: false,
  },
  {
    id: 'schedule_payment',
    type: 'bpmnPreview',
    position: { x: 980, y: 40 },
    data: { catalogId: 'service-task', label: 'Schedule Payment' },
    draggable: false, selectable: false,
  },
  {
    id: 'end_ok',
    type: 'bpmnPreview',
    position: { x: 1200, y: 60 },
    data: { catalogId: 'end-terminate', label: 'Paid' },
    draggable: false, selectable: false,
  },

  // Exception Lane
  {
    id: 'clarification',
    type: 'bpmnPreview',
    position: { x: 760, y: 240 },
    data: { catalogId: 'task', label: 'Request Clarification' },
    draggable: false, selectable: false,
  },
  {
    id: 'vendor_response',
    type: 'bpmnPreview',
    position: { x: 980, y: 240 },
    data: { catalogId: 'user-task', label: 'Vendor Response' },
    draggable: false, selectable: false,
  },
  {
    id: 'end_reject',
    type: 'bpmnPreview',
    position: { x: 1200, y: 258 },
    data: { catalogId: 'end-none', label: 'Rejected' },
    draggable: false, selectable: false,
  },
];

const MARKER = { type: MarkerType.ArrowClosed, color: '#334155', width: 16, height: 16 };

const edges: Edge[] = [
  { id: 'e1', source: 'start', target: 'receive', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e2', source: 'receive', target: 'check_po', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e3', source: 'check_po', target: 'gw_match', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e4', source: 'gw_match', target: 'approve', type: 'smoothstep', markerEnd: MARKER, label: 'Yes', labelStyle: { fontSize: 10, fontWeight: 700, fill: '#16a34a' }, style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e5', source: 'approve', target: 'schedule_payment', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e6', source: 'schedule_payment', target: 'end_ok', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e7', source: 'gw_match', target: 'clarification', type: 'smoothstep', markerEnd: MARKER, label: 'No', labelStyle: { fontSize: 10, fontWeight: 700, fill: '#dc2626' }, style: { stroke: '#dc2626', strokeWidth: 2 } },
  { id: 'e8', source: 'clarification', target: 'vendor_response', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  { id: 'e9', source: 'vendor_response', target: 'end_reject', type: 'smoothstep', markerEnd: MARKER, style: { stroke: '#334155', strokeWidth: 2 } },
  // Loop back to check PO after vendor clarification
  { id: 'e10', source: 'vendor_response', target: 'check_po', type: 'smoothstep', markerEnd: MARKER, label: 'Resubmit', labelStyle: { fontSize: 9, fill: '#6b7280' }, style: { stroke: '#6b7280', strokeWidth: 1.5, strokeDasharray: '5 3' } },
];

// Lane labels rendered as background layer elements
function LaneLabels() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Pool border */}
      <div className="absolute" style={{ left: 30, top: 20, right: 30, bottom: 60, border: '2px solid #334155', borderRadius: 6 }}>
        {/* Pool label */}
        <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center border-r-2 border-slate-700 bg-slate-50">
          <span className="transform -rotate-90 whitespace-nowrap text-[10px] font-extrabold tracking-wide text-slate-800">
            Procure-to-Pay
          </span>
        </div>
        {/* AP Lane */}
        <div className="absolute top-0 left-9 right-0 flex items-center border-b border-slate-400 bg-slate-50/60" style={{ height: '50%' }}>
          <div className="w-8 h-full flex items-center justify-center border-r border-slate-400">
            <span className="transform -rotate-90 whitespace-nowrap text-[9px] font-bold tracking-wide text-slate-600">AP</span>
          </div>
        </div>
        {/* Exception Lane */}
        <div className="absolute bottom-0 left-9 right-0 flex items-center" style={{ top: '50%' }}>
          <div className="w-8 h-full flex items-center justify-center border-r border-slate-400 bg-slate-50/60">
            <span className="transform -rotate-90 whitespace-nowrap text-[9px] font-bold tracking-wide text-slate-600">Vendor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CanvasInner() {
  return (
    <div className="relative w-full h-full">
      <LaneLabels />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={previewNodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        defaultViewport={{ x: -10, y: 30, zoom: 0.72 }}
        fitView
        fitViewOptions={{ padding: 0.18, minZoom: 0.5, maxZoom: 1 }}
        className="bg-transparent"
      >
        <Background color="#cbd5e1" gap={18} size={1.5} />
      </ReactFlow>
    </div>
  );
}

export function CanvasPreview() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
