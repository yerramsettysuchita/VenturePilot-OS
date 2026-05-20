"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    label: "Understand",
    desc: "Founder context, constraints, goals in 60 seconds",
    color: "#00C9A7",
    bg: "#E6FBF7",
  },
  {
    num: "02",
    label: "Research",
    desc: "DeepSearch scans market live",
    color: "#8B5CF6",
    bg: "#F3EFFE",
  },
  {
    num: "03",
    label: "Simulate",
    desc: "3 venture paths generated",
    color: "#00C9A7",
    bg: "#E6FBF7",
  },
  {
    num: "04",
    label: "Score",
    desc: "7-dimension evidence scoring",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    num: "05",
    label: "Execute",
    desc: "Real Project HUB board created",
    color: "#8B5CF6",
    bg: "#F3EFFE",
  },
  {
    num: "06",
    label: "Adapt",
    desc: "Venture Twin monitors assumptions",
    color: "#F97316",
    bg: "#FFF4EE",
  },
];

export default function Solution() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" id="solution">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">The Solution</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            One intelligent loop.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              End to end.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-4"
                style={{ background: s.bg, color: s.color }}
              >
                {s.num}
              </div>
              <div className="font-bold text-ink text-lg mb-2">{s.label}</div>
              <div className="text-slate-500 text-sm leading-relaxed">
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
