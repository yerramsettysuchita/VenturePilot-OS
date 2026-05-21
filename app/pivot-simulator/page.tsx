"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";

type VenturePath = {
  path_label: string;
  path_name: string;
  path_type: string;
  total_score: number;
  is_recommended: boolean;
  scores: Record<string, number>;
};

type Assumption = {
  id: string;
  assumption_text: string;
  health_score: number;
  status: string;
};

type PivotResult = {
  impact_severity: "low" | "medium" | "high" | "critical";
  recommendation: "stay" | "adjust_gtm" | "pivot_partial" | "pivot_full";
  reasoning: string;
  new_total_score: number;
  affected_assumptions: string[];
  pivot_actions: string[];
  updated_assumptions: { assumption_text: string; health_score: number; status: string; alert_message?: string }[];
};

const severityColors: Record<string, string> = {
  low: "#00C9A7",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

const recommendationLabels: Record<string, string> = {
  stay: "Stay Course",
  adjust_gtm: "Adjust GTM",
  pivot_partial: "Partial Pivot",
  pivot_full: "Full Pivot",
};

const statusColor: Record<string, string> = {
  stable: "#00C9A7",
  watch: "#F59E0B",
  at_risk: "#F97316",
  breached: "#EF4444",
};

function PivotContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [recommended, setRecommended] = useState<VenturePath | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [marketChange, setMarketChange] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PivotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }

    const load = async () => {
      const [{ data: pathData }, { data: assumptionData }] = await Promise.all([
        supabase.from("venture_paths").select("*").eq("session_id", sessionId).eq("is_recommended", true).single(),
        supabase.from("assumptions").select("*").eq("session_id", sessionId),
      ]);
      setRecommended(pathData ?? null);
      setAssumptions(assumptionData ?? []);
      setLoading(false);
    };

    load();
  }, [sessionId]);

  const runSimulation = async () => {
    if (marketChange.trim().length < 20) {
      setError("Please describe the market change in more detail.");
      return;
    }
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/pivot-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          market_change: marketChange,
          current_path: recommended,
          assumptions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Simulation failed");

      setResult(data);

      // Update local assumption state with new scores
      if (data.updated_assumptions) {
        setAssumptions((prev) =>
          prev.map((a) => {
            const updated = data.updated_assumptions.find(
              (u: { assumption_text: string }) => u.assumption_text === a.assumption_text
            );
            return updated ? { ...a, health_score: updated.health_score, status: updated.status } : a;
          })
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed. Please try again.");
    } finally {
      setRunning(false);
    }
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="section-label mb-2">Pivot Simulator</div>
        <h1 className="text-3xl font-black text-ink mb-2">Model the pivot before you make it.</h1>
        <p className="text-slate-500 text-sm">Describe what changed in the market. AI analyzes the impact on your current path and tells you whether to stay, adjust, or pivot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Current State */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="section-label mb-3">Current Path</div>
            {recommended ? (
              <>
                <div className="font-bold text-ink mb-1">{recommended.path_name}</div>
                <div className="text-xs text-slate-400 mb-3">{recommended.path_type}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Current Score</span>
                  <span className="text-xl font-black" style={{ color: "#00C9A7" }}>{recommended.total_score}/10</span>
                </div>
                {result && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">After Change</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black" style={{ color: result.new_total_score >= recommended.total_score ? "#00C9A7" : "#EF4444" }}>
                        {result.new_total_score}/10
                      </span>
                      <span className="text-xs font-bold" style={{ color: result.new_total_score >= recommended.total_score ? "#00C9A7" : "#EF4444" }}>
                        {result.new_total_score >= recommended.total_score ? "+" : ""}{(result.new_total_score - recommended.total_score).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">
                No session loaded.{" "}
                <Link href="/#simulator" className="text-[#00C9A7] font-semibold">Run a simulation first →</Link>
              </p>
            )}
          </div>

          {/* Assumptions */}
          {assumptions.length > 0 && (
            <div className="card p-5">
              <div className="section-label mb-3">Assumptions</div>
              <div className="space-y-3">
                {assumptions.map((a, i) => {
                  const color = statusColor[a.status] ?? "#00C9A7";
                  return (
                    <div key={i} className="text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold" style={{ color }}>{a.health_score}/10</span>
                        <span className="capitalize px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: color + "18", color }}>{a.status.replace("_", " ")}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed">{a.assumption_text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center — Input */}
        <div className="flex flex-col gap-4">
          <div className="card p-5 flex-1 flex flex-col">
            <div className="section-label mb-3">Market Change</div>
            <textarea
              value={marketChange}
              onChange={(e) => setMarketChange(e.target.value)}
              rows={8}
              placeholder={"Describe what changed...\n\ne.g. A competitor just raised $20M Series A and announced they're going downmarket into our exact segment.\n\nOr: A new regulation was just announced that restricts our primary distribution channel."}
              className="flex-1 w-full resize-none text-sm text-ink placeholder-slate-400 outline-none leading-relaxed"
            />
            {error && (
              <p className="text-xs text-[#F97316] mt-2">{error}</p>
            )}
            <button
              onClick={runSimulation}
              disabled={running || marketChange.trim().length < 20}
              className="btn-scale w-full mt-4 py-3.5 rounded-xl bg-[#0A0A0F] text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              {running ? "Simulating..." : "Run Pivot Simulation →"}
            </button>
          </div>

          {!sessionId && (
            <p className="text-xs text-slate-400 text-center">
              No session in URL. Results won&apos;t be saved.{" "}
              <Link href="/#simulator" className="text-[#00C9A7]">Run a simulation first →</Link>
            </p>
          )}
        </div>

        {/* Right — Results */}
        <div>
          <AnimatePresence mode="wait">
            {running && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="card p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]"
                      animate={{ y: [0, -10, 0] }} transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
                  ))}
                </div>
                <p className="text-sm text-slate-500">Analyzing market impact...</p>
              </motion.div>
            )}

            {!running && !result && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="card p-6 min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic text-center px-4">
                  Simulation results will appear here.
                </p>
              </motion.div>
            )}

            {!running && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4">

                {/* Impact + Recommendation */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
                      style={{ background: severityColors[result.impact_severity] + "18", color: severityColors[result.impact_severity] }}>
                      {result.impact_severity} impact
                    </span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "#8B5CF618", color: "#8B5CF6" }}>
                      {recommendationLabels[result.recommendation]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{result.reasoning}</p>
                </div>

                {/* Actions */}
                {result.pivot_actions?.length > 0 && (
                  <div className="card p-5">
                    <div className="section-label mb-3">Recommended Actions</div>
                    <div className="space-y-2">
                      {result.pivot_actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-[#00C9A7] mt-0.5 shrink-0">→</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Updated Assumptions */}
                {result.updated_assumptions?.length > 0 && (
                  <div className="card p-5">
                    <div className="section-label mb-3">Updated Assumptions</div>
                    <div className="space-y-3">
                      {result.updated_assumptions.map((a, i) => {
                        const color = statusColor[a.status] ?? "#94A3B8";
                        return (
                          <div key={i} className="text-xs" style={a.status !== "stable" ? { borderLeft: `3px solid ${color}`, paddingLeft: "8px" } : {}}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold" style={{ color }}>{a.health_score}/10</span>
                              <span className="capitalize px-1.5 py-0.5 rounded-full font-semibold"
                                style={{ background: color + "18", color }}>{a.status.replace("_", " ")}</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed">{a.assumption_text}</p>
                            {a.alert_message && (
                              <p className="mt-1.5 text-xs leading-relaxed" style={{ color }}>{a.alert_message}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sessionId && (
                  <Link href={`/venture-twin?session=${sessionId}`}
                    className="btn-scale block w-full py-3 text-center text-sm font-bold rounded-xl border-2 border-[#00C9A7] text-[#00C9A7] hover:bg-[#00C9A7] hover:text-white transition-all">
                    View Venture Twin →
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default function PivotSimulatorPage() {
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
          <PivotContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
