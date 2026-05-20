"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const steps = [
  {
    num: "01",
    label: "Idea Input",
    detail: 'Founder types: "AI tool for student founders"',
    color: "#00C9A7",
  },
  {
    num: "02",
    label: "DeepSearch Fires",
    detail: "Live market scan, competitor gaps identified",
    color: "#8B5CF6",
  },
  {
    num: "03",
    label: "3 Paths Generated",
    detail: "B2B SaaS · API Platform · Vertical Copilot",
    color: "#00C9A7",
  },
  {
    num: "04",
    label: "Winner Scored",
    detail: "Path A scores 8.7. Here is exactly why.",
    color: "#F59E0B",
  },
  {
    num: "05",
    label: "Execution Board Created",
    detail: "Real Project HUB board: 12 tasks, 4 sprints",
    color: "#8B5CF6",
  },
  {
    num: "06",
    label: "Venture Twin Active",
    detail: "3 assumptions monitored. Alert threshold set.",
    color: "#F97316",
  },
];

export default function Demo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      setActiveStep(i);
      i++;
      if (i >= steps.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section className="py-24 bg-[#F8FAFC]" id="in-action">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">In Action</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-4">
            From idea to execution board{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              in 60 seconds.
            </span>
          </h2>
          <p className="text-slate-500 text-lg">
            One idea. Three paths. One board. Your execution team waiting.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {steps.map((s, i) => {
            const isDone = activeStep > i;
            const isActive = activeStep === i;

            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -20 }}
                animate={activeStep >= i ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                transition={{ duration: 0.4 }}
                className="card p-5 flex items-center gap-5 transition-all duration-300"
                style={
                  isActive
                    ? { borderLeft: `4px solid ${s.color}`, background: "#FAFFFE" }
                    : isDone
                    ? { borderLeft: "4px solid #00C9A7" }
                    : {}
                }
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: isDone ? "#00C9A7" : isActive ? s.color : "#F1F5F9",
                    color: isDone || isActive ? "#fff" : "#94A3B8",
                  }}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-bold text-sm mb-0.5 ${
                      isActive ? "text-ink" : isDone ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div
                    className={`text-sm ${
                      isActive ? "text-slate-600" : isDone ? "text-slate-400" : "text-slate-300"
                    }`}
                  >
                    {s.detail}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: s.color }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={activeStep >= steps.length - 1 ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => setActiveStep(-1)}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
          >
            Run again
          </button>
        </motion.div>
      </div>
    </section>
  );
}
