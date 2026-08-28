import { Cpu } from 'lucide-react';

export default function Vision() {
  return (
    <section className="py-24 bg-white/60 backdrop-blur-[2px] relative z-10" id="vision">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-100">
          <Cpu className="w-8 h-8 text-brand-blue" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-10 tracking-tight">
          The AI-native Operations System for business processes.
        </h2>
        
        <div className="space-y-8 text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto text-left">
          <p>
            <strong className="text-slate-900 font-semibold">Today,</strong> DeliR starts with one process journey: Plan, As-Is, Simulation Preview, To-Be, Comparison and Manager Report.
          </p>
          <div className="h-px bg-slate-200"></div>
          <div className="space-y-4">
            <p>
              <strong className="text-slate-900 font-semibold">Tomorrow,</strong> DeliR is designed to become the AI-native Operations System for how companies understand, improve and govern their business processes.
            </p>
            <p>
              It helps teams discover how work really happens, turn that knowledge into clear process models, analyze KPIs and risks, simulate better scenarios, and prepare processes for automation.
            </p>
            <p>
              Over time, DeliR becomes a growing memory of how the company works.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-3xl mx-auto">
          <p className="text-xl font-display font-medium text-slate-800 italic">
            "A company’s operational knowledge should not live in scattered files and people’s memory. It should live in a system."
          </p>
        </div>
      </div>
    </section>
  );
}
