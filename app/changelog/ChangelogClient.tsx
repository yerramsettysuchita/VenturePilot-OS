"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";

const entries = [
  {
    date: "May 2025",
    badge: "NEW",
    badgeColor: "#00C9A7",
    title: "Adaptive Venture Twin — Now in Early Access",
    body: `The feature we've been building toward since day one is now live for early access users. The Adaptive Venture Twin monitors your startup's core assumptions in real time, watches market signals, and recomputes your path rankings when conditions shift. No more static plans in a dynamic market.

What shipped:`,
    bullets: [
      "Assumption Health Score engine",
      "Real-time signal monitoring (DeepSearch-powered)",
      "Automated pivot alert system",
      "Execution board auto-update on assumption breach",
      "Decision memory linked to every assumption",
    ],
    closing: "This is not a notification system. It is a reasoning system that happens to notify you.",
    tags: ["Venture Twin", "Core Feature", "DeepSearch"],
  },
  {
    date: "April 2025",
    badge: "IMPROVED",
    badgeColor: "#8B5CF6",
    title: "Path Scoring Engine — Version 2.0",
    body: `We rewrote the scoring engine from the ground up. Version 1 used a simple weighted average across 5 dimensions. Version 2 uses a 7-dimension model with dynamic weight adjustment based on founder context.

What changed:`,
    bullets: [
      "Added Founder Fit and GTM Clarity as first-class scoring dimensions",
      "Weights now adjust based on your stage, team size, and runway",
      "Score breakdown now shows which signals drove each dimension",
      "Added 'What would flip this decision' explainability panel",
      "Path comparison view now shows delta between paths, not just scores",
    ],
    closing: "The result: recommendations that are specific to who you are, not just what your idea is.",
    tags: ["Scoring Engine", "Explainability", "Core Feature"],
  },
  {
    date: "March 2025",
    badge: "LAUNCH",
    badgeColor: "#F59E0B",
    title: "VenturePilot OS — First Commit",
    body: `We shipped the first working version of VenturePilot OS to 12 founders in our beta cohort. The core loop — founder intake, DeepSearch research, path simulation, scoring, and Project HUB board generation — was end to end for the first time.

What was in v0.1:`,
    bullets: [
      "Founder context intake form",
      "DeepSearch integration for market and competitor research",
      "3-path venture simulation engine",
      "Basic 5-dimension scoring",
      "Project HUB board generation via API",
      "Manual assumption tracking (v1)",
    ],
    closing: "What we learned from the first 12: Every single founder asked the same question after seeing their paths: 'What happens when things change?' That question became the Adaptive Venture Twin.",
    tags: ["Launch", "Beta", "Core Loop"],
  },
];

function Entry({ entry, index }: { entry: typeof entries[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative flex gap-8">
      {/* Timeline line + dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-3 h-3 rounded-full shrink-0 mt-8 z-10"
          style={{ background: entry.badgeColor }}
        />
        {index < entries.length - 1 && (
          <div className="w-px flex-1 bg-slate-200 mt-1" />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="card p-8 mb-10 flex-1 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">{entry.date}</div>
            <h3 className="text-xl font-black text-ink leading-tight">{entry.title}</h3>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
            style={{ background: entry.badgeColor + "18", color: entry.badgeColor }}
          >
            {entry.badge}
          </span>
        </div>

        <div className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
          {entry.body}
        </div>
        <ul className="space-y-2 mb-5">
          {entry.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
              <span style={{ color: entry.badgeColor }} className="mt-0.5 shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-500 italic mb-6 leading-relaxed">{entry.closing}</p>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function ChangelogClient() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="pt-32 pb-16 bg-white px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="section-label mb-4">Changelog</div>
          <h1 className="text-5xl font-black text-ink mb-4">Changelog</h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Every update, every improvement, every decision we ship. We build in public.
          </p>
        </motion.div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 pb-20">
        {entries.map((entry, i) => (
          <Entry key={entry.title} entry={entry} index={i} />
        ))}

        <div className="text-center pt-8">
          <p className="text-slate-500 text-sm mb-4">
            More updates coming as we ship. Follow our journey.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="#" className="text-sm font-semibold text-slate-500 hover:text-ink transition-colors">
              Twitter / X →
            </Link>
            <Link href="#" className="text-sm font-semibold text-slate-500 hover:text-ink transition-colors">
              LinkedIn →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
