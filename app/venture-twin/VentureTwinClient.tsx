"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";

type Assumption = {
  id: string;
  assumption_text: string;
  health_score: number;
  status: "stable" | "watch" | "at_risk" | "breached";
  last_checked_at: string;
  alert_message: string | null;
};

type VenturePath = {
  id: string;
  path_label: string;
  path_name: string;
  path_type: string;
  total_score: number;
  is_recommended: boolean;
  scores: Record<string, number>;
};

type Session = {
  session_id: string;
  startup_idea: string;
  status: string;
  created_at: string;
};

const statusColor: Record<string, string> = {
  stable: "#00C9A7",
  watch: "#F59E0B",
  at_risk: "#F97316",
  breached: "#EF4444",
};

function HealthBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(score / 10) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function VentureTwinContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [session, setSession] = useState<Session | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [paths, setPaths] = useState<VenturePath[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!sessionId) { setNotFound(true); setLoading(false); return; }

    const load = async () => {
      const [{ data: sessionData }, { data: assumptionData }, { data: pathData }] = await Promise.all([
        supabase.from("venture_sessions").select("*").eq("session_id", sessionId).single(),
        supabase.from("assumptions").select("*").eq("session_id", sessionId).order("created_at"),
        supabase.from("venture_paths").select("*").eq("session_id", sessionId).order("total_score", { ascending: false }),
      ]);

      if (!sessionData) { setNotFound(true); setLoading(false); return; }

      setSession(sessionData);
      setAssumptions(assumptionData ?? []);
      setPaths(pathData ?? []);
      setLoading(false);
    };

    load();

    // Real-time subscription for assumption updates
    const channel = supabase
      .channel(`assumptions_${sessionId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "assumptions", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setAssumptions((prev) => prev.map((a) => (a.id === payload.new.id ? (payload.new as Assumption) : a)));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

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
        <h2 className="text-2xl font-black text-ink">Session not found</h2>
        <p className="text-slate-500">Run a simulation first to generate your Venture Twin.</p>
        <Link href="/#simulator" className="btn-scale bg-[#0A0A0F] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Run Simulation →
        </Link>
      </div>
    );
  }

  const alertCount = assumptions.filter((a) => a.status === "at_risk" || a.status === "breached").length;
  const recommended = paths.find((p) => p.is_recommended);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#00C9A7] pulse-dot" />
            <h1 className="text-2xl font-black text-ink">Venture Twin: Active</h1>
          </div>
          <p className="text-slate-400 text-sm font-mono">{session.session_id}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full`}
          style={{ background: "#00C9A718", color: "#00C9A7" }}>
          {alertCount > 0 ? `${alertCount} alert${alertCount > 1 ? "s" : ""} active` : "All stable"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Session info */}
        <div className="card p-6 self-start">
          <div className="section-label mb-4">Session</div>
          <div className="text-sm text-slate-600 leading-relaxed mb-4">{session.startup_idea}</div>
          {recommended && (
            <div className="p-3 rounded-xl mb-4" style={{ background: "#00C9A710" }}>
              <div className="text-xs font-semibold text-[#00C9A7] mb-1">Recommended Path</div>
              <div className="font-bold text-ink text-sm">{recommended.path_name}</div>
              <div className="text-xs text-slate-500">{recommended.path_type} · {recommended.total_score}/10</div>
            </div>
          )}
          <div className="text-xs text-slate-400">
            Created {new Date(session.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Center: Live assumptions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="section-label">Live Assumptions</div>
          {assumptions.map((a) => {
            const color = statusColor[a.status] ?? "#00C9A7";
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5"
                style={a.status !== "stable" ? { borderLeft: `4px solid ${color}` } : {}}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-sm text-slate-700 flex-1 leading-relaxed">{a.assumption_text}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold" style={{ color }}>{a.health_score}/10</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: color + "18", color }}>
                      {a.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <HealthBar score={a.health_score} color={color} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    Checked {new Date(a.last_checked_at).toLocaleTimeString()}
                  </span>
                </div>
                {a.alert_message && (
                  <div className="mt-3 text-xs rounded-lg px-3 py-2 leading-relaxed"
                    style={{ background: color + "12", color: color }}>
                    {a.alert_message}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Paths summary */}
      {paths.length > 0 && (
        <div className="mt-10">
          <div className="section-label mb-4">Path Scores</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paths.map((p) => (
              <div key={p.id} className="card p-5"
                style={p.is_recommended ? { borderColor: "#00C9A7", boxShadow: "0 0 0 2px #00C9A730" } : {}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Path {p.path_label}</span>
                  <span className="text-lg font-black" style={{ color: p.is_recommended ? "#00C9A7" : "#94A3B8" }}>
                    {p.total_score}
                  </span>
                </div>
                <div className="font-bold text-ink text-sm mb-1">{p.path_name}</div>
                <div className="text-xs text-slate-400">{p.path_type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VentureTwinClient() {
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
          <VentureTwinContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
