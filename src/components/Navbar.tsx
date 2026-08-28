import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [threshold, setThreshold] = useState(800); // Default fallback

  useEffect(() => {
    const updateThreshold = () => {
      const problemSec = document.getElementById('problem');
      if (problemSec) {
        // Trigger right before the problem section comes into full view
        setThreshold(problemSec.offsetTop - 120);
      }
    };
    
    // Slight delay to ensure DOM layout is complete
    const timeoutId = setTimeout(updateThreshold, 100);
    window.addEventListener('resize', updateThreshold);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateThreshold);
    };
  }, []);

  useEffect(() => {
    const unsub = scrollY.on('change', (latest) => {
      const shouldCollapse = latest > threshold;
      setIsCollapsed(shouldCollapse);
      if (shouldCollapse && isOpen) {
        setIsOpen(false);
      }
    });
    return unsub;
  }, [scrollY, isOpen, threshold]);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav 
        layout
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", layout: { type: "spring", stiffness: 350, damping: 30 } }}
        className={`pointer-events-auto bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 flex flex-col overflow-hidden origin-top
          ${isCollapsed ? 'w-auto px-6' : 'w-[96%] max-w-7xl px-6 sm:px-8'}
        `}
      >
        <div className={`flex justify-between items-center transition-all duration-300 ${isCollapsed ? 'h-14 gap-6' : 'h-16'}`}>
          <motion.div layout="position" className="flex items-center shrink-0">
            <span className="font-display font-bold text-2xl tracking-tighter text-slate-900">
              DeliR<span className="text-blue-600">.</span>
            </span>
          </motion.div>
          
          <motion.div layout="position" className={`hidden md:flex items-center space-x-8 shrink-0`}>
            <a href="#product" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Product</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <a href="#vision" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Vision</a>
            <a href="#early-access" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Early Access</a>
          </motion.div>

          {/* Button */}
          <motion.div layout="position" className="hidden md:flex items-center shrink-0">
            <motion.div 
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link 
                to="/waitlist"
                className={`bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer flex items-center justify-center overflow-hidden
                  ${isCollapsed ? 'px-6 py-2 text-sm rounded-full' : 'px-6 py-2.5 rounded-full text-sm'}
                `}
                title="Try the Process Demo"
              >
                <motion.span
                  layout="position"
                  className="whitespace-nowrap inline-block"
                >
                  Try the Process Demo
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div layout="position" className="md:hidden flex items-center shrink-0">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 cursor-pointer">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && !isCollapsed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-100 mt-2 px-2 pb-4 space-y-1"
            >
              <a href="#product" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">Product</a>
              <a href="#how-it-works" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">How it works</a>
              <a href="#vision" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">Vision</a>
              <a href="#early-access" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl">Early Access</a>
              <div className="pt-2">
                <motion.div 
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                >
                  <Link 
                    to="/waitlist"
                    className="block text-center w-full bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Try the Process Demo
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
