"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const scoreDimensions = [
  { dim: "Market Demand",   val: 8.4, color: "#00C9A7" },
  { dim: "Competition",     val: 7.2, color: "#8B5CF6" },
  { dim: "Differentiation", val: 8.1, color: "#00C9A7" },
  { dim: "Feasibility",     val: 9.0, color: "#F59E0B" },
  { dim: "GTM Clarity",     val: 7.5, color: "#8B5CF6" },
  { dim: "Revenue Speed",   val: 6.9, color: "#F97316" },
  { dim: "Founder Fit",     val: 8.8, color: "#00C9A7" },
];

function ScoreCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="card p-6 w-full">
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="font-bold text-ink text-base">Path A: B2B SaaS</div>
          <div className="text-xs text-[#00C9A7] font-semibold mt-0.5">Recommended Path</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-[#00C9A7]">8.7</div>
          <div className="text-xs text-slate-400">/ 10</div>
        </div>
      </div>
      <div className="h-px bg-slate-100 my-4" />
      {scoreDimensions.map((d, i) => (
        <div key={d.dim} className="mb-3 last:mb-0">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">{d.dim}</span>
            <span className="font-bold" style={{ color: d.color }}>{d.val}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${(d.val / 10) * 100}%` } : { width: 0 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
      <div className="h-px bg-slate-100 my-4" />
      <div className="text-xs font-bold text-ink mb-2">Why this path wins:</div>
      <div className="space-y-1.5 mb-4">
        {[
          "High demand signal in target segment",
          "Competition is fragmented with no clear leader",
          "Founder profile matches B2B GTM motion",
        ].map((t) => (
          <div key={t} className="flex items-start gap-2 text-xs text-slate-500">
            <span className="text-[#00C9A7] mt-0.5 shrink-0">✓</span>
            {t}
          </div>
        ))}
      </div>
      <div className="text-xs font-bold text-ink mb-2">Why Path B lost:</div>
      <div className="space-y-1.5">
        {[
          "GTM complexity exceeds 3-month runway",
          "API monetization requires a larger team",
        ].map((t) => (
          <div key={t} className="flex items-start gap-2 text-xs text-slate-400">
            <span className="text-slate-300 mt-0.5 shrink-0">✕</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

const steps = [
  {
    num: "01",
    label: "Understand",
    heading: "Tell us who you are, not just what you're building.",
    body: "Before any intelligence is gathered, VenturePilot OS needs to know your constraints: runway, team size, risk appetite, geography. The same idea in the hands of a solo non-technical founder and a funded team are two completely different products. Your context is the filter everything else runs through.",
    mockup: (
      <div className="card p-6 w-full">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Founder Context</div>
        {[
          { label: "Startup Idea", val: "AI tool for student founders" },
          { label: "Stage", val: "Idea Stage" },
          { label: "Team Size", val: "Solo" },
          { label: "Risk Appetite", val: "Medium" },
          { label: "Geography", val: "India / SE Asia" },
        ].map((f) => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-400">{f.label}</span>
            <span className="text-xs font-semibold text-ink bg-slate-50 px-2.5 py-1 rounded-md">{f.val}</span>
          </div>
        ))}
      </div>
    ),
    color: "#00C9A7",
    flip: false,
  },
  {
    num: "02",
    label: "Research",
    heading: "Live intelligence. Not a cached report.",
    body: "DeepSearch interrogates the market with specific questions: competitor weaknesses, pricing gaps, timing signals, customer pain evidence. It returns structured intelligence objects your reasoning engine can actually use. Not a wall of text. A map of the opportunity.",
    mockup: (
      <div className="card p-6 w-full">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Market Intelligence</div>
        {[
          { label: "Demand", val: "High (8.4/10)", color: "#00C9A7" },
          { label: "Competition", val: "Fragmented", color: "#8B5CF6" },
          { label: "Pricing Gap", val: "$200-400/mo uncaptured", color: "#F59E0B" },
          { label: "Timing", val: "Early majority window open", color: "#00C9A7" },
        ].map((s) => (
          <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-500">{s.label}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: s.color + "18", color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
    ),
    color: "#8B5CF6",
    flip: true,
  },
  {
    num: "03",
    label: "Simulate",
    heading: "Three roads. You only have to build one.",
    body: "One founding intent can become multiple viable businesses. VenturePilot OS generates three genuinely different venture paths with different business models, different target segments, and different GTM motions. Not variations. Alternatives.",
    mockup: (
      <div className="flex flex-col gap-3 w-full">
        {[
          { path: "Path A", name: "B2B SaaS", score: 8.7, color: "#00C9A7", winner: true },
          { path: "Path B", name: "API Platform", score: 7.2, color: "#8B5CF6", winner: false },
          { path: "Path C", name: "Vertical Copilot", score: 6.8, color: "#F59E0B", winner: false },
        ].map((p) => (
          <div
            key={p.path}
            className={`card p-4 flex items-center justify-between ${p.winner ? "ring-2 ring-[#00C9A7]" : ""}`}
          >
            <div>
              <div className="text-xs text-slate-400 mb-0.5">{p.path}</div>
              <div className="font-bold text-ink text-sm">{p.name}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black" style={{ color: p.color }}>{p.score}</div>
              <div className="text-xs text-slate-400">score</div>
            </div>
          </div>
        ))}
      </div>
    ),
    color: "#00C9A7",
    flip: false,
  },
  {
    num: "04",
    label: "Score",
    heading: "Every score has a reason. Every reason has evidence.",
    body: "Seven dimensions. Visible weights. A formula you can read and disagree with. The scoring engine shows exactly why one path wins and what would flip the decision. That transparency is what converts a tool into a trusted advisor.",
    mockup: <ScoreCard />,
    color: "#F59E0B",
    flip: true,
  },
  {
    num: "05",
    label: "Execute",
    heading: "The board builds itself.",
    body: "The winning path doesn't sit in a report. It becomes a real Project HUB board with milestones, sprints, tasks and dependencies, created via API. The research that drove the decision is linked to the execution it produced. Strategy and execution are finally in the same room.",
    mockup: (
      <div className="card p-6 w-full">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Project HUB Board</div>
        {[
          { sprint: "Sprint 1", name: "Validate", tasks: 4, color: "#00C9A7" },
          { sprint: "Sprint 2", name: "Build MVP", tasks: 5, color: "#8B5CF6" },
          { sprint: "Sprint 3", name: "Launch", tasks: 3, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.sprint} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: s.color + "18", color: s.color }}
            >
              {s.sprint.replace("Sprint ", "S")}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink">{s.name}</div>
            </div>
            <div className="text-xs text-slate-400">{s.tasks} tasks</div>
          </div>
        ))}
      </div>
    ),
    color: "#8B5CF6",
    flip: false,
  },
  {
    num: "06",
    label: "Adapt",
    heading: "The plan stays alive. So does the strategy.",
    body: "The Adaptive Venture Twin begins monitoring the assumptions your chosen path was built on. When a competitor moves, when demand shifts, when your timeline changes, the Twin doesn't just notify you. It recomputes. Your execution board updates to reflect the new reality before you even feel the change.",
    mockup: (
      <div className="card p-6 w-full">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Venture Twin: Live</div>
        {[
          { assumption: "Enterprise buyers pay $500/mo", health: 8.2, status: "Stable", color: "#00C9A7", icon: "✓" },
          { assumption: "Competitor won't go downmarket", health: 5.1, status: "At Risk", color: "#F97316", icon: "⚠" },
          { assumption: "Regulation stays as is", health: 7.8, status: "Stable", color: "#00C9A7", icon: "✓" },
        ].map((a) => (
          <div key={a.assumption} className="py-3 border-b border-slate-100 last:border-0">
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-xs text-slate-600 flex-1 mr-3">{a.assumption}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: a.color + "18", color: a.color }}
              >
                {a.icon} {a.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(a.health / 10) * 100}%`, background: a.color }} />
              </div>
              <span className="text-xs font-bold text-slate-500">{a.health}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    color: "#F97316",
    flip: true,
  },
];

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`flex flex-col ${step.flip ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center py-20`}>
      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0, x: step.flip ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div
          className="absolute -top-6 left-0 text-8xl font-black leading-none select-none pointer-events-none"
          style={{ color: step.color + "12" }}
        >
          {step.num}
        </div>
        <div
          className="text-xs font-bold tracking-widest uppercase mb-3 mt-4"
          style={{ color: step.color }}
        >
          Step {step.num}: {step.label}
        </div>
        <h3 className="text-3xl font-black text-ink leading-tight mb-4">
          {step.heading}
        </h3>
        <p className="text-slate-500 leading-relaxed">{step.body}</p>
      </motion.div>

      <motion.div
        className="flex-1 w-full"
        initial={{ opacity: 0, x: step.flip ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {step.mockup}
      </motion.div>
    </div>
  );
}

export default function HowItWorksClient() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="section-label mb-4">How It Works</div>
          <h1 className="text-5xl md:text-6xl font-black text-ink leading-tight mb-6">
            From idea to execution board.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              In one intelligent loop.
            </span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            VenturePilot OS doesn&apos;t hand you a report. It makes a decision, builds a plan,
            and watches your back while you execute.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-6">
        {steps.map((step, i) => (
          <div key={step.num}>
            <Step step={step} index={i} />
            {i < steps.length - 1 && (
              <div className="section-divider" />
            )}
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#F8FAFC] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-black text-ink mb-4">
            Ready to run your first venture loop?
          </h2>
          <p className="text-slate-500 mb-8">
            Join 400+ founders already on the waitlist.
          </p>
          <Link
            href="/#waitlist"
            className="btn-scale inline-block bg-[#0A0A0F] text-white text-sm font-bold px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Get Early Access
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
