"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const rows = [
  "Live market research",
  "Multi-path simulation",
  "Evidence-based scoring",
  "Strategy explainability",
  "Auto execution board",
  "Adaptive Venture Twin",
  "Founder decision memory",
  "Assumption monitoring",
  "Pivot simulation",
  "Project HUB integration",
];

type CellValue = "yes" | "no" | "partial";

const cols: { label: string; values: CellValue[] }[] = [
  { label: "VenturePilot OS", values: Array(10).fill("yes") as CellValue[] },
  { label: "Business Plan Tools", values: ["no","no","no","no","no","no","no","no","no","no"] },
  { label: "Validators", values: ["partial","no","partial","no","no","no","no","no","no","no"] },
  { label: "Generic AI Assistants", values: ["no","no","no","partial","no","no","no","no","no","no"] },
];

function Cell({ val, isVP }: { val: CellValue; isVP: boolean }) {
  if (val === "yes")
    return (
      <td
        className="px-4 py-3.5 text-center text-sm"
        style={isVP ? { background: "#00C9A710" } : {}}
      >
        <span className="font-bold text-[#00C9A7]">✓</span>
      </td>
    );
  if (val === "partial")
    return (
      <td className="px-4 py-3.5 text-center text-sm">
        <span className="text-[#F59E0B] italic text-xs font-medium">partial</span>
      </td>
    );
  return (
    <td className="px-4 py-3.5 text-center text-sm">
      <span className="text-slate-300 font-bold">✗</span>
    </td>
  );
}

export default function ComparisonTable() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" id="comparison">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-label mb-4">Why VenturePilot OS</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-3">
            Why founders choose{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              VenturePilot OS.
            </span>
          </h2>
          <p className="text-slate-500 text-lg">
            We&apos;re not the first AI tool for founders. We&apos;re the first one that
            actually makes the decision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm"
        >
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-[#0A0A0F]">
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-400">
                  Feature
                </th>
                {cols.map((c, i) => (
                  <th
                    key={c.label}
                    className="px-4 py-4 text-center text-sm font-bold"
                    style={{
                      color: i === 0 ? "#00C9A7" : "#94A3B8",
                      ...(i === 0 ? { boxShadow: "inset 1px 0 0 #00C9A730, inset -1px 0 0 #00C9A730" } : {}),
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={row}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50/50"
                  style={{ background: ri % 2 === 0 ? "#ffffff" : "#F8FAFC" }}
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-ink">{row}</td>
                  {cols.map((c, ci) => (
                    <Cell key={c.label} val={c.values[ri]} isVP={ci === 0} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-400 text-sm mt-6"
        >
          Every ✓ is a decision your team doesn&apos;t have to make manually.
        </motion.p>
      </div>
    </section>
  );
}
