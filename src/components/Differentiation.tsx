import { X, Check } from 'lucide-react';

const traditional = [
  "Manual drawing",
  "Static maps",
  "Weak context",
  "No process memory",
  "Limited improvement intelligence"
];

const delir = [
  "AI-guided discovery",
  "As-Is and To-Be journey",
  "KPI, risk and gap analysis",
  "Simulation preview",
  "Manager-ready outputs",
  "Growing operational memory"
];

export default function Differentiation() {
  return (
    <section className="py-24 bg-[#F5F7FB]/70 backdrop-blur-[2px] relative z-10" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            Traditional tools help you draw processes. DeliR helps you understand, challenge, simulate and improve them.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Traditional Card */}
          <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Traditional process tools</h3>
            <ul className="space-y-4">
              {traditional.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600">
                  <X className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DeliR Card */}
          <div className="border-2 border-brand-blue rounded-2xl p-8 bg-indigo-50/30 relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              The DeliR Way
            </div>
            <h3 className="text-lg font-bold text-brand-navy mb-6">DeliR</h3>
            <ul className="space-y-4">
              {delir.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-900 font-medium">
                  <div className="bg-blue-100 rounded-full p-0.5">
                    <Check className="w-4 h-4 text-brand-blue shrink-0" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="inline-block text-xl md:text-2xl font-display font-semibold text-brand-navy border-b-2 border-brand-blue pb-1">
            It is not just a process map. It is the beginning of an operational brain for the company.
          </p>
        </div>
      </div>
    </section>
  );
}
