import { ArrowRight, TerminalSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import DarkAnimatedBackground from './DarkAnimatedBackground';

export default function FinalCTA() {
  return (
    <section className="py-24 relative z-10 bg-brand-navy" id="early-access">
      <DarkAnimatedBackground />
      
      {/* Blur circles wrapped in overflow-hidden to prevent them from spilling out of the section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] transform translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white mb-8">
           <TerminalSquare className="w-8 h-8" />
        </div>
        <h2 className="text-4xl md:text-[44px] font-display font-medium text-white mb-6 tracking-tight leading-[1.1]">
          Start with one messy workflow.<br />
          <span className="text-blue-200">Leave with a clear As-Is map, a better To-Be process and a report your team can actually use.</span>
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Try the DeliR Process Demo and help shape the next generation of business operations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="w-full sm:w-auto"
          >
            <Link to="/waitlist" className="block w-full bg-brand-blue text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
              Try the Process Demo
            </Link>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="w-full sm:w-auto"
          >
            <Link to="/waitlist" className="block w-full bg-transparent border border-slate-600 text-white px-8 py-4 rounded-lg text-base font-medium hover:bg-slate-800 hover:border-slate-500 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Join Early Access
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
