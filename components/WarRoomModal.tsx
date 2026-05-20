"use client";

import { motion, AnimatePresence } from "framer-motion";

const intel = [
  {
    label: "Market Demand",
    color: "#00C9A7",
    score: "8.4 / 10",
    finding: "Strong demand signal detected in university incubator segment. 47 active programs globally with no dedicated AI execution tooling.",
    source: "DeepSearch · Market Analysis",
  },
  {
    label: "Competitor Gap",
    color: "#8B5CF6",
    score: "Gap Found",
    finding: "Top 3 competitors (Lean Canvas, IdeaBuddy, Strategyzer) all stop at validation. None offer path scoring or execution board generation.",
    source: "DeepSearch · Competitor Intel",
  },
  {
    label: "Pricing Signal",
    color: "#F59E0B",
    score: "$49-199/mo",
    finding: "Adjacent tools price between $19-79/mo. Premium execution layer justifies $49-199 price point. No dominant player above $100.",
    source: "DeepSearch · Pricing Research",
  },
  {
    label: "Timing Signal",
    color: "#F97316",
    score: "Now",
    finding: "GPT-4 commoditization opening new product layer opportunities. University AI adoption at inflection. Window: 12-18 months before saturation.",
    source: "DeepSearch · Timing Analysis",
  },
];

export default function WarRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[900]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[901] mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest mb-1">
                    War Room
                  </div>
                  <h3 className="text-xl font-black text-ink">Sample Intelligence Output</h3>
                  <p className="text-sm text-slate-500 mt-1">Idea: AI tool for student founders</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 mt-1"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {intel.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-4 border"
                    style={{ borderColor: item.color + "30", background: item.color + "08" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: item.color + "18", color: item.color }}
                      >
                        {item.score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.finding}</p>
                    <div className="text-[10px] text-slate-400 font-medium">{item.source}</div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-3">
                  This is a sample output. Live War Room runs in real time.
                </p>
                <a
                  href="#waitlist"
                  onClick={onClose}
                  className="btn-scale inline-block text-sm font-bold px-6 py-2.5 rounded-lg bg-[#00C9A7] text-[#0A0A0F] hover:bg-[#00b396] transition-colors"
                >
                  Get Early Access →
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
