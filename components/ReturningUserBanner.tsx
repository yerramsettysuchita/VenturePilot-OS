"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ReturningUserBanner() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [idea, setIdea] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sid = localStorage.getItem("vpos_session_id");
    const si = localStorage.getItem("vpos_startup_idea");
    if (sid) { setSessionId(sid); setIdea(si); }
  }, []);

  if (!sessionId || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-[#E6FBF7] border-b border-[#00C9A7]/30 px-6 py-3 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 text-sm">
          <span className="w-2 h-2 rounded-full bg-[#00C9A7] pulse-dot shrink-0" />
          <span className="text-slate-700">
            Welcome back. Your Venture Twin is monitoring 3 assumptions
            {idea ? ` for "${idea.slice(0, 40)}${idea.length > 40 ? "..." : ""}"` : ""}.
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href={`/venture-twin?session=${sessionId}`}
            className="text-sm font-bold text-[#00C9A7] hover:underline whitespace-nowrap"
          >
            Resume session →
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
