import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { runDeepSearch } from "@/lib/deepsearch";
import { generateVenturePaths } from "@/lib/openai";
import { rateLimit } from "@/lib/rateLimit";

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

    // Create session
    await db.from("venture_sessions").insert([{
      session_id,
      startup_idea,
      founder_context: founder_context ?? {},
      status: "researching",
    }]);

    // Step 1 — DeepSearch (real or graceful fallback)
    const intelligence = await runDeepSearch(
      startup_idea,
      JSON.stringify(founder_context ?? {})
    );

    await db.from("venture_sessions").update({ status: "simulating" }).eq("session_id", session_id);

    // Step 2 — GPT-4o path generation (real or graceful fallback)
    let aiResponse;
    try {
      aiResponse = await generateVenturePaths(
        startup_idea,
        founder_context ?? {},
        intelligence
      );
    } catch (aiError) {
      console.error("GPT-4o failed, using local fallback:", aiError);
      aiResponse = generateLocalPaths(startup_idea);
    }

    await db.from("venture_sessions").update({ status: "scoring" }).eq("session_id", session_id);

    // Step 3 — Store paths
    await db.from("venture_paths").insert(
      aiResponse.paths.map((p: unknown) => ({ session_id, ...(p as object) }))
    );

    // Step 4 — Store assumptions
    await db.from("assumptions").insert(
      aiResponse.assumptions.map((a: unknown) => ({
        session_id,
        ...(a as object),
        last_checked_at: new Date().toISOString(),
      }))
    );

    await db.from("venture_sessions")
      .update({ status: "executing", updated_at: new Date().toISOString() })
      .eq("session_id", session_id);

    // Track analytics
    const paths = aiResponse.paths as Array<{ is_recommended?: boolean; path_name?: string; total_score?: number }>;
    await db.from("analytics_events").insert([{
      event_type: "simulation_complete",
      session_id,
      properties: {
        idea_length: startup_idea.length,
        recommended_path: paths.find((p) => p.is_recommended)?.path_name,
        top_score: Math.max(...paths.map((p) => p.total_score ?? 0)),
        used_ai: !!process.env.OPENAI_API_KEY,
        used_deepsearch: !!process.env.DEEPSEARCH_API_KEY,
      },
    }]);

    return NextResponse.json({
      success: true,
      session_id,
      paths: aiResponse.paths,
      assumptions: aiResponse.assumptions,
      market_summary: aiResponse.market_summary ?? null,
      recommended_first_action: aiResponse.recommended_first_action ?? null,
      intelligence: {
        market_size: intelligence.market_size,
        competitor_count: intelligence.competitor_count,
        pricing_gap: intelligence.pricing_gap,
        timing_signal: intelligence.timing_signal,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Analysis failed";
    console.error("Simulate error:", msg);
    return NextResponse.json({ error: "Analysis failed. Please try again.", details: msg }, { status: 500 });
  }
}

// Local fallback when OpenAI key is not configured
function generateLocalPaths(idea: string) {
  const l = idea.toLowerCase();

  const student = /student|university|campus|education|incubator/.test(l);
  const restaurant = /restaurant|food|hospitality|inventory|kitchen/.test(l);
  const freelance = /freelance|designer|creative|marketplace/.test(l);

  const paths = student
    ? [
        { path_label: "A", path_name: "Startup Validation Copilot", path_type: "B2B SaaS", description: "AI-powered validation tool for student founders in incubators", total_score: 8.7, is_recommended: true, scores: { market_demand: 8.4, competition: 7.2, differentiation: 8.6, feasibility: 9.0, gtm_clarity: 7.5, revenue_speed: 7.8, founder_fit: 9.2 }, reasoning: "Strong demand in university incubator segment with no dedicated tooling", why_won: "High founder fit, clear GTM through incubator networks", why_others_lost: ["Path B requires enterprise sales", "Path C has longer monetization"] },
        { path_label: "B", path_name: "Cohort Execution Platform", path_type: "Platform", description: "Workflow engine for university accelerator programs", total_score: 7.4, is_recommended: false, scores: { market_demand: 7.1, competition: 6.8, differentiation: 7.4, feasibility: 8.2, gtm_clarity: 6.8, revenue_speed: 6.4, founder_fit: 7.6 }, reasoning: "Solid opportunity but requires institutional relationships", why_won: null, why_others_lost: [] },
        { path_label: "C", path_name: "Founder Decision Intelligence", path_type: "Vertical SaaS", description: "Strategic advisory layer for student-run venture funds", total_score: 6.9, is_recommended: false, scores: { market_demand: 6.8, competition: 7.2, differentiation: 7.0, feasibility: 7.5, gtm_clarity: 6.2, revenue_speed: 5.8, founder_fit: 7.1 }, reasoning: "Niche market with long enterprise cycles", why_won: null, why_others_lost: [] },
      ]
    : restaurant
    ? [
        { path_label: "A", path_name: "Restaurant OS", path_type: "Vertical SaaS", description: "End-to-end inventory and ops platform for SMB restaurants", total_score: 8.9, is_recommended: true, scores: { market_demand: 9.1, competition: 7.4, differentiation: 8.6, feasibility: 8.6, gtm_clarity: 8.2, revenue_speed: 8.8, founder_fit: 8.4 }, reasoning: "Massive underserved SMB market with strong willingness to pay", why_won: "Strongest demand signal and fastest path to revenue", why_others_lost: ["Path B cold start problem", "Path C too niche"] },
        { path_label: "B", path_name: "F&B Procurement Network", path_type: "Marketplace", description: "B2B marketplace connecting restaurants to local suppliers", total_score: 7.6, is_recommended: false, scores: { market_demand: 7.8, competition: 6.4, differentiation: 7.8, feasibility: 7.2, gtm_clarity: 7.4, revenue_speed: 6.8, founder_fit: 7.2 }, reasoning: "Good opportunity but marketplace cold start is significant", why_won: null, why_others_lost: [] },
        { path_label: "C", path_name: "Ghost Kitchen Intelligence", path_type: "Data SaaS", description: "Demand forecasting for dark kitchen operators", total_score: 6.7, is_recommended: false, scores: { market_demand: 7.2, competition: 7.8, differentiation: 6.4, feasibility: 6.8, gtm_clarity: 5.9, revenue_speed: 5.6, founder_fit: 6.8 }, reasoning: "Niche segment with limited early market size", why_won: null, why_others_lost: [] },
      ]
    : freelance
    ? [
        { path_label: "A", path_name: "Freelance Verification Layer", path_type: "B2B SaaS", description: "Trust and verification infrastructure for creative marketplaces", total_score: 8.5, is_recommended: true, scores: { market_demand: 8.7, competition: 7.6, differentiation: 8.9, feasibility: 8.9, gtm_clarity: 7.8, revenue_speed: 7.4, founder_fit: 8.6 }, reasoning: "Strong infrastructure play with clear B2B monetization", why_won: "Best technical feasibility and differentiation", why_others_lost: ["Path B high CAC", "Path C needs large base first"] },
        { path_label: "B", path_name: "Creative Project Marketplace", path_type: "Marketplace", description: "Curated marketplace for high-end freelance design work", total_score: 7.8, is_recommended: false, scores: { market_demand: 8.1, competition: 5.8, differentiation: 7.8, feasibility: 7.4, gtm_clarity: 7.9, revenue_speed: 6.8, founder_fit: 7.6 }, reasoning: "High demand but crowded space", why_won: null, why_others_lost: [] },
        { path_label: "C", path_name: "Studio OS", path_type: "Vertical SaaS", description: "Project and client management OS for independent creative studios", total_score: 7.1, is_recommended: false, scores: { market_demand: 7.3, competition: 6.4, differentiation: 7.2, feasibility: 8.2, gtm_clarity: 6.8, revenue_speed: 6.4, founder_fit: 7.8 }, reasoning: "Good fit but limited market ceiling", why_won: null, why_others_lost: [] },
      ]
    : [
        { path_label: "A", path_name: "Vertical B2B SaaS", path_type: "B2B SaaS", description: "Focused vertical SaaS targeting SMB operators in your space", total_score: 8.2, is_recommended: true, scores: { market_demand: 8.0, competition: 7.4, differentiation: 8.2, feasibility: 8.5, gtm_clarity: 7.8, revenue_speed: 7.6, founder_fit: 8.8 }, reasoning: "Best balance of demand, feasibility, and GTM clarity", why_won: "Strongest overall weighted score", why_others_lost: ["Path B slower to revenue", "Path C higher GTM complexity"] },
        { path_label: "B", path_name: "API-First Platform", path_type: "Developer Platform", description: "Developer-first infrastructure with usage-based pricing", total_score: 7.5, is_recommended: false, scores: { market_demand: 7.4, competition: 6.8, differentiation: 8.4, feasibility: 8.8, gtm_clarity: 6.9, revenue_speed: 6.2, founder_fit: 7.4 }, reasoning: "High feasibility but slower monetization", why_won: null, why_others_lost: [] },
        { path_label: "C", path_name: "Vertical Copilot", path_type: "AI Assistant", description: "AI copilot embedded into existing industry workflows", total_score: 6.8, is_recommended: false, scores: { market_demand: 7.0, competition: 5.8, differentiation: 7.2, feasibility: 7.6, gtm_clarity: 6.5, revenue_speed: 6.4, founder_fit: 6.8 }, reasoning: "Competitive space with commoditizing AI layer", why_won: null, why_others_lost: [] },
      ];

  return {
    paths,
    assumptions: [
      { assumption_text: "Target buyers have budget and willingness to pay $49-199/month", health_score: 8.2, status: "stable" },
      { assumption_text: "Primary competitor won't enter this exact segment in the next 6 months", health_score: 6.1, status: "watch" },
      { assumption_text: "Acquisition channel stays cost-effective below $200 CAC", health_score: 7.8, status: "stable" },
    ],
    market_summary: "Market shows strong potential with clear differentiation opportunity.",
    recommended_first_action: "Validate with 5 target customer interviews this week.",
  };
}
