import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

interface PathScore {
  market_demand: number;
  competition: number;
  differentiation: number;
  feasibility: number;
  gtm_clarity: number;
  revenue_speed: number;
  founder_fit: number;
}

interface VenturePath {
  path_label: string;
  path_name: string;
  path_type: string;
  description: string;
  total_score: number;
  is_recommended: boolean;
  scores: PathScore;
  reasoning: string;
  why_won: string | null;
  why_others_lost: string[];
}

function generatePaths(idea: string): VenturePath[] {
  const l = idea.toLowerCase();

  if (/student|university|campus|education|incubator/.test(l)) {
    return [
      { path_label: "A", path_name: "Startup Validation Copilot", path_type: "B2B SaaS",
        description: "AI-powered validation tool for student founders in incubators",
        total_score: 8.7, is_recommended: true,
        scores: { market_demand: 8.4, competition: 7.2, differentiation: 8.6, feasibility: 9.0, gtm_clarity: 7.5, revenue_speed: 7.8, founder_fit: 9.2 },
        reasoning: "Strong demand in university incubator segment with no dedicated tooling",
        why_won: "High founder fit, strong feasibility, clear GTM through incubators",
        why_others_lost: ["Path B requires enterprise sales motion", "Path C has longer monetization timeline"] },
      { path_label: "B", path_name: "Cohort Execution Platform", path_type: "Platform",
        description: "Workflow engine for university accelerator programs",
        total_score: 7.4, is_recommended: false,
        scores: { market_demand: 7.1, competition: 6.8, differentiation: 7.4, feasibility: 8.2, gtm_clarity: 6.8, revenue_speed: 6.4, founder_fit: 7.6 },
        reasoning: "Solid opportunity but requires institutional sales relationships",
        why_won: null, why_others_lost: [] },
      { path_label: "C", path_name: "Founder Decision Intelligence", path_type: "Vertical SaaS",
        description: "Strategic advisory layer for student-run venture funds",
        total_score: 6.9, is_recommended: false,
        scores: { market_demand: 6.8, competition: 7.2, differentiation: 7.0, feasibility: 7.5, gtm_clarity: 6.2, revenue_speed: 5.8, founder_fit: 7.1 },
        reasoning: "Niche market with long enterprise sales cycles",
        why_won: null, why_others_lost: [] },
    ];
  }

  if (/restaurant|food|hospitality|inventory|kitchen/.test(l)) {
    return [
      { path_label: "A", path_name: "Restaurant OS", path_type: "Vertical SaaS",
        description: "End-to-end inventory and ops platform for SMB restaurants",
        total_score: 8.9, is_recommended: true,
        scores: { market_demand: 9.1, competition: 7.4, differentiation: 8.6, feasibility: 8.6, gtm_clarity: 8.2, revenue_speed: 8.8, founder_fit: 8.4 },
        reasoning: "Massive underserved SMB restaurant market with clear pain and willingness to pay",
        why_won: "Strongest demand signal, fastest path to revenue, clear GTM",
        why_others_lost: ["Path B requires two-sided marketplace dynamics", "Path C is too niche for current market size"] },
      { path_label: "B", path_name: "F&B Procurement Network", path_type: "Marketplace",
        description: "B2B marketplace connecting restaurants to local suppliers",
        total_score: 7.6, is_recommended: false,
        scores: { market_demand: 7.8, competition: 6.4, differentiation: 7.8, feasibility: 7.2, gtm_clarity: 7.4, revenue_speed: 6.8, founder_fit: 7.2 },
        reasoning: "Good opportunity but marketplace cold start problem is significant",
        why_won: null, why_others_lost: [] },
      { path_label: "C", path_name: "Ghost Kitchen Intelligence", path_type: "Data SaaS",
        description: "Demand forecasting for dark kitchen operators",
        total_score: 6.7, is_recommended: false,
        scores: { market_demand: 7.2, competition: 7.8, differentiation: 6.4, feasibility: 6.8, gtm_clarity: 5.9, revenue_speed: 5.6, founder_fit: 6.8 },
        reasoning: "Niche segment with limited market size in early stage",
        why_won: null, why_others_lost: [] },
    ];
  }

  if (/freelance|designer|creative|marketplace/.test(l)) {
    return [
      { path_label: "A", path_name: "Freelance Verification Layer", path_type: "B2B SaaS",
        description: "Trust and verification infrastructure for creative marketplaces",
        total_score: 8.5, is_recommended: true,
        scores: { market_demand: 8.7, competition: 7.6, differentiation: 8.9, feasibility: 8.9, gtm_clarity: 7.8, revenue_speed: 7.4, founder_fit: 8.6 },
        reasoning: "Strong infrastructure play with clear B2B monetization",
        why_won: "Best technical feasibility and differentiation score",
        why_others_lost: ["Path B has high CAC for marketplace model", "Path C requires large user base first"] },
      { path_label: "B", path_name: "Creative Project Marketplace", path_type: "Marketplace",
        description: "Curated marketplace for high-end freelance design work",
        total_score: 7.8, is_recommended: false,
        scores: { market_demand: 8.1, competition: 5.8, differentiation: 7.8, feasibility: 7.4, gtm_clarity: 7.9, revenue_speed: 6.8, founder_fit: 7.6 },
        reasoning: "High demand but crowded marketplace space",
        why_won: null, why_others_lost: [] },
      { path_label: "C", path_name: "Studio OS", path_type: "Vertical SaaS",
        description: "Project and client management OS for independent creative studios",
        total_score: 7.1, is_recommended: false,
        scores: { market_demand: 7.3, competition: 6.4, differentiation: 7.2, feasibility: 8.2, gtm_clarity: 6.8, revenue_speed: 6.4, founder_fit: 7.8 },
        reasoning: "Good fit for designer founders but limited market ceiling",
        why_won: null, why_others_lost: [] },
    ];
  }

  // Default paths
  return [
    { path_label: "A", path_name: "Vertical B2B SaaS", path_type: "B2B SaaS",
      description: "Focused vertical SaaS targeting SMB operators in your space",
      total_score: 8.2, is_recommended: true,
      scores: { market_demand: 8.0, competition: 7.4, differentiation: 8.2, feasibility: 8.5, gtm_clarity: 7.8, revenue_speed: 7.6, founder_fit: 8.8 },
      reasoning: "Strongest overall score across feasibility and founder fit",
      why_won: "Best balance of demand, feasibility, and GTM clarity",
      why_others_lost: ["Path B has longer time to revenue", "Path C has higher GTM complexity"] },
    { path_label: "B", path_name: "API-First Platform", path_type: "Developer Platform",
      description: "Developer-first infrastructure with usage-based pricing",
      total_score: 7.5, is_recommended: false,
      scores: { market_demand: 7.4, competition: 6.8, differentiation: 8.4, feasibility: 8.8, gtm_clarity: 6.9, revenue_speed: 6.2, founder_fit: 7.4 },
      reasoning: "High technical feasibility but slower monetization path",
      why_won: null, why_others_lost: [] },
    { path_label: "C", path_name: "Vertical Copilot", path_type: "AI Assistant",
      description: "AI copilot embedded into existing industry workflows",
      total_score: 6.8, is_recommended: false,
      scores: { market_demand: 7.0, competition: 5.8, differentiation: 7.2, feasibility: 7.6, gtm_clarity: 6.5, revenue_speed: 6.4, founder_fit: 6.8 },
      reasoning: "Competitive space with commoditizing AI assistant layer",
      why_won: null, why_others_lost: [] },
  ];
}

function generateAssumptions(idea: string) {
  return [
    { assumption_text: "Target buyers have budget and willingness to pay $49-199/month", health_score: 8.2, status: "stable", alert_message: null },
    { assumption_text: "Primary competitor won't enter this exact segment in the next 6 months", health_score: 6.1, status: "watch", alert_message: "Monitor competitor announcements weekly" },
    { assumption_text: "Acquisition channel stays cost-effective below $200 CAC", health_score: 7.8, status: "stable", alert_message: null },
  ];
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { startup_idea, founder_context, session_id } = body;

    if (!startup_idea) {
      return NextResponse.json({ error: "Startup idea is required." }, { status: 400 });
    }

    const sid = session_id ?? `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const db = getSupabaseAdmin();

    await db.from("venture_sessions").upsert([{
      session_id: sid,
      startup_idea,
      founder_context: founder_context ?? {},
      status: "simulating",
    }]);

    const paths = generatePaths(startup_idea);
    const assumptions = generateAssumptions(startup_idea);

    await db.from("venture_paths").insert(paths.map((p) => ({ session_id: sid, ...p })));
    await db.from("assumptions").insert(assumptions.map((a) => ({ session_id: sid, ...a })));

    await db.from("venture_sessions").update({ status: "scoring", updated_at: new Date().toISOString() }).eq("session_id", sid);

    await db.from("analytics_events").insert([{
      event_type: "simulation_run",
      session_id: sid,
      properties: { idea_length: startup_idea.length, has_context: !!founder_context },
    }]);

    return NextResponse.json({ success: true, session_id: sid, paths, assumptions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Simulate error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
