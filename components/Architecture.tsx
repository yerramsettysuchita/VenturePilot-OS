"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const layers = [
  {
    label: "Founder Context Layer",
    sub: "Idea · Goals · Constraints · Risk Profile",
    color: "#00C9A7",
    bg: "#E6FBF7",
  },
  {
    label: "DeepSearch Intelligence",
    sub: "Market · Competitors · Pricing · Timing",
    color: "#00C9A7",
    bg: "#F0FDF9",
  },
  {
    label: "Venture Reasoning Engine",
    sub: "Path Generation · Scoring · Explainability",
    color: "#8B5CF6",
    bg: "#F3EFFE",
  },
  {
    label: "Project HUB Execution",
    sub: "Milestones · Kanban · Sprints · Roadmap",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    label: "Adaptive Venture Twin",
    sub: "Assumption Tracking · Pivot Alerts · Refresh",
    color: "#F97316",
    bg: "#FFF4EE",
  },
];

export default function Architecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#F8FAFC]" id="architecture">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Architecture</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            Built to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              reason,
            </span>{" "}
            not just respond.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          {layers.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 rounded-xl p-5"
              style={{ background: l.bg, borderLeft: `4px solid ${l.color}` }}
            >
              <div>
                <div className="font-bold text-ink text-sm">{l.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{l.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
