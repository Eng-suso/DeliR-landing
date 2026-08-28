import { motion } from 'motion/react';

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAFAF8]">
      <svg className="absolute min-w-[150vw] min-h-[150vh] -top-[25vh] -left-[25vw] opacity-[0.85]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
           <linearGradient id="g1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0"/>
           </linearGradient>
           <linearGradient id="g2" x1="80%" y1="0%" x2="20%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
           </linearGradient>
           <linearGradient id="g3" x1="100%" y1="20%" x2="0%" y2="80%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0"/>
           </linearGradient>
        </defs>

        {/* Thick semi-transparent washes */}
        <motion.path 
            fill="url(#g1)"
            animate={{
               d: [
                "M 100 0 C 60 20, 40 60, 0 100 L 100 100 Z",
                "M 100 -20 C 50 40, 30 80, 0 100 L 100 100 Z",
                "M 100 0 C 60 20, 40 60, 0 100 L 100 100 Z"
               ]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.path 
            fill="url(#g2)"
            animate={{
               d: [
                "M 80 -20 C 50 30, 20 70, -20 90 L -20 -20 Z",
                "M 90 -20 C 40 10, 30 80, -20 80 L -20 -20 Z",
                "M 80 -20 C 50 30, 20 70, -20 90 L -20 -20 Z"
               ]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <motion.path 
            fill="url(#g3)"
            animate={{
               d: [
                "M 120 0 C 80 40, 50 90, 20 120 L 120 120 Z",
                "M 110 -10 C 60 30, 40 80, 10 120 L 120 120 Z",
                "M 120 0 C 80 40, 50 90, 20 120 L 120 120 Z"
               ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />

        {/* Sharp fine lines for that "ribbon edge" look */}
        <motion.path 
            fill="none"
            stroke="#2563eb"
            strokeWidth="0.15"
            opacity="0.6"
            animate={{
               d: [
                "M 100 0 C 60 20, 40 60, 0 100",
                "M 100 -20 C 50 40, 30 80, 0 100",
                "M 100 0 C 60 20, 40 60, 0 100"
               ]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path 
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="0.1"
            opacity="0.5"
            animate={{
               d: [
                "M 90 -20 C 50 30, 20 70, -10 110",
                "M 100 -20 C 40 10, 30 80, -20 100",
                "M 90 -20 C 50 30, 20 70, -10 110"
               ]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

         <motion.path 
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.2"
            opacity="0.4"
            animate={{
               d: [
                "M 110 -10 C 70 30, 50 80, 10 120",
                "M 120 0 C 60 40, 40 90, 20 120",
                "M 110 -10 C 70 30, 50 80, 10 120"
               ]
            }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Cross flows to add complexity */}
         <motion.path 
            fill="none"
            stroke="#60a5fa"
            strokeWidth="0.1"
            opacity="0.5"
            animate={{
               d: [
                "M 60 -20 C 60 30, 10 60, -20 80",
                "M 70 -20 C 50 20, 20 50, -20 70",
                "M 60 -20 C 60 30, 10 60, -20 80"
               ]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </svg>
    </div>
  );
}
