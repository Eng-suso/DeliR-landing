import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkAnimatedBackground from '../components/DarkAnimatedBackground';
import Footer from '../components/Footer';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !role) return;
    
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-between relative overflow-hidden">
      <DarkAnimatedBackground />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="w-full absolute top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-300 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to DeliR
          </Link>
        </div>
      </div>
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center py-24 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-4 h-4" />
            <span>Private Beta Access</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tighter text-white mb-6 leading-[1.1]">
            Shape the future <br className="hidden md:block"/> of business operations.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
            DeliR is currently available to a select group of pioneers. 
            Request access to be the first to map, simulate, and transform your workflows with AI.
          </p>

          <div className="max-w-xl mx-auto w-full">
            {status === 'success' ? (
              <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-10"
              >
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">You're on the list</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  Keep an eye on your inbox. We'll send your exclusive access link very soon.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-sm text-slate-500 hover:text-white transition-colors underline underline-offset-4"
                >
                  Register another email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative group text-left max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-300"></div>
                <div className="relative flex flex-col bg-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-2xl transition-all">
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-400 mb-1 ml-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700/50 hover:border-slate-600 text-white px-4 py-3 rounded-2xl placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="Jane"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-400 mb-1 ml-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700/50 hover:border-slate-600 text-white px-4 py-3 rounded-2xl placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                     <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1 ml-1">Work Email</label>
                     <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700/50 hover:border-slate-600 text-white px-4 py-3 rounded-2xl placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="jane@company.com"
                      />
                  </div>

                  <div className="mb-6">
                     <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-1 ml-1">Role / Job Title</label>
                     <input
                        type="text"
                        id="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700/50 hover:border-slate-600 text-white px-4 py-3 rounded-2xl placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        placeholder="e.g. PM, Consultant, Engineer"
                      />
                  </div>

                  <p className="text-xs text-slate-500 mb-6 text-center">
                    By requesting access, you agree to our data processing guidelines to receive waitlist updates.
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <>
                        Request Access
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
      
      <div className="w-full relative z-10 mt-auto">
         <Footer />
      </div>
    </div>
  );
}
