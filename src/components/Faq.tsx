import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What problem does DeliR solve?",
    answer: "Most companies do not have a clear view of how their processes really work.\n\nThe workflow is often spread across meetings, documents, spreadsheets, emails and people’s memory. DeliR helps turn that scattered information into clear process maps, KPI analysis, risk signals and improved To-Be processes."
  },
  {
    question: "Who is DeliR built for?",
    answer: "DeliR is built for consultants, operations teams, business analysts and managers who need to understand, explain and improve business processes.\n\nIt is especially useful when a process is important, but unclear, undocumented or difficult to explain to stakeholders."
  },
  {
    question: "Is DeliR just a process mapping tool?",
    answer: "No.\n\nDeliR does more than draw process maps. It helps users understand the workflow, identify missing information, find bottlenecks, highlight risks and create process documentation that managers can actually use.\n\nThe map is only the starting point."
  },
  {
    question: "Does the user stay in control?",
    answer: "Yes.\n\nDeliR creates a structured first version of the process, but the user reviews, edits and confirms the final output. The AI helps accelerate the work, while the consultant or process owner keeps control of the analysis and decisions."
  },
  {
    question: "Does DeliR improve over time?",
    answer: "Yes.\n\nAs teams map more processes, DeliR helps build a clearer memory of how the company works: common steps, recurring risks, repeated bottlenecks, process versions and improvement decisions.\n\nThis makes future analysis faster, more consistent and easier to explain across teams."
  },
  {
    question: "Can DeliR help before automation?",
    answer: "Yes.\n\nMany automation projects fail because teams try to automate processes they do not fully understand. DeliR helps clarify the workflow first, so teams can decide what should be automated, what should stay human and where risks need to be controlled."
  },
  {
    question: "Can managers understand the output?",
    answer: "Yes.\n\nDeliR is designed to create outputs that are clear for both technical and non-technical stakeholders. A manager view is available at every stage of the process, providing clear maps, insights and reports that managers can review, discuss and act on."
  },
  {
    question: "Is DeliR safe to use with business processes?",
    answer: "DeliR is designed for careful, review-based process analysis.\n\nUsers can work with simplified or anonymized information when needed, review AI-generated outputs before sharing them, and avoid including unnecessary sensitive data in the analysis."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white relative" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-medium text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-slate-200 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
              >
                <span className={`text-lg font-medium pr-8 transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${openIndex === index ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-blue-600 group-hover:text-blue-600'}`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="pb-8 text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
