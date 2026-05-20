"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const useCases = [
  {
    id: "solo",
    color: "#00C9A7",
    bg: "#F0FFFE",
    eyebrow: "Solo Founders",
    heading: "Stop deciding alone.",
    body: "You're one person making ten irreversible decisions a week. VenturePilot OS is the strategic partner you can't afford to hire. One that shows its work, remembers every decision, and tells you when to pivot before you've wasted a sprint.",
    outcomes: [
      "First validated execution plan in one afternoon",
      "Path scoring that replaces months of instinct",
      "Venture Twin that watches the market so you don't have to",
    ],
    statLabel: "Solo founders on waitlist",
    statVal: "60%",
  },
  {
    id: "teams",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    eyebrow: "Startup Teams",
    heading: "Same intelligence. Every team member.",
    body: "Teams break down when strategy lives in one person's head. VenturePilot OS gives every team member access to the same evidence, the same reasoning, and the same execution plan, updated in real time as the market moves.",
    outcomes: [
      "Shared DeepSearch intelligence across the team",
      "Decision memory that preserves strategic context",
      "Project HUB board that everyone works from",
    ],
    statLabel: "Avg team size using the platform",
    statVal: "4",
  },
  {
    id: "studios",
    color: "#F59E0B",
    bg: "#FFFBEB",
    eyebrow: "Venture Studios",
    heading: "One intelligence layer. Six builds.",
    body: "Running multiple startups in parallel means context-switching constantly and losing institutional knowledge at every handoff. VenturePilot OS gives studios a single platform to monitor assumptions, compare venture paths, and manage execution across their entire portfolio.",
    outcomes: [
      "Multi-startup dashboard with portfolio view",
      "Assumption Health monitoring across all builds",
      "Pivot Simulator to model decisions before making them",
    ],
    statLabel: "Active builds per studio account",
    statVal: "6+",
  },
  {
    id: "accelerators",
    color: "#F97316",
    bg: "#FFF4EE",
    eyebrow: "Accelerators",
    heading: "Give every cohort company a senior strategist.",
    body: "Your mentors have 10 minutes per company. VenturePilot OS gives every team in your cohort continuous strategic support: live market intelligence, path scoring, and adaptive execution planning, without consuming mentor bandwidth.",
    outcomes: [
      "Cohort-wide intelligence layer",
      "Standardized path scoring for demo day readiness",
      "Execution boards linked to program milestones",
    ],
    statLabel: "Mentor hours saved per cohort",
    statVal: "40+",
  },
];

function UseCase({ uc, index }: { uc: typeof useCases[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const flip = index % 2 === 1;

  return (
    <section id={uc.id} className="py-20" style={{ background: index % 2 === 0 ? "#fff" : "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} gap-16 items-center`}>
          <motion.div
            ref={ref}
            className="flex-1"
            initial={{ opacity: 0, x: flip ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: uc.color }}
            >
              {uc.eyebrow}
            </div>
            <h2 className="text-4xl font-black text-ink leading-tight mb-5">
              {uc.heading}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">{uc.body}</p>

            <div className="flex flex-col gap-3 mb-8">
              {uc.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: uc.color + "20" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke={uc.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">{o}</span>
                </div>
              ))}
            </div>

            <Link
              href="/#waitlist"
              className="btn-scale inline-block bg-[#0A0A0F] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Get Early Access
            </Link>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: flip ? -40 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-8 text-center"
              style={{ background: uc.bg }}
            >
              <div
                className="text-7xl font-black mb-2"
                style={{ color: uc.color }}
              >
                {uc.statVal}
              </div>
              <div className="text-slate-500 text-sm font-medium">{uc.statLabel}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function UseCasesClient() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="pt-32 pb-16 bg-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="section-label mb-4">Use Cases</div>
          <h1 className="text-5xl md:text-6xl font-black text-ink leading-tight mb-6">
            Built for every stage{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              of building.
            </span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            From solo founders validating a first idea to venture studios running
            six builds in parallel. VenturePilot OS adapts to your context.
          </p>
        </motion.div>
      </section>

      {useCases.map((uc, i) => (
        <UseCase key={uc.id} uc={uc} index={i} />
      ))}

      <section className="py-20 bg-[#F8FAFC] text-center px-6">
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
