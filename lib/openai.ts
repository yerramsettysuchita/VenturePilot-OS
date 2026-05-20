import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });
  }
  return _client;
}

const SYSTEM_PROMPT = `You are VenturePilot OS — an elite venture strategy engine used by top founders and accelerators.

Your job is to analyze a startup idea and generate exactly 3 venture paths.

Each path must be a genuinely different business model and market approach — not variations of the same idea.

Score each path across 7 dimensions on a scale of 1-10:
1. market_demand
2. competition
3. differentiation
4. feasibility
5. gtm_clarity
6. revenue_speed
7. founder_fit

Select exactly one recommended path — the one with the highest weighted total score.
Explain why the recommended path wins and why each other path lost.
Generate exactly 3 core assumptions the recommended path depends on.

Respond ONLY with valid JSON. No markdown. No explanation. Just the JSON object.

JSON structure:
{
  "paths": [
    {
      "path_label": "A",
      "path_name": "string",
      "path_type": "string",
      "description": "string",
      "total_score": number,
      "is_recommended": boolean,
      "scores": {
        "market_demand": number,
        "competition": number,
        "differentiation": number,
        "feasibility": number,
        "gtm_clarity": number,
        "revenue_speed": number,
        "founder_fit": number
      },
      "reasoning": "string",
      "why_won": "string or null",
      "why_others_lost": ["string"]
    }
  ],
  "assumptions": [
    {
      "assumption_text": "string",
      "health_score": number,
      "status": "stable|watch|at_risk"
    }
  ],
  "market_summary": "string",
  "recommended_first_action": "string"
}`;

export async function generateVenturePaths(
  startupIdea: string,
  founderContext: Record<string, unknown>,
  deepSearchResults: {
    market_demand_score: number;
    competitor_names: string[];
    pricing_gap: string;
    timing_signal: string;
    customer_pain_evidence: string[];
    differentiation_opportunities: string[];
    risk_signals: string[];
  }
): Promise<{
  paths: unknown[];
  assumptions: unknown[];
  market_summary: string;
  recommended_first_action: string;
}> {
  const userPrompt = `Startup Idea: ${startupIdea}

Founder Context:
${JSON.stringify(founderContext, null, 2)}

DeepSearch Intelligence:
Market Demand Score: ${deepSearchResults.market_demand_score}
Competitors Found: ${deepSearchResults.competitor_names.join(", ") || "None identified"}
Pricing Gap: ${deepSearchResults.pricing_gap}
Timing Signal: ${deepSearchResults.timing_signal}
Customer Pain Evidence: ${deepSearchResults.customer_pain_evidence.join("; ")}
Differentiation Opportunities: ${deepSearchResults.differentiation_opportunities.join("; ")}
Risk Signals: ${deepSearchResults.risk_signals.join("; ")}

Generate 3 venture paths with full scoring, reasoning, and assumptions.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty response");

  return JSON.parse(content);
}

export async function generateMilestones(
  idea: string,
  path: { path_name: string; path_type: string; description: string }
): Promise<unknown[]> {
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You generate startup execution milestones. Return ONLY valid JSON object with a milestones array. No markdown.",
      },
      {
        role: "user",
        content: `Create 4 execution milestones for:
Idea: ${idea}
Path: ${path.path_name} (${path.path_type})
Description: ${path.description}

Each milestone has:
- name: string
- description: string
- duration_weeks: number
- tasks: array of 3-4 task strings
- success_metric: string

Return as JSON object: { "milestones": [...] }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) return [];
  const parsed = JSON.parse(content);
  return parsed.milestones ?? parsed.data ?? [];
}
