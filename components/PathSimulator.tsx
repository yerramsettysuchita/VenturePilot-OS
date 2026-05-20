"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Path = {
  label: string;
  name: string;
  score: number;
  type: string;
  desc: string;
  dims: { label: string; val: number }[];
  bestFor: string;
};

type PathSet = [Path, Path, Path];

const PATHS: Record<string, PathSet> = {
  student: [
    { label: "A", name: "Startup Validation Copilot", score: 8.7, type: "B2B SaaS",
      desc: "AI-powered validation tool for student founders in incubators",
      dims: [{ label: "Demand", val: 8.4 }, { label: "Feasibility", val: 9.0 }, { label: "GTM", val: 7.5 }],
      bestFor: "Solo technical founders" },
    { label: "B", name: "Cohort Execution Platform", score: 7.4, type: "Platform",
      desc: "Workflow engine for university accelerator programs",
      dims: [{ label: "Demand", val: 7.1 }, { label: "Feasibility", val: 8.2 }, { label: "GTM", val: 6.8 }],
      bestFor: "Teams of 2-5" },
    { label: "C", name: "Founder Decision Intelligence", score: 6.9, type: "Vertical SaaS",
      desc: "Strategic advisory layer for student-run venture funds",
      dims: [{ label: "Demand", val: 6.8 }, { label: "Feasibility", val: 7.5 }, { label: "GTM", val: 6.2 }],
      bestFor: "Non-technical founders" },
  ],
  restaurant: [
    { label: "A", name: "Restaurant OS", score: 8.9, type: "Vertical SaaS",
      desc: "End-to-end inventory and ops platform for SMB restaurants",
      dims: [{ label: "Demand", val: 9.1 }, { label: "Feasibility", val: 8.6 }, { label: "GTM", val: 8.2 }],
      bestFor: "Operators with industry experience" },
    { label: "B", name: "F&B Procurement Network", score: 7.6, type: "Marketplace",
      desc: "B2B marketplace connecting restaurants to local suppliers",
      dims: [{ label: "Demand", val: 7.8 }, { label: "Feasibility", val: 7.2 }, { label: "GTM", val: 7.4 }],
      bestFor: "Teams with BD experience" },
    { label: "C", name: "Ghost Kitchen Intelligence", score: 6.7, type: "Data SaaS",
      desc: "Demand forecasting for dark kitchen operators",
      dims: [{ label: "Demand", val: 7.2 }, { label: "Feasibility", val: 6.8 }, { label: "GTM", val: 5.9 }],
      bestFor: "Technical founders" },
  ],
  freelance: [
    { label: "A", name: "Freelance Verification Layer", score: 8.5, type: "B2B SaaS",
      desc: "Trust and verification infrastructure for creative marketplaces",
      dims: [{ label: "Demand", val: 8.7 }, { label: "Feasibility", val: 8.9 }, { label: "GTM", val: 7.8 }],
      bestFor: "Technical solo founders" },
    { label: "B", name: "Creative Project Marketplace", score: 7.8, type: "Marketplace",
      desc: "Curated marketplace for high-end freelance design work",
      dims: [{ label: "Demand", val: 8.1 }, { label: "Feasibility", val: 7.4 }, { label: "GTM", val: 7.9 }],
      bestFor: "Founders with design network" },
    { label: "C", name: "Studio OS", score: 7.1, type: "Vertical SaaS",
      desc: "Project and client management OS for independent creative studios",
      dims: [{ label: "Demand", val: 7.3 }, { label: "Feasibility", val: 8.2 }, { label: "GTM", val: 6.8 }],
      bestFor: "Designers going independent" },
  ],
  default: [
    { label: "A", name: "B2B SaaS Platform", score: 8.2, type: "Vertical SaaS",
      desc: "Vertical SaaS targeting SMB operators in your space",
      dims: [{ label: "Demand", val: 8.0 }, { label: "Feasibility", val: 8.5 }, { label: "GTM", val: 7.8 }],
      bestFor: "Technical founders" },
    { label: "B", name: "API-First Platform", score: 7.5, type: "API Platform",
      desc: "Developer-first infrastructure layer with usage-based pricing",
      dims: [{ label: "Demand", val: 7.4 }, { label: "Feasibility", val: 8.8 }, { label: "GTM", val: 6.9 }],
      bestFor: "Engineering-led teams" },
    { label: "C", name: "Vertical Copilot", score: 6.8, type: "AI SaaS",
      desc: "AI assistant embedded into existing workflows in your industry",
      dims: [{ label: "Demand", val: 7.0 }, { label: "Feasibility", val: 7.6 }, { label: "GTM", val: 6.5 }],
      bestFor: "Domain expert founders" },
  ],
};

const scoreColors = ["#00C9A7", "#8B5CF6", "#F59E0B"];

const PILLS = [
  "AI for student founders",
  "Freelance marketplace",
  "B2B restaurant SaaS",
];

function detectCategory(idea: string): keyof typeof PATHS {
  const l = idea.toLowerCase();
  if (/student|university|campus|education|incubator/.test(l)) return "student";
  if (/restaurant|food|hospitality|inventory|kitchen/.test(l)) return "restaurant";
  if (/freelance|designer|creative|marketplace/.test(l)) return "freelance";
  return "default";
}

function PathCard({ path, index }: { path: Path; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Path {path.label}
        </span>
        <span
          className="text-sm font-black px-2.5 py-0.5 rounded-full"
          style={{ background: scoreColors[index] + "18", color: scoreColors[index] }}
        >
          {path.score}
        </span>
      </div>
      <div className="font-bold text-ink text-sm mb-0.5">{path.name}</div>
      <div className="text-xs text-slate-400 mb-3">{path.type}</div>
      <div className="text-xs text-slate-500 mb-3 leading-relaxed">{path.desc}</div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {path.dims.map((d) => (
          <span
            key={d.label}
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500"
          >
            {d.label}: {d.val}
          </span>
        ))}
      </div>
      <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
        Best for: <span className="font-semibold text-slate-600">{path.bestFor}</span>
      </div>
    </motion.div>
  );
}

export default function PathSimulator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [results, setResults] = useState<PathSet | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    return () => clearInterval(iv);
  }, [loading]);

  const simulate = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(PATHS[detectCategory(idea)]);
      setLoading(false);
    }, 1200);
  };

  const fillPill = (text: string) => {
    setIdea(text);
    setResults(null);
    textareaRef.current?.focus();
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { type: "info", title: "Idea loaded", body: "Click Simulate to see your paths." },
      })
    );
  };

  return (
    <section className="py-24 bg-[#F8FAFC]" id="simulator">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-label mb-4">Try It Now</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-3">
            Type your idea.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              See your paths in seconds.
            </span>
          </h2>
          <p className="text-slate-500">No account needed. No credit card. Just type.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Input */}
          <div className="flex-1 flex flex-col gap-4">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={"Describe your startup idea...\ne.g. AI tool for student founders, marketplace for freelance designers, B2B SaaS for restaurant inventory..."}
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-ink outline-none placeholder-slate-400 leading-relaxed transition-all duration-200 focus:border-[#00C9A7] focus:ring-2 focus:ring-[#00C9A7]/20"
            />

            <div className="flex flex-wrap gap-2">
              {PILLS.map((p) => (
                <button
                  key={p}
                  onClick={() => fillPill(p)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#00C9A7] hover:text-[#00C9A7] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={simulate}
              disabled={loading || !idea.trim()}
              className="btn-scale w-full h-12 rounded-xl bg-[#0A0A0F] text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? `Analyzing market signals${dots}` : "Simulate Paths →"}
            </button>
          </div>

          {/* Right — Results */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!results && !loading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center"
                >
                  <p className="text-slate-400 text-sm italic text-center px-8">
                    Your venture paths will appear here.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[300px] rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-4"
                >
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Running DeepSearch analysis...</p>
                </motion.div>
              )}

              {results && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-3"
                >
                  {results.map((path, i) => (
                    <PathCard key={path.label} path={path} index={i} />
                  ))}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <p className="text-sm text-slate-500">
                      Want the full analysis with execution board?
                    </p>
                    <a
                      href="#waitlist"
                      className="btn-scale text-sm font-bold px-4 py-2 rounded-lg bg-[#00C9A7] text-[#0A0A0F] hover:bg-[#00b396] transition-colors whitespace-nowrap ml-4"
                    >
                      Get Early Access →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
