import { MessageSquareText, Network, LineChart, FastForward, PencilRuler, ArrowLeftRight, FileBarChart, AlertCircle, Plus, ArrowRight, Mic, Send, MousePointer2, Hand, LayoutTemplate, Sparkles, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Plan the process with AI",
    desc: "Start a guided conversation with DeliR. The AI asks the right questions, helps clarify the workflow and builds a preview of the process while the consultant explains how the work happens."
  },
  {
    title: "Generate the As-Is process",
    desc: "DeliR turns the conversation into a clear As-Is process map. You see activities, responsibilities, decisions, handoffs and critical points in a shared canvas."
  },
  {
    title: "Analyze KPIs, risks and gaps",
    desc: "DeliR highlights what is missing, unclear, slow, risky or weak. It identifies process KPIs, potential bottlenecks, operational risks and improvement opportunities."
  },
  {
    title: "Preview the simulation",
    desc: "DeliR creates a simulation preview based on process assumptions. You can see how cycle time, bottlenecks, workload and KPI performance may change under different scenarios."
  },
  {
    title: "Design the To-Be process",
    desc: "Once the As-Is process is understood, DeliR helps the consultant design a better To-Be process. The goal is not just to document work. The goal is to improve how work should happen."
  },
  {
    title: "Compare As-Is vs To-Be",
    desc: "DeliR compares the current process with the improved scenario. See what changes, which risks are reduced, which KPIs improve and where the process becomes more automation-ready."
  },
  {
    title: "Create a manager-ready output",
    desc: "Export a clear dashboard or report showing the As-Is, the To-Be, KPI changes, risks, assumptions and improvement results. Built for teams that need to explain process decisions clearly to managers, clients and stakeholders."
  }
];

const PlanModeAnimatedCard = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white w-full h-[300px] rounded-[1.25rem] shadow-2xl flex overflow-hidden font-sans border border-slate-200 relative">
      {/* Left Sidebar Plan Mode */}
      <div className="w-[45%] h-full flex flex-col border-r border-slate-200 bg-white z-10 shrink-0 relative">
         {/* Header */}
         <div className="h-10 border-b border-slate-200 flex items-center px-3 gap-2 bg-white">
           <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
             <MessageSquareText className="w-3 h-3" />
           </div>
           <div className="flex flex-col">
             <span className="text-[9px] font-bold text-slate-900 leading-none">PLAN MODE</span>
             <span className="text-[7px] text-slate-500 font-medium leading-tight mt-0.5">PROCESS SYNTHESIZER</span>
           </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 relative">
            <div className="bg-gradient-to-br from-indigo-50/50 to-fuchsia-50/50 absolute inset-0 z-0 pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 relative z-10"
            >
              <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded p-2 text-[8px] text-slate-700 shadow-sm leading-relaxed max-w-[85%]">
                How is the invoice approved?
              </div>
            </motion.div>

            {step >= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 flex-row-reverse relative z-10"
              >
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-[7px] font-bold text-slate-600">SM</span>
                </div>
                <div className="bg-slate-900 text-white rounded p-2 text-[8px] shadow-sm leading-relaxed max-w-[85%]">
                  If PO matches, Finance approves. Else, Exception loop.
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 relative z-10"
              >
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0">
                   <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex flex-col gap-1 w-full max-w-[85%]">
                  <div className="bg-white border border-slate-200 rounded p-2 text-[8px] text-slate-700 shadow-sm leading-relaxed">
                    Got it. Generated the BPMN diagram.
                  </div>
                </div>
              </motion.div>
            )}
         </div>

         {/* Bottom Input Area */}
         <div className="p-2 border-t border-slate-100 bg-white">
            <div className="border border-slate-200 rounded-lg p-1.5 shadow-sm bg-white relative">
               <div className="flex items-center gap-1.5 mb-1.5">
                   <span className="text-[8px] text-slate-400 px-1 truncate">
                     {step === 0 ? "Typing..." : "Describe the process..."}
                   </span>
                   {step === 0 && (
                     <motion.div 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }}
                       className="w-1 h-3 bg-blue-500 rounded-full"
                     />
                   )}
               </div>
               <div className="flex items-center justify-between">
                 <button className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 shrink-0">
                   <Plus className="w-2.5 h-2.5" />
                 </button>
                 <div className="flex items-center gap-1">
                    <div className="text-[7px] font-semibold text-blue-600 bg-blue-50/50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">
                      D2 <ChevronDown className="w-2 h-2 ml-0.5" />
                    </div>
                    <button className="w-5 h-5 rounded-full text-slate-400 flex items-center justify-center shrink-0">
                      <Mic className="w-2.5 h-2.5" />
                    </button>
                    <button className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
                       <Send className="w-2.5 h-2.5 ml-0.5 -mt-0.5" />
                    </button>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right Canvas */}
      <div className="flex-1 bg-slate-50 relative pointer-events-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
        <div className="absolute top-2 left-2 flex bg-white border border-slate-200 rounded shadow-sm overflow-hidden z-20">
           <div className="px-2 py-1 text-[7px] font-semibold text-slate-800 border-r border-slate-200 flex items-center gap-1 bg-slate-50">
             <MousePointer2 className="w-2 h-2" /> Select
           </div>
           <div className="px-2 py-1 text-[7px] font-medium text-slate-500 border-r border-slate-200 flex items-center gap-1">
             <Hand className="w-2 h-2" /> Move
           </div>
        </div>
        
        {/* Animated Canvas Elements */}
        {step >= 2 && (
           <div className="absolute inset-0 flex items-center justify-center transform scale-[0.6] mt-4 ml-4">
              <svg className="absolute inset-0 w-[500px] h-[500px] pointer-events-none stroke-blue-400 z-0" style={{ left: '-150px', top: '-100px' }}>
                <defs>
                   <marker id="arrow-journey" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                     <path d="M 0 0 L 10 5 L 0 10 z" fill="#60A5FA" />
                   </marker>
                </defs>
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                  d="M 100 150 L 150 150" strokeWidth="2" fill="none" markerEnd="url(#arrow-journey)" 
                />
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                  d="M 180 150 L 220 150 L 220 100 L 250 100" strokeWidth="2" fill="none" markerEnd="url(#arrow-journey)" 
                />
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                  d="M 180 150 L 220 150 L 220 200 L 250 200" strokeWidth="2" fill="none" markerEnd="url(#arrow-journey)" 
                />
              </svg>

              <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                 className="absolute left-[-50px] top-[40px] w-8 h-8 rounded-full border-2 border-slate-700 bg-white shadow-md z-10"
              />
              <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                 className="absolute left-[15px] top-[30px] w-24 h-12 bg-white border border-slate-300 rounded shadow-md z-10 flex flex-col items-center justify-center"
              >
                 <span className="text-[10px] font-medium">Match PO</span>
                 <div className="w-3 h-3 bg-amber-100 text-amber-600 rounded flex items-center justify-center mt-1 border border-amber-200 rotate-45"><div className="-rotate-45 text-[6px]">X</div></div>
              </motion.div>
              <motion.div 
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
                 className="absolute left-[115px] top-[-10px] w-24 h-12 bg-white border border-slate-300 rounded shadow-md z-10 flex items-center justify-center text-[10px] font-medium"
              >
                 Finance Appl.
              </motion.div>
              <motion.div 
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 }}
                 className="absolute left-[115px] top-[90px] w-24 h-12 bg-[#FFFBF0] border border-amber-300 rounded shadow-md z-10 flex items-center justify-center text-[10px] font-medium"
              >
                 Exception Lp.
              </motion.div>
           </div>
        )}

        <div className="absolute bottom-2 right-2 bg-white border border-slate-200 rounded shadow-sm p-1.5 flex flex-col items-end z-20">
          <div className="w-12 h-8 border border-slate-200 border-dashed rounded bg-slate-50/50 relative overflow-hidden">
            {step >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-blue-100/30 flex items-center justify-center">
                 <div className="w-6 h-4 border border-blue-300 rounded bg-white"></div>
              </motion.div>
            )}
          </div>
          <div className="text-[5px] text-slate-400 mt-1 font-mono uppercase tracking-wider">React Flow</div>
        </div>
      </div>
    </div>
  );
};

const renderVisualTemplate = (idx: number) => {
  switch(idx) {
    case 0:
      return <PlanModeAnimatedCard />;
    case 1:
      return (
        <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl p-6 relative transform transition-transform hover:-translate-y-1 duration-500">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-40 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm z-10">
              <div className="h-2 w-16 bg-slate-300 rounded-full" />
            </div>
            <div className="w-px h-6 bg-slate-300" />
            <div className="w-40 h-10 bg-white border border-blue-200 rounded-lg flex items-center justify-center shadow-sm z-10 ring-2 ring-blue-50">
              <div className="h-2 w-20 bg-blue-400 rounded-full" />
            </div>
            <div className="w-px h-6 bg-slate-300" />
            <div className="w-40 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shadow-sm z-10">
              <div className="h-2 w-14 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="relative w-full max-w-sm transform transition-transform hover:-translate-y-1 duration-500">
          <div className="bg-white w-full rounded-[1.5rem] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="h-3 w-20 bg-slate-200 rounded-full" />
              <div className="h-3 w-12 bg-slate-100 rounded-full" />
            </div>
            <div className="flex items-end gap-4 h-24">
              <div className="flex-1 bg-slate-100 rounded-t-sm h-1/3" />
              <div className="flex-1 bg-slate-100 rounded-t-sm h-1/2" />
              <div className="flex-1 bg-rose-200 rounded-t-sm h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </div>
              <div className="flex-1 bg-slate-100 rounded-t-sm h-2/3" />
            </div>
          </div>
          <div className="absolute -top-6 -right-4 bg-white border border-rose-100 shadow-xl rounded-2xl p-3 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
               <AlertCircle className="w-4 h-4 text-rose-600" />
             </div>
             <div>
               <div className="h-2 w-16 bg-slate-800 rounded-full mb-1.5" />
               <div className="h-1.5 w-10 bg-slate-400 rounded-full" />
             </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl p-6 flex flex-col gap-6 transform transition-transform hover:-translate-y-1 duration-500">
          <div>
            <div className="flex justify-between items-center mb-3">
               <div className="h-2.5 w-16 bg-slate-200 rounded-full" />
               <div className="h-2.5 w-8 bg-slate-300 rounded-full" />
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-300 w-3/4" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
               <div className="h-2.5 w-20 bg-blue-100 rounded-full" />
               <div className="h-2.5 w-12 bg-blue-500 rounded-full" />
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-1/2" />
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="w-full max-w-sm flex items-center gap-4 transform transition-transform hover:-translate-y-1 duration-500">
           <div className="flex-1 h-24 bg-white shadow-2xl rounded-[1.25rem] flex items-center justify-center">
              <div className="h-2.5 w-12 bg-slate-200 rounded-full" />
           </div>
           <ArrowRight className="text-white/50 w-5 h-5" />
           <div className="flex-1 h-28 bg-blue-50/10 border-2 border-dashed border-blue-400 rounded-[1.25rem] flex items-center justify-center relative backdrop-blur-sm">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                 <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="h-2.5 w-16 bg-blue-300/50 rounded-full" />
           </div>
        </div>
      );
    case 5:
      return (
        <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl p-5 flex gap-4 transform transition-transform hover:-translate-y-1 duration-500">
           <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
             <div className="h-2.5 w-10 bg-slate-300 rounded-full mb-1" />
             <div className="h-10 w-full bg-white border border-slate-200 rounded-lg" />
             <div className="h-10 w-full bg-white border border-slate-200 rounded-lg" />
           </div>
           <div className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col gap-3 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
               To-Be
             </div>
             <div className="h-2.5 w-12 bg-blue-400 rounded-full mb-1" />
             <div className="h-10 w-full bg-white border border-blue-200 rounded-lg" />
             <div className="h-10 w-full bg-brand-navy rounded-lg flex items-center justify-center shadow-sm" >
                <div className="h-2 w-8 bg-white/50 rounded-full" />
             </div>
           </div>
        </div>
      );
    case 6:
      return (
        <div className="relative w-full max-w-sm transform transition-transform hover:-translate-y-1 duration-500">
           <div className="absolute top-0 right-8 -translate-y-1/2 w-40 h-20 bg-white/60 backdrop-blur-md border border-slate-100 rounded-t-[1.5rem] z-0 shadow-lg" />
           <div className="bg-white w-full rounded-[1.5rem] shadow-2xl p-6 relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-500 border-r-blue-500 flex items-center justify-center transform -rotate-45">
                 <div className="w-4 h-4 rounded-full bg-slate-800" />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                 <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                 <div className="h-2.5 w-4/5 bg-slate-100 rounded-full" />
                 <div className="h-2.5 w-1/2 bg-blue-100 rounded-full" />
              </div>
           </div>
        </div>
      );
    default:
      return null;
  }
};

import DarkAnimatedBackground from './DarkAnimatedBackground';

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.journey-step');
      
      steps.forEach((step, i) => {
        // Animate the text side
        const textSide = step.querySelector('.step-text');
        // Animate the visual side
        const visualSide = step.querySelector('.step-visual');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });

        // Add a nice staggered reveal
        tl.from(textSide, {
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          duration: 0.8,
          ease: "power3.out"
        }, 0)
        .from(visualSide, {
          opacity: 0,
          x: i % 2 === 0 ? 40 : -40,
          duration: 0.8,
          ease: "power3.out"
        }, 0.2); // slight delay for the visual side
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative z-10 selection:bg-blue-500/30 bg-brand-navy" id="how-it-works">
      <DarkAnimatedBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight">
            From messy process knowledge to a complete improvement journey.
          </h2>
        </div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step, idx) => (
            <div key={idx} className={`journey-step flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Text Side */}
              <div className="step-text w-full md:w-[45%] lg:w-1/2">
                <div className="w-8 h-8 rounded-full bg-white text-brand-navy flex items-center justify-center text-sm font-bold mb-6">
                  {idx + 1}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 leading-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Visual Side */}
              <div className="step-visual w-full md:w-[55%] lg:w-1/2">
                <div className="w-full aspect-[4/3] rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center p-6 md:p-8 relative overflow-hidden">
                  {renderVisualTemplate(idx)}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
