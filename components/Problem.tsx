"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    title: "Fragmented Research",
    desc: "Founders open 10 tabs and synthesize none of them.",
    color: "#00C9A7",
    bg: "#E6FBF7",
  },
  {
    title: "Static Validation",
    desc: "Reports that expire before the ink dries.",
    color: "#8B5CF6",
    bg: "#F3EFFE",
  },
  {
    title: "No Execution Bridge",
    desc: "Strategy never becomes tasks.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    title: "Pivoting Blind",
    desc: "Still running a plan the market invalidated 3 months ago.",
    color: "#F97316",
    bg: "#FFF4EE",
  },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#F8FAFC]" id="problem">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="section-label mb-4">The Problem</div>
            <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-6">
              Founders don&apos;t fail <br />at ideas.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              They fail at choosing and executing{" "}
              <span className="text-slate-700 font-semibold">
                the right path.
              </span>
            </p>
          </motion.div>

          <div className="flex-1 flex flex-col gap-4 w-full">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card flex items-start gap-4 p-5"
                style={{ borderLeft: `4px solid ${p.color}` }}
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: p.bg, color: p.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-bold text-ink text-sm mb-1">
                    {p.title}
                  </div>
                  <div className="text-slate-500 text-sm">{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
