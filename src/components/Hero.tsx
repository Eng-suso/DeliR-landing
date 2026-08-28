import { ArrowRight, AlertCircle, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CanvasPreview } from './canvas/CanvasPreview';

export default function Hero() {
  return (
    <div className="relative pt-44 pb-20 overflow-hidden bg-white/40">
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10 bg-fixed opacity-40"></div>
      {/* Abstract light blue gradient background matching the reference */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-100/60 rounded-[100%] blur-[120px] pointer-events-none outline-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-[56px] font-display font-medium text-slate-900 leading-[1.1] tracking-tight mb-6"
            >
              Map, analyze and improve business processes in minutes.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="text-lg text-slate-500 mb-10 leading-relaxed max-w-3xl"
            >
              DeliR helps consultants and operations teams turn messy workflow information into clear As-Is maps, KPI analysis, risk assessment, To-Be processes and manager-ready reports.
              <br /><br />
              <span className="font-medium text-slate-600">We are building the AI-native Operations System for how companies understand, improve and govern work.</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="w-full sm:w-auto"
              >
                <Link to="/waitlist" className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-500/20 cursor-pointer">
                  Get Started
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="w-full sm:w-auto bg-white text-slate-700 px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 cursor-pointer"
              >
                Learn more
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Product Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-6xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm overflow-hidden"
        >
          {/* Mac-like Header */}
          <div className="h-10 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="mx-auto flex gap-6 px-4">
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-xs font-medium text-slate-400"
               >
                 Project: Procure to Pay Redesign
               </motion.span>
            </div>
          </div>
          
          {/* Dashboard Body */}
          <div className="flex flex-col md:flex-row h-[600px] bg-white text-slate-900">
            
            {/* Left: Enterprise AI Plan Mode */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full md:w-[320px] bg-white border-r border-slate-200 flex flex-col relative z-20"
            >
              <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span className="font-medium text-[13px] tracking-tight">Plan Mode</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">SESSION_094</span>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                {/* AI Message */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  className="flex gap-3"
                >
                  <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-slate-900 mb-1">DeliR Model</span>
                    <div className="text-[13px] text-slate-600 leading-relaxed">
                      Initializing Procure-to-Pay template. Please describe the lifecycle of an invoice from receipt to final disbursement.
                    </div>
                  </div>
                </motion.div>

                {/* User Message */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 2.5 }}
                  className="flex gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5 border border-slate-300">
                    <span className="text-[9px] font-medium text-slate-600">US</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-slate-900 mb-1">Operations Team</span>
                    <div className="text-[13px] text-slate-600 leading-relaxed">
                      AP receives it via email, manually checks against PO. If it matches, Finance approves. If missing info, loop back to vendor.
                    </div>
                  </div>
                </motion.div>

                {/* AI Message (Executing) */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 4.0 }}
                  className="flex gap-3"
                >
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="text-[12px] font-semibold text-slate-900 mb-1">DeliR Model</span>
                    <div className="text-[13px] text-slate-600 leading-relaxed mb-3">
                      Parameters captured. Generating standard BPMN topology. 
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-700">Structural Anomaly Detected</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        The manual PO match phase lacks an explicit SLA. Extrapolating baseline from historical logs (4.2 days). 
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <div className="relative flex items-center bg-white border border-slate-300 rounded shadow-sm focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all">
                  <input 
                    type="text" 
                    placeholder="Refine parameters..." 
                    className="w-full bg-transparent border-none py-2 px-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0" 
                  />
                  <div className="px-2 border-l border-slate-200 cursor-pointer hover:bg-slate-50 group transition-colors">
                     <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 m-1" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center: Real BPMN Canvas from the software (read-only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex-1 relative overflow-hidden z-10"
            >
              <CanvasPreview />
            </motion.div>

            {/* Right: Dashboard / Insights Panel (Enterprise) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="w-full md:w-[280px] bg-white border-l border-slate-200 flex flex-col relative z-20"
            >
               <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between">
                 <h3 className="font-medium text-[12px] text-slate-900 uppercase tracking-widest">Metadata</h3>
                 <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
               </div>
               
               <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                 {/* Detail Group */}
                 <div>
                   <h4 className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-3">Model Telemetry</h4>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}
                     className="mb-4"
                   >
                     <div className="flex justify-between items-baseline mb-1">
                       <span className="text-[12px] text-slate-600">Cycle Time avg</span>
                       <span className="text-[13px] font-mono font-medium text-slate-900">4.2d</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 mt-1.5">
                       <div className="bg-slate-400 h-1 w-[65%]"></div>
                     </div>
                     <div className="text-[9px] text-slate-400 mt-1">Variance: ±0.8d</div>
                   </motion.div>

                   <motion.div 
                     initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.6 }}
                   >
                     <div className="flex justify-between items-baseline mb-1">
                       <span className="text-[12px] text-slate-600">FTE Overhead</span>
                       <span className="text-[13px] font-mono font-medium text-slate-900">18.5h</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 mt-1.5">
                       <div className="bg-slate-400 h-1 w-[40%]"></div>
                     </div>
                     <div className="text-[9px] text-slate-400 mt-1">Cost implication: High</div>
                   </motion.div>
                 </div>

                 {/* Risk Alert (Enterprise style) */}
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.4, delay: 4.8 }}
                   className="border border-amber-200 bg-[#FFFBF0] rounded p-3"
                 >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">Bottleneck Detected</span>
                    </div>
                    <p className="text-[11px] text-amber-800/80 leading-relaxed">
                      Manual PO matching generates 30% exception rate, inducing a secondary Clarification Loop (+2.5d penalty).
                    </p>
                 </motion.div>

                 {/* Actions */}
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.4, delay: 5.0 }}
                   className="pt-4 border-t border-slate-100"
                 >
                    <h4 className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-3">Simulations</h4>
                    <div className="space-y-2">
                      <div className="group flex flex-col border border-slate-200 rounded p-2.5 cursor-pointer hover:border-blue-400 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-800">Auto-OCR matching</span>
                          <span className="text-[10px] text-green-600 font-mono bg-green-50 px-1 rounded">-1.5d</span>
                        </div>
                        <span className="text-[9px] text-slate-500">Deploy AI extraction node</span>
                      </div>
                      
                      <div className="group flex flex-col border border-slate-200 rounded p-2.5 cursor-pointer hover:border-slate-400 transition-colors opacity-70">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-800">Vendor structured portal</span>
                          <span className="text-[10px] text-green-600 font-mono bg-green-50 px-1 rounded">-2.1d</span>
                        </div>
                        <span className="text-[9px] text-slate-500">Shift input to source</span>
                      </div>
                    </div>
                 </motion.div>
               </div>
            </motion.div>
            
          </div>

        </motion.div>
      </div>
    </div>
  );
}
