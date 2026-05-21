"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";
import type { GTMLaunchpad, Milestone } from "@/lib/openrouter";

type Session = {
  session_id: string;
  startup_idea: string;
  founder_context: {
    gtm_launchpad?: GTMLaunchpad;
    milestones?: Milestone[];
    market_summary?: string;
    recommended_first_action?: string;
  };
};

type VenturePath = {
  path_name: string;
  path_type: string;
  is_recommended: boolean;
};

function GTMContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [session, setSession] = useState<Session | null>(null);
  const [recommended, setRecommended] = useState<VenturePath | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!sessionId) { setNotFound(true); setLoading(false); return; }

    // Load task completion state from localStorage
    const saved = localStorage.getItem(`gtm_tasks_${sessionId}`);
    if (saved) setCheckedTasks(JSON.parse(saved));

    const load = async () => {
      const [{ data: sessionData }, { data: pathData }] = await Promise.all([
        supabase.from("venture_sessions").select("*").eq("session_id", sessionId).single(),
        supabase.from("venture_paths").select("*").eq("session_id", sessionId).eq("is_recommended", true).single(),
      ]);

      if (!sessionData) { setNotFound(true); setLoading(false); return; }
      setSession(sessionData);
      setRecommended(pathData ?? null);
      setLoading(false);
    };

    load();
  }, [sessionId]);

  const toggleTask = (index: number) => {
    const updated = { ...checkedTasks, [index]: !checkedTasks[index] };
    setCheckedTasks(updated);
    localStorage.setItem(`gtm_tasks_${sessionId}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="w-3 h-3 rounded-full bg-[#00C9A7]"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="text-2xl font-black text-ink">No session found</h2>
        <p className="text-slate-500">Run a simulation first to generate your GTM Launchpad.</p>
        <Link href="/#simulator" className="btn-scale bg-[#0A0A0F] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Run Simulation →
        </Link>
      </div>
    );
  }

  const gtm = session.founder_context?.gtm_launchpad;
  const milestones = session.founder_context?.milestones ?? [];
  const tasks = gtm?.first_10_tasks ?? [];
  const completedCount = tasks.filter((_, i) => checkedTasks[i]).length;

  if (!gtm) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="text-2xl font-black text-ink">GTM data not available</h2>
        <p className="text-slate-500">This session was created before GTM Launchpad was available. Run a new simulation.</p>
        <Link href="/#simulator" className="btn-scale bg-[#0A0A0F] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          New Simulation →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="section-label">GTM Launchpad</span>
          {recommended && (
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "#00C9A718", color: "#00C9A7" }}>
              {recommended.path_name} · {recommended.path_type}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-black text-ink mb-2">Your first 30 days, built.</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
          {session.founder_context?.recommended_first_action ?? session.startup_idea}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Ideal First User */}
        <div className="card p-6">
          <div className="section-label mb-3">Your First User</div>
          <p className="text-slate-700 text-sm leading-relaxed">{gtm.ideal_first_user}</p>
        </div>

        {/* Acquisition Channel */}
        <div className="card p-6">
          <div className="section-label mb-3">Acquisition Channel</div>
          <p className="text-slate-700 text-sm leading-relaxed">{gtm.acquisition_channel}</p>
        </div>

        {/* First Experiment */}
        <div className="card p-6">
          <div className="section-label mb-3">First Experiment</div>
          <p className="text-slate-700 text-sm leading-relaxed">{gtm.first_experiment}</p>
        </div>

        {/* Messaging Angle */}
        <div className="card p-6">
          <div className="section-label mb-3">Messaging Direction</div>
          <p className="text-slate-700 text-sm leading-relaxed">{gtm.messaging_angle}</p>
        </div>
      </div>

      {/* Task Checklist */}
      {tasks.length > 0 && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label">First 10 Tasks</div>
            <span className="text-sm font-bold text-[#00C9A7]">{completedCount}/{tasks.length} done</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #00C9A7, #8B5CF6)" }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <button
                key={i}
                onClick={() => toggleTask(i)}
                className="w-full flex items-start gap-3 text-left group"
              >
                <div className="mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all"
                  style={{
                    borderColor: checkedTasks[i] ? "#00C9A7" : "#CBD5E1",
                    background: checkedTasks[i] ? "#00C9A7" : "white",
                  }}>
                  {checkedTasks[i] && (
                    <svg width="10" height="8" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed"
                  style={{ textDecoration: checkedTasks[i] ? "line-through" : "none", opacity: checkedTasks[i] ? 0.5 : 1 }}>
                  {task}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="mb-8">
          <div className="section-label mb-4">Execution Milestones</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Week {milestones.slice(0, i).reduce((s, x) => s + x.duration_weeks, 0) + 1}–{milestones.slice(0, i + 1).reduce((s, x) => s + x.duration_weeks, 0)}</span>
                  <span className="text-xs font-semibold text-[#8B5CF6]">{m.duration_weeks}w</span>
                </div>
                <div className="font-bold text-ink text-sm mb-1">{m.name}</div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{m.description}</p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-600">Success: </span>{m.success_metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-4 flex-wrap">
        <Link
          href={`/venture-twin?session=${sessionId}`}
          className="btn-scale flex-1 py-3.5 rounded-xl bg-[#0A0A0F] text-white text-sm font-bold text-center hover:bg-slate-800 transition-colors"
        >
          View Venture Twin →
        </Link>
        <Link
          href={`/pivot-simulator?session=${sessionId}`}
          className="btn-scale flex-1 py-3.5 rounded-xl border-2 border-[#00C9A7] text-[#00C9A7] text-sm font-bold text-center hover:bg-[#00C9A7] hover:text-white transition-colors"
        >
          Run Pivot Simulation →
        </Link>
      </div>
    </div>
  );
}

export default function GTMLaunchpadPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <div className="pt-16">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#00C9A7] pulse-dot" />
          </div>
        }>
          <GTMContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
