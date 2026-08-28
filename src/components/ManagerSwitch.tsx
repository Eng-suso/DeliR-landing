import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Activity, AlertCircle, BarChart3, CheckSquare, Clock, FileText, CheckCircle2, X } from 'lucide-react';

export default function ManagerSwitch() {
  const [view, setView] = useState<'consultant' | 'manager'>('consultant');

  return (
    <section className="py-32 bg-[#F7F8FC]/80 backdrop-blur-[2px] relative z-10" id="view-switch">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-slate-900 mb-6 tracking-tight leading-tight">
            One workspace. <br className="hidden md:block" />Two perfect views.
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            The consultant maps the process.<br/> The manager sees progress, assumptions, risks and approvals.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner">
            <button
              onClick={() => setView("consultant")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                view === "consultant" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Consultant View
            </button>
            <button
              onClick={() => setView("manager")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                view === "manager" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Manager View
            </button>
          </div>
        </div>

        <motion.div layout className="max-w-5xl mx-auto border border-slate-200 rounded-2xl bg-white shadow-xl overflow-hidden h-[500px] flex text-left relative">
          <AnimatePresence mode="wait">
            {view === "consultant" ? (
              <motion.div
                key="consultant"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-8 bg-slate-50 dashboard-pattern flex flex-col relative"
              >
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-2.5 py-1.5 rounded shadow-sm border border-slate-200 text-[11px] font-medium text-slate-700">
                  <Network className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-mono">OTC_PROCESS_V2.bpmn</span>
                </div>
                
                {/* Consultant Technical View Mockup - Enterprise Grid */}
                <div className="m-auto flex flex-col items-center relative z-10 w-full h-full justify-center">
                  <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  
                  <div className="w-64 bg-white border border-slate-300 rounded shadow-sm flex flex-col justify-center p-3 z-10 transition-colors hover:border-slate-400">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Start Event</span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">EVT_01</span>
                    </div>
                    <span className="text-[12px] font-medium text-slate-900 leading-tight">Receive Order Payload</span>
                  </div>
                  
                  <div className="w-px h-12 bg-slate-300 z-10 relative">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-t border-r border-slate-400 rotate-135"></div>
                  </div>
                  
                  <div className="w-72 bg-white border border-blue-300 rounded shadow-sm p-3 z-10 ring-1 ring-blue-100/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-center mb-1 pl-1">
                      <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1"><Activity className="w-3 h-3"/> Service Task</span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">TSK_02</span>
                    </div>
                    <span className="text-[12px] font-medium text-slate-900 leading-tight block pl-1 mt-1">Validate Credit Profile (API)</span>
                    <div className="mt-2.5 pl-1 flex items-center gap-3">
                      <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        <Clock className="w-3 h-3 text-slate-400" /> p99: 240ms
                      </div>
                      <div className="text-[9px] font-mono text-green-600 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> SLA OK
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-12 bg-slate-300 z-10 relative">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-t border-r border-slate-400 rotate-135"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 border border-slate-400 rotate-45 flex items-center justify-center bg-white shadow-sm hover:border-slate-600 transition-colors cursor-pointer">
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm -rotate-45"></div>
                    </div>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-600 tracking-wide whitespace-nowrap mt-1 bg-white/80 px-1 rounded">Score &gt; 700?</div>
                  </div>
                </div>

                <div className="absolute right-4 top-4 bottom-4 w-72 bg-white border border-slate-200 rounded shadow-md flex flex-col z-20">
                  <div className="h-10 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Properties</h4>
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="p-4 space-y-4 overflow-y-auto">
                    <div>
                      <div className="text-[10px] uppercase font-medium text-slate-400 mb-1.5">Node Identity</div>
                      <input type="text" readOnly value="TSK_02_CreditAPI" className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-[11px] font-mono text-slate-700" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-medium text-slate-400 mb-1.5 ">Execution Listeners</div>
                      <div className="bg-slate-900 rounded p-2 text-[10px] font-mono text-green-400 leading-relaxed shadow-inner">
                        <span className="text-slate-500">{"// onStart event"}</span><br/>
                        await validatePayload(execution);<br/>
                        metrics.track('latency');
                      </div>
                    </div>
                    <div>
                       <div className="text-[10px] uppercase font-medium text-slate-400 mb-1.5">I/O Mapping</div>
                       <table className="w-full text-left text-[10px]">
                         <tbody>
                           <tr className="border-b border-slate-100">
                             <td className="py-1 text-slate-500 font-mono">customer_id</td>
                             <td className="py-1 text-slate-900 font-mono text-right">req.body.id</td>
                           </tr>
                           <tr>
                             <td className="py-1 text-slate-500 font-mono">auth_token</td>
                             <td className="py-1 text-slate-900 font-mono text-right">sys.env.TR_TOKEN</td>
                           </tr>
                         </tbody>
                       </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="manager"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full bg-white flex"
              >
                {/* Manager Dashboard Mockup */}
                <div className="flex-1 p-8 flex flex-col hide-scrollbar overflow-y-auto bg-slate-50">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Order to Cash Optimization</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">Executive Brief • ID: PRJ-993 • Last updated 2h ago</p>
                    </div>
                    <div className="flex gap-3">
                       <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded text-xs font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                         View Details
                       </button>
                       <button className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-1.5">
                         <CheckCircle2 className="w-3.5 h-3.5" /> Approve Changes
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 mb-8">
                    <div className="border border-slate-200 rounded bg-white shadow-sm p-5 flex flex-col">
                      <div className="text-[10px] font-bold uppercase font-mono text-slate-400 tracking-wider mb-2">Projected Value</div>
                      <div className="text-3xl font-semibold text-slate-900 tracking-tight">+$124K</div>
                      <div className="text-[10px] text-green-600 font-medium mt-2 bg-green-50 px-1.5 py-0.5 rounded self-start border border-green-100">Annualized Savings</div>
                    </div>
                    <div className="border border-slate-200 rounded bg-white shadow-sm p-5 flex flex-col">
                      <div className="text-[10px] font-bold uppercase font-mono text-slate-400 tracking-wider mb-2">Cycle Time Reduction</div>
                      <div className="text-3xl font-semibold text-slate-900 tracking-tight">-2.5</div>
                      <div className="text-[10px] text-slate-500 mt-2">Days per transaction (avg)</div>
                    </div>
                    <div className="border border-amber-200 rounded bg-[#FFFBF0] shadow-sm p-5 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                      <div className="text-[10px] font-bold uppercase font-mono text-amber-700 tracking-wider mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Action Required</div>
                      <div className="text-3xl font-semibold text-amber-900 tracking-tight">2</div>
                      <div className="text-[10px] text-amber-800 mt-2">Pending compliance reviews</div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Key Strategic Changes</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start p-4 bg-white border border-slate-200 rounded shadow-sm">
                      <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex justify-center items-center shrink-0 border border-blue-100 mt-0.5">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Automate Credit Validation via API</div>
                        <div className="text-[12px] text-slate-500 mt-1 leading-relaxed">Integrating the core ERP with external credit APIs eliminates ~4 hours of manual verification queuing per order.</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-white border border-slate-200 rounded shadow-sm">
                      <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex justify-center items-center shrink-0 border border-slate-200 mt-0.5">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Dynamic Approval Thresholds</div>
                        <div className="text-[12px] text-slate-500 mt-1 leading-relaxed">Orders &lt; $5k auto-approved. Orders &gt; $5k routed to VP, mitigating compliance exposure by 18%.</div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 relative z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
                   <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Items</h4>
                   <div className="space-y-3">
                     <div className="group border border-amber-200 bg-[#FFFBF0] rounded p-3 cursor-pointer hover:border-amber-300 transition-colors">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="text-[11px] font-semibold text-amber-900">Vendor Setup Flow</div>
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        </div>
                        <div className="text-[10px] text-amber-800/80 leading-relaxed mb-2">Compliance team needs to sign-off on the automated screening configuration.</div>
                        <div className="text-[9px] font-mono text-amber-700/60 font-semibold uppercase">Pending • Due Tomorrow</div>
                     </div>
                     <div className="border border-slate-200 bg-slate-50 rounded p-3 cursor-pointer opacity-60">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="text-[11px] font-semibold text-slate-700 line-through">Confirm License Costs</div>
                        </div>
                        <div className="text-[10px] text-slate-500 line-through mb-2">Review vendor pricing tiers.</div>
                        <div className="text-[9px] font-mono text-green-600 font-semibold flex items-center gap-1 uppercase"><CheckCircle2 className="w-3 h-3"/> Approved</div>
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
