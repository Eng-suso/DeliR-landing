export default function Footer() {
  return (
    <footer className="py-12 relative z-10 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center">
          <span className="font-display font-bold text-xl tracking-tighter text-white">
            DeliR<span className="text-brand-blue">.</span>
          </span>
        </div>
        <div className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} DeliR Inc. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
