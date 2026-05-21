import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { generateVenturePaths as generateViaOpenRouter } from "@/lib/openrouter";
import { generateVenturePaths as generateViaOpenAI } from "@/lib/openai";
import { rateLimit } from "@/lib/rateLimit";

// Priority: OpenRouter (Claude 3.5) → OpenAI (GPT-4o) → error
async function generatePaths(
  idea: string,
  context: Record<string, unknown>
) {
  if (process.env.OPENROUTER_API_KEY) {
    try {
      return await generateViaOpenRouter(idea, context, {});
    } catch (e) {
      console.warn("OpenRouter failed, trying OpenAI fallback:", e);
    }
  }
  if (process.env.OPENAI_API_KEY) {
    const result = await generateViaOpenAI(idea, context, {
      market_demand_score: 7,
      competitor_names: [],
      pricing_gap: "Unknown",
      timing_signal: "Neutral",
      customer_pain_evidence: [],
      differentiation_opportunities: [],
      risk_signals: [],
    });
    // Normalise OpenAI shape to match OpenRouter shape
    return {
      paths: result.paths,
      assumptions: result.assumptions,
      milestones: [],
      market_summary: result.market_summary,
      recommended_first_action: result.recommended_first_action,
      gtm_launchpad: null,
    };
  }
  throw new Error("No AI provider configured. Add OPENROUTER_API_KEY or OPENAI_API_KEY.");
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { startup_idea, founder_context } = body;

    if (!startup_idea || startup_idea.trim().length < 10) {
      return NextResponse.json(
        { error: "Please describe your idea in at least 10 characters." },
        { status: 400 }
      );
    }

    const session_id = `vpos_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const db = getSupabaseAdmin();

    await db.from("venture_sessions").insert([{
      session_id,
      startup_idea,
      founder_context: founder_context ?? {},
      status: "researching",
    }]);

    await db.from("venture_sessions")
      .update({ status: "simulating" })
      .eq("session_id", session_id);

    // Real AI: OpenRouter (Claude) → OpenAI (GPT-4o) fallback chain
    const aiResponse = await generatePaths(startup_idea, founder_context ?? {});

    await db.from("venture_sessions")
      .update({ status: "scoring" })
      .eq("session_id", session_id);

    // Store paths
    await db.from("venture_paths").insert(
      aiResponse.paths.map((p) => ({ session_id, ...(p as object) }))
    );

    // Store assumptions
    await db.from("assumptions").insert(
      aiResponse.assumptions.map((a) => ({
        session_id,
        ...(a as object),
        last_checked_at: new Date().toISOString(),
      }))
    );

    type PathRecord = { is_recommended?: boolean; path_name?: string; total_score?: number; why_won?: string; why_others_lost?: string[]; path_label?: string };
    const recommended = (aiResponse.paths as PathRecord[]).find((p) => p.is_recommended);
    const rejected = (aiResponse.paths as PathRecord[]).filter((p) => !p.is_recommended);

    // Auto-save decision memory for path selection (non-blocking)
    try {
      await db.from("decision_memory").insert([{
        session_id,
        decision_type: "path_selected",
        decision_title: `Selected: ${recommended?.path_name ?? "Recommended Path"}`,
        context: `Startup idea: ${startup_idea}`,
        evidence: [
          { type: "market_signal", content: aiResponse.market_summary },
          { type: "score", content: `Total score: ${recommended?.total_score ?? 0}/10` },
        ],
        alternatives_considered: rejected.map((p) => ({
          name: p.path_name,
          score: p.total_score,
          why_rejected: p.why_others_lost?.[0] ?? "Lower overall score",
        })),
        rationale: recommended?.why_won ?? null,
        related_path_label: recommended?.path_label ?? "A",
      }]);
    } catch {}

    // Store GTM launchpad + milestones in session context
    await db.from("venture_sessions").update({
      status: "executing",
      founder_context: {
        ...(founder_context ?? {}),
        gtm_launchpad: aiResponse.gtm_launchpad,
        milestones: aiResponse.milestones,
        market_summary: aiResponse.market_summary,
        recommended_first_action: aiResponse.recommended_first_action,
      },
      updated_at: new Date().toISOString(),
    }).eq("session_id", session_id);

    // Analytics (non-blocking)
    try {
      await db.from("analytics_events").insert([{
        event_type: "simulation_complete",
        session_id,
        properties: {
          idea_length: startup_idea.length,
          recommended_path: recommended?.path_name,
          top_score: Math.max(...(aiResponse.paths as PathRecord[]).map((p) => p.total_score ?? 0)),
          used_ai: true,
        },
      }]);
    } catch {}

    return NextResponse.json({
      success: true,
      session_id,
      paths: aiResponse.paths,
      assumptions: aiResponse.assumptions,
      milestones: aiResponse.milestones,
      gtm_launchpad: aiResponse.gtm_launchpad,
      market_summary: aiResponse.market_summary,
      recommended_first_action: aiResponse.recommended_first_action,
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Analysis failed";
    console.error("Simulate error:", msg);
    return NextResponse.json(
      { error: "Analysis failed. Please try again.", details: msg },
      { status: 500 }
    );
  }
}
