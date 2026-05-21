"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Assumption = {
  id: string;
  assumption_text: string;
  health_score: number;
  status: "stable" | "watch" | "at_risk" | "breached";
  last_checked_at: string;
  alert_message: string | null;
  updated_at: string;
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
  updated_at: string;
};

type ActivityEvent = {
  id: string;
  created_at: string;
  event_type: string;
  properties: Record<string, unknown>;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  stable: "#00C9A7",
  watch: "#F59E0B",
  at_risk: "#F97316",
  breached: "#EF4444",
};

const eventLabel: Record<string, string> = {
  simulation_complete: "Simulation completed",
  assumption_status_changed: "Assumption health updated",
  pivot_simulation_run: "Pivot simulation run",
  gtm_action_taken: "GTM action recorded",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

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

function NextScanCountdown() {
  const [minsLeft, setMinsLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const next = new Date(now);
      const mins = now.getMinutes();
      const nextBoundary = mins < 30 ? 30 : 60;
      next.setMinutes(nextBoundary, 0, 0);
      if (nextBoundary === 60) next.setHours(next.getHours() + 1, 0, 0, 0);
      setMinsLeft(Math.max(0, Math.floor((next.getTime() - now.getTime()) / 60000)));
    };
    calc();
    const t = setInterval(calc, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="text-xs text-slate-400">
      Next auto-scan in <span className="font-semibold text-slate-600">{minsLeft}m</span>
    </span>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function VentureTwinContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [session, setSession] = useState<Session | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [paths, setPaths] = useState<VenturePath[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    if (!sessionId) return;

    const [{ data: sessionData }, { data: assumptionData }, { data: pathData }, { data: eventData }] =
      await Promise.all([
        supabase.from("venture_sessions").select("*").eq("session_id", sessionId).single(),
        supabase.from("assumptions").select("*").eq("session_id", sessionId).order("created_at"),
        supabase.from("venture_paths").select("*").eq("session_id", sessionId).order("total_score", { ascending: false }),
        supabase.from("analytics_events").select("*").eq("session_id", sessionId).order("created_at", { ascending: false }).limit(10),
      ]);

    if (!sessionData) { setNotFound(true); setLoading(false); return; }

    setSession(sessionData);
    setAssumptions(assumptionData ?? []);
    setPaths(pathData ?? []);
    setActivity(eventData ?? []);
    setLastUpdated(new Date());
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) { setNotFound(true); setLoading(false); return; }
    loadData();

    // Real-time: assumptions update live
    const assumptionChannel = supabase
      .channel(`assumptions_${sessionId}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "assumptions", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setAssumptions((prev) =>
            prev.map((a) => (a.id === payload.new.id ? (payload.new as Assumption) : a))
          );
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    // Real-time: new analytics events
    const eventChannel = supabase
      .channel(`events_${sessionId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "analytics_events", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setActivity((prev) => [payload.new as ActivityEvent, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(assumptionChannel);
      supabase.removeChannel(eventChannel);
    };
  }, [sessionId, loadData]);

  const handleRefresh = async () => {
    if (!sessionId || refreshing) return;
    setRefreshing(true);
    try {
      await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      // Real-time subscription will pick up changes automatically
      // but reload activity log manually
      const { data: eventData } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(10);
      setActivity(eventData ?? []);
      setLastUpdated(new Date());
    } catch {}
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="w-3 h-3 rounded-full bg-[#00C9A7]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
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
        <Link href="/#simulator"
          className="btn-scale bg-[#0A0A0F] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Run Simulation →
        </Link>
      </div>
    );
  }

  const alertCount = assumptions.filter((a) => a.status === "at_risk" || a.status === "breached").length;
  const recommended = paths.find((p) => p.is_recommended);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#00C9A7] pulse-dot" />
            <h1 className="text-2xl font-black text-ink">Venture Twin: Active</h1>
          </div>
          <p className="text-slate-400 text-sm font-mono mb-1">{session.session_id}</p>
          <div className="flex items-center gap-4 flex-wrap">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Last updated <span className="font-semibold text-slate-600">{lastUpdated.toLocaleTimeString()}</span>
              </span>
            )}
            <NextScanCountdown />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{
              background: alertCount > 0 ? "#EF444418" : "#00C9A718",
              color: alertCount > 0 ? "#EF4444" : "#00C9A7",
            }}>
            {alertCount > 0 ? `${alertCount} alert${alertCount > 1 ? "s" : ""} active` : "All stable"}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-scale flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#00C9A7] hover:text-[#00C9A7] transition-colors disabled:opacity-40"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={refreshing ? "animate-spin" : ""}>
              <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10.5 1.5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {refreshing ? "Scanning..." : "Refresh Assumptions"}
          </button>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Session info + nav links */}
        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <div className="section-label mb-4">Session</div>
            <div className="text-sm text-slate-600 leading-relaxed mb-4">{session.startup_idea}</div>
            {recommended && (
              <div className="p-3 rounded-xl mb-4" style={{ background: "#00C9A710" }}>
                <div className="text-xs font-semibold text-[#00C9A7] mb-1">Recommended Path</div>
                <div className="font-bold text-ink text-sm">{recommended.path_name}</div>
                <div className="text-xs text-slate-500">{recommended.path_type} · {recommended.total_score}/10</div>
              </div>
            )}
            <div className="text-xs text-slate-400 mb-4">
              Created {new Date(session.created_at).toLocaleDateString()}
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <Link href={`/gtm-launchpad?session=${sessionId}`}
                className="text-xs font-semibold text-[#00C9A7] hover:underline">
                GTM Launchpad →
              </Link>
              <Link href={`/pivot-simulator?session=${sessionId}`}
                className="text-xs font-semibold text-[#8B5CF6] hover:underline">
                Pivot Simulator →
              </Link>
            </div>
          </div>

          {/* Path scores */}
          {paths.length > 0 && (
            <div className="card p-5">
              <div className="section-label mb-3">Path Scores</div>
              <div className="flex flex-col gap-3">
                {paths.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-ink">{p.path_name}</div>
                      <div className="text-[11px] text-slate-400">{p.path_type}</div>
                    </div>
                    <span className="text-sm font-black"
                      style={{ color: p.is_recommended ? "#00C9A7" : "#94A3B8" }}>
                      {p.total_score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center + Right: Live assumptions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="section-label">Live Assumptions</div>
            <span className="text-xs text-slate-400">{assumptions.length} monitored</span>
          </div>

          <AnimatePresence>
            {assumptions.map((a) => {
              const color = statusColor[a.status] ?? "#00C9A7";
              return (
                <motion.div
                  key={a.id}
                  layout
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
                      style={{ background: color + "12", color }}>
                      {a.alert_message}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Activity Log ── */}
      {activity.length > 0 && (
        <div className="mt-10">
          <div className="section-label mb-4">Activity Log</div>
          <div className="card divide-y divide-slate-100">
            {activity.map((e) => {
              const props = e.properties ?? {};
              let detail = "";

              if (e.event_type === "simulation_complete") {
                detail = props.recommended_path
                  ? `${props.recommended_path} recommended (${props.top_score}/10)`
                  : "";
              } else if (e.event_type === "assumption_status_changed") {
                detail = props.assumption_text
                  ? `"${String(props.assumption_text).slice(0, 50)}..." → ${props.new_status}`
                  : `Status changed to ${props.new_status}`;
              } else if (e.event_type === "pivot_simulation_run") {
                detail = `${props.recommendation} · impact: ${props.impact_severity}`;
              }

              return (
                <div key={e.id} className="flex items-start gap-3 px-5 py-3">
                  <span className="text-[10px] text-slate-400 font-mono pt-0.5 shrink-0 w-16">
                    {new Date(e.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-700">
                      {eventLabel[e.event_type] ?? e.event_type.replace(/_/g, " ")}
                    </span>
                    {detail && (
                      <span className="text-xs text-slate-400 ml-2">— {detail}</span>
                    )}
                  </div>
                </div>
              );
            })}
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
