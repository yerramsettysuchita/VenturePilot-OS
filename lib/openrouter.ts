const BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export async function callAI(
  system: string,
  user: string,
  temperature = 0.7,
  maxTokens = 3000
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://venturepilot-os.onrender.com",
      "X-Title": "VenturePilot OS",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function generateVenturePaths(
  startupIdea: string,
  founderContext: Record<string, unknown>,
  marketSignals: Record<string, unknown>
): Promise<VenturePathsResponse> {
  const system = `You are VenturePilot OS — an elite venture strategy AI used by top founders, accelerators, and venture studios globally.

Your job: analyze a startup idea and generate exactly 3 venture paths that are genuinely different business model expressions of the same founding intent. Not variations. Not tweaks. Three real strategic directions a founder would actually debate choosing between.

Scoring dimensions (1-10 each):
- market_demand: size and urgency of pain
- competition: how crowded and defensible
- differentiation: uniqueness of approach
- feasibility: buildability in 6 months
- gtm_clarity: how clear the go-to-market
- revenue_speed: time to first dollar
- founder_fit: match to typical founder

Calculate total_score as weighted average:
market_demand (20%) + competition (15%) + differentiation (15%) + feasibility (15%) + gtm_clarity (15%) + revenue_speed (10%) + founder_fit (10%)

Mark exactly ONE path as is_recommended. That path must have the highest total_score.

Generate 3 specific, falsifiable assumptions the recommended path depends on. Generate 4 execution milestones.

Respond ONLY with valid JSON. No markdown. No text outside the JSON object.

Required structure:
{
  "paths": [
    {
      "path_label": "A",
      "path_name": "Specific product name",
      "path_type": "Business model type",
      "description": "2 sentences specific to this idea",
      "total_score": 8.4,
      "is_recommended": true,
      "scores": {
        "market_demand": 8.5,
        "competition": 7.2,
        "differentiation": 8.8,
        "feasibility": 8.6,
        "gtm_clarity": 7.9,
        "revenue_speed": 7.4,
        "founder_fit": 9.0
      },
      "reasoning": "Specific reasoning for this path",
      "why_won": "Why this path wins over others",
      "why_others_lost": ["Reason path B lost", "Reason path C lost"]
    }
  ],
  "assumptions": [
    {
      "assumption_text": "Specific falsifiable assumption about this idea",
      "health_score": 8.0,
      "status": "stable",
      "monitoring_signal": "What to watch to validate or invalidate this"
    }
  ],
  "milestones": [
    {
      "name": "Milestone name",
      "description": "What gets done",
      "duration_weeks": 4,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "success_metric": "How you know this milestone is complete"
    }
  ],
  "market_summary": "2-3 sentence market overview specific to this idea",
  "recommended_first_action": "Single most important next step this week",
  "gtm_launchpad": {
    "ideal_first_user": "Specific description of the exact first user to target",
    "acquisition_channel": "Primary channel and why",
    "first_experiment": "Specific experiment to run this week",
    "messaging_angle": "Core message that resonates with the target user",
    "first_10_tasks": [
      "Task 1",
      "Task 2",
      "Task 3",
      "Task 4",
      "Task 5",
      "Task 6",
      "Task 7",
      "Task 8",
      "Task 9",
      "Task 10"
    ]
  }
}`;

  const user = `Startup Idea: ${startupIdea}

Founder Context:
Stage: ${founderContext.stage || "Idea Stage"}
Team Size: ${founderContext.team_size || "Solo"}
Biggest Challenge: ${founderContext.biggest_challenge || "Choosing direction"}
Founder Type: ${founderContext.founder_type || "Solo Founder"}

Market Signals:
${Object.keys(marketSignals).length > 0 ? JSON.stringify(marketSignals, null, 2) : "No external signals available — use general market knowledge."}

Generate 3 genuinely different venture paths. Every field must be specific to THIS idea. No generic responses. No placeholder names like "Competitor A".`;

  const raw = await callAI(system, user, 0.7, 3500);
  return JSON.parse(raw) as VenturePathsResponse;
}

export async function generatePivotSimulation(
  currentPath: { path_name: string; path_type: string; total_score: number },
  marketChange: string,
  assumptions: { assumption_text: string; health_score: number; status: string }[]
): Promise<PivotSimulationResponse> {
  const system = `You are the VenturePilot OS Pivot Simulator. A market condition has changed. Analyze the impact on the current venture path and recommend action.

Respond ONLY with valid JSON:
{
  "impact_severity": "low|medium|high|critical",
  "affected_assumptions": ["assumption text that is affected"],
  "recommendation": "stay|adjust_gtm|pivot_partial|pivot_full",
  "reasoning": "Detailed explanation of why and what changed",
  "updated_scores": {
    "market_demand": 8.0,
    "competition": 7.0,
    "differentiation": 8.0,
    "feasibility": 8.0,
    "gtm_clarity": 7.5,
    "revenue_speed": 7.0,
    "founder_fit": 8.0
  },
  "new_total_score": 7.8,
  "pivot_actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "updated_assumptions": [
    {
      "assumption_text": "The assumption text",
      "health_score": 6.5,
      "status": "watch",
      "alert_message": "What changed and why this matters"
    }
  ]
}`;

  const user = `Current Path: ${currentPath.path_name}
Path Type: ${currentPath.path_type}
Current Score: ${currentPath.total_score}/10

Market Change Event: ${marketChange}

Current Assumptions:
${assumptions.map((a) => `- ${a.assumption_text} (Health: ${a.health_score}/10, Status: ${a.status})`).join("\n")}

Analyze the impact. Be specific about which assumptions are affected and why. Calculate realistic updated scores.`;

  const raw = await callAI(system, user, 0.6, 2000);
  return JSON.parse(raw) as PivotSimulationResponse;
}

export async function generateAssumptionUpdate(
  assumption: { assumption_text: string; health_score: number; status: string; created_at: string },
  marketContext: string
): Promise<AssumptionUpdateResponse> {
  const system = `You are the VenturePilot OS Assumption Health Monitor. Evaluate how market context affects a startup assumption.

Respond ONLY with valid JSON:
{
  "new_health_score": 7.5,
  "new_status": "stable|watch|at_risk|breached",
  "alert_message": "Brief specific alert message, or null if stable",
  "reasoning": "Why the score changed"
}

Rules:
- health_score must be between 1 and 10
- "stable" = score 7.0-10.0
- "watch" = score 5.0-6.9
- "at_risk" = score 3.0-4.9
- "breached" = score below 3.0
- Only set alert_message if status is watch, at_risk, or breached`;

  const user = `Assumption: ${assumption.assumption_text}
Current Health: ${assumption.health_score}/10
Current Status: ${assumption.status}

Market Context: ${marketContext}

Update the health score and status based on this context.`;

  const raw = await callAI(system, user, 0.5, 500);
  return JSON.parse(raw) as AssumptionUpdateResponse;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VenturePathsResponse {
  paths: VenturePath[];
  assumptions: VentureAssumption[];
  milestones: Milestone[];
  market_summary: string;
  recommended_first_action: string;
  gtm_launchpad: GTMLaunchpad;
}

export interface VenturePath {
  path_label: string;
  path_name: string;
  path_type: string;
  description: string;
  total_score: number;
  is_recommended: boolean;
  scores: Record<string, number>;
  reasoning: string;
  why_won: string | null;
  why_others_lost: string[];
}

export interface VentureAssumption {
  assumption_text: string;
  health_score: number;
  status: "stable" | "watch" | "at_risk";
  monitoring_signal?: string;
}

export interface Milestone {
  name: string;
  description: string;
  duration_weeks: number;
  tasks: string[];
  success_metric: string;
}

export interface GTMLaunchpad {
  ideal_first_user: string;
  acquisition_channel: string;
  first_experiment: string;
  messaging_angle: string;
  first_10_tasks: string[];
}

export interface PivotSimulationResponse {
  impact_severity: "low" | "medium" | "high" | "critical";
  affected_assumptions: string[];
  recommendation: "stay" | "adjust_gtm" | "pivot_partial" | "pivot_full";
  reasoning: string;
  updated_scores: Record<string, number>;
  new_total_score: number;
  pivot_actions: string[];
  updated_assumptions: {
    assumption_text: string;
    health_score: number;
    status: string;
    alert_message?: string;
  }[];
}

export interface AssumptionUpdateResponse {
  new_health_score: number;
  new_status: "stable" | "watch" | "at_risk" | "breached";
  alert_message: string | null;
  reasoning: string;
}
