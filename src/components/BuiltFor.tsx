import DarkAnimatedBackground from './DarkAnimatedBackground';

const personas = [
  {
    title: "Consultants",
    desc: "Deliver clear, actionable process insights and rapid As-Is maps to clients faster than ever."
  },
  {
    title: "Operations teams",
    desc: "Uncover hidden bottlenecks and confidently simulate the impact of new procedures."
  },
  {
    title: "Process owners",
    desc: "Maintain a living, accurate blueprint of how work happens across your entire domain."
  },
  {
    title: "Transformation leaders",
    desc: "Base strategic change initiatives on data-driven KPIs rather than guesswork."
  },
  {
    title: "PMO",
    desc: "Standardize process discovery and governance across all internal projects."
  },
  {
    title: "Automation & AI teams",
    desc: "Ensure RPA and AI agents are deployed on optimized, clearly understood processes."
  }
];

export default function BuiltFor() {
  return (
    <section className="py-24 relative z-10 bg-slate-900 border-t border-slate-800">
      <DarkAnimatedBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            Built for those who engineer better work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/50 group hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 rounded-xl p-6 transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{persona.title}</h3>
              <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 group-hover:mt-3">
                <p className="text-sm text-slate-400 leading-relaxed">{persona.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
