"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const assumptions = [
  {
    label: "Enterprise buyers will pay $500/mo",
    pct: 82,
    score: "8.2 / 10",
    status: "Stable",
    statusColor: "#00C9A7",
    checked: "2 min ago",
    alert: null,
  },
  {
    label: "Primary competitor won't go downmarket",
    pct: 51,
    score: "5.1 / 10",
    status: "At Risk",
    statusColor: "#F59E0B",
    checked: "14 min ago",
    alert: "Competitor raised $12M Series A. Downmarket expansion likely.",
  },
  {
    label: "Target regulation stays unchanged",
    pct: 78,
    score: "7.8 / 10",
    status: "Stable",
    statusColor: "#00C9A7",
    checked: "1 hr ago",
    alert: null,
  },
];

function HealthBar({ pct, color, inView }: { pct: number; color: string; inView: boolean }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}

function TwinCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="card overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00C9A7] pulse-dot" />
          <span className="text-sm font-bold text-ink">Venture Twin: Active</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Live</span>
      </div>

      {/* Assumption rows */}
      <div className="divide-y divide-slate-100">
        {assumptions.map((a, i) => (
          <div
            key={a.label}
            className="px-5 py-4"
            style={a.alert ? { background: "#FFFBEB" } : {}}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs text-slate-600 flex-1 leading-relaxed">{a.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: a.statusColor + "18", color: a.statusColor }}
                >
                  {a.status === "At Risk" ? "⚠ " : "✓ "}{a.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex-1">
                <HealthBar pct={a.pct} color={a.statusColor} inView={inView} />
              </div>
              <span className="text-xs font-bold text-slate-500 shrink-0 w-12 text-right">
                {a.score}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Last checked {a.checked}</span>
            </div>

            {a.alert && (
              <div
                className="mt-2.5 text-xs rounded-lg px-3 py-2 leading-relaxed"
                style={{ background: "#F59E0B18", color: "#92400E" }}
              >
                {a.alert}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 leading-relaxed">
          3 assumptions monitored · 1 alert active · Next scan in 47 min
        </span>
        <Link
          href="/how-it-works#adapt"
          className="text-xs font-semibold text-[#00C9A7] hover:underline whitespace-nowrap"
        >
          Review Strategy →
        </Link>
      </div>
    </div>
  );
}

export default function VentureTwin() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#F8FAFC]" id="venture-twin">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left copy */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div
              className="text-xs font-bold tracking-widest uppercase mb-4 inline-flex items-center gap-2"
              style={{ color: "#00C9A7" }}
            >
              <span className="w-6 h-px bg-[#00C9A7]" />
              The Moat
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-6">
              Your startup has a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                nervous system now.
              </span>
            </h2>

            <div className="space-y-5 text-slate-500 leading-relaxed mb-8">
              <p>
                Every startup runs on assumptions. Most founders write them in a
                Notion doc and never look at them again. The Adaptive Venture Twin
                stores every assumption your chosen path was built on and watches
                the signals that would break them.
              </p>
              <p>
                When a competitor drops pricing. When a market report shows demand
                shrinking. When a new regulation drops. The Twin doesn&apos;t send a
                notification and leave it there. It recomputes your path rankings.
                It tells you whether your current strategy still holds. It updates
                your execution board.
              </p>
              <blockquote className="border-l-4 border-[#00C9A7] pl-5 py-1 text-ink font-semibold text-lg italic">
                &ldquo;This is not a feature. This is the reason VenturePilot OS
                exists at all.&rdquo;
              </blockquote>
            </div>

            <Link
              href="/how-it-works#adapt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00C9A7] hover:gap-3 transition-all"
            >
              See the Twin in action
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 flex justify-center lg:justify-end w-full"
          >
            <TwinCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
