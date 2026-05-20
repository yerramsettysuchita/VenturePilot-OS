"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "5.8M+",
    label: "Global Founders",
    sub: "Addressable user base",
    color: "#00C9A7",
  },
  {
    value: "12→4",
    label: "Weeks to MVP",
    sub: "Reduction in decision cycles",
    color: "#8B5CF6",
  },
  {
    value: "60sec",
    label: "Idea to Execution Board",
    sub: "End-to-end demo time",
    color: "#F59E0B",
  },
  {
    value: "$0",
    label: "Novel ML Required",
    sub: "Proven LLM + API architecture",
    color: "#F97316",
  },
];

const details = [
  {
    label: "Who Uses It",
    body: "Early-stage founders, solo operators, and startup teams who move fast and make consequential decisions daily, without the luxury of large research teams.",
    color: "#00C9A7",
  },
  {
    label: "Real Impact",
    body: "Founders using VenturePilot OS compress weeks of research and planning into a single session, arriving at decision-ready clarity with a board ready to execute.",
    color: "#8B5CF6",
  },
  {
    label: "Feasibility",
    body: "Built on proven LLM APIs, vector databases, and project management infrastructure. No novel ML required. Designed for rapid deployment and iteration.",
    color: "#F59E0B",
  },
  {
    label: "Scalability",
    body: "Serverless-first architecture scales from one founder to thousands without re-platforming. Each venture context is isolated and portable.",
    color: "#F97316",
  },
];

export default function Impact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" id="impact">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Impact</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            Built for the founders{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              who move fast.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-6 text-center"
            >
              <div
                className="text-3xl font-black mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="font-bold text-ink text-sm">{s.label}</div>
              <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {details.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="card p-6"
              style={{ borderLeft: `4px solid ${d.color}` }}
            >
              <div className="font-bold text-ink text-sm mb-2">{d.label}</div>
              <div className="text-slate-500 text-sm leading-relaxed">
                {d.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
