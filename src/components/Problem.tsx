import { FileSearch, Clock, ShieldAlert, RotateCcw, Activity, GitFork } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: <FileSearch className="h-4 w-4 text-blue-600" />,
    title: "Unclear ownership",
    desc: "Responsibilities blur across departments and handoffs."
  },
  {
    icon: <Clock className="h-4 w-4 text-rose-600" />,
    title: "Slow approvals",
    desc: "Bottlenecks form when decisions rely on specific individuals."
  },
  {
    icon: <ShieldAlert className="h-4 w-4 text-amber-600" />,
    title: "Hidden risks",
    desc: "Compliance gaps hide in undocumented email chains."
  },
  {
    icon: <RotateCcw className="h-4 w-4 text-indigo-600" />,
    title: "Rework",
    desc: "Errors compound when initial inputs are incorrect or missing."
  },
  {
    icon: <Activity className="h-4 w-4 text-emerald-600" />,
    title: "Weak KPIs",
    desc: "Operations are measured on feelings rather than factual metrics."
  },
  {
    icon: <GitFork className="h-4 w-4 text-slate-600" />,
    title: "Automation built on confusion",
    desc: "RPA fails when applied to broken or misunderstood processes."
  }
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chaos to clarity scroll storytelling
      gsap.to(".chaos-card", {
        scrollTrigger: {
          trigger: ".chaos-section",
          start: "center center",
          scrub: true,
        },
        opacity: 0,
        y: -40,
        stagger: 0.05
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#F3F6FA]/80 backdrop-blur-[2px] chaos-section relative z-10" id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            Most companies do not really know how their processes work.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            The real workflow lives inside meetings, documents, spreadsheets, emails, exceptions and people’s memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 relative z-10">
          {problems.map((item, idx) => (
            <div key={idx} className="chaos-card group relative bg-white border border-slate-200 rounded-lg p-5 transition-all duration-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-300 overflow-hidden flex flex-col justify-center min-h-[120px]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400/0 to-transparent group-hover:via-slate-400/30 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-slate-50/50 group-hover:to-slate-50/10 transition-colors duration-500"></div>
              
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-8 h-8 rounded border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 transition-colors duration-500 group-hover:border-slate-200 group-hover:bg-white shadow-sm">
                  {item.icon}
                </div>
                <div className="flex flex-col pt-0.5">
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight transition-colors duration-300 mb-1">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-slate-700">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-brand-navy rounded-2xl p-8 md:p-10 text-center relative overflow-hidden clarity-quote shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <p className="text-xl md:text-2xl font-display font-semibold text-white relative z-10">
            "Before you improve or automate work, you need to understand how work actually happens."
          </p>
        </div>
      </div>
    </section>
  );
}
