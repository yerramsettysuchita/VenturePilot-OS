import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { generatePivotSimulation } from "@/lib/openrouter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, market_change, current_path, assumptions } = body;

    if (!market_change || market_change.trim().length < 20) {
      return NextResponse.json(
        { error: "Please describe the market change in more detail (at least 20 characters)." },
        { status: 400 }
      );
    }

    if (!current_path) {
      return NextResponse.json(
        { error: "current_path is required." },
        { status: 400 }
      );
    }

    const result = await generatePivotSimulation(
      current_path,
      market_change,
      assumptions ?? []
    );

    const db = getSupabaseAdmin();

    // Update affected assumptions in Supabase
    if (result.updated_assumptions?.length && session_id) {
      for (const updated of result.updated_assumptions) {
        await db.from("assumptions")
          .update({
            health_score: updated.health_score,
            status: updated.status,
            alert_message: updated.alert_message ?? null,
            last_checked_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("session_id", session_id)
          .eq("assumption_text", updated.assumption_text);
      }
    }

    // Auto-save pivot simulation to decision memory (non-blocking)
    if (session_id) {
      try {
        await db.from("decision_memory").insert([{
          session_id,
          decision_type: "pivot_considered",
          decision_title: `Pivot simulated: ${result.recommendation.replace(/_/g, " ")}`,
          context: market_change,
          evidence: [{ type: "pivot_result", content: result.reasoning }],
          rationale: result.reasoning,
          related_path_label: current_path.path_label ?? null,
        }]);
      } catch {}

      try {
        await db.from("analytics_events").insert([{
          event_type: "pivot_simulation_run",
          session_id,
          properties: {
            impact_severity: result.impact_severity,
            recommendation: result.recommendation,
            old_score: current_path.total_score,
            new_score: result.new_total_score,
          },
        }]);
      } catch {}
    }

    return NextResponse.json({ success: true, ...result });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Simulation failed";
    console.error("Pivot simulate error:", msg);
    return NextResponse.json(
      { error: "Simulation failed. Please try again.", details: msg },
      { status: 500 }
    );
  }
}
