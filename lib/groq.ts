// Groq — ultra-fast inference, used for frequent low-latency tasks
// (assumption health monitoring, quick re-evaluations)
// Model: llama-3.1-70b-versatile — fast, capable, free tier generous

const GROQ_BASE = "https://api.groq.com/openai/v1";

export async function callGroq(
  system: string,
  user: string,
  temperature = 0.5
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      max_tokens: 512,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

import type { AssumptionUpdateResponse } from "./openrouter";

// Assumption health update via Groq — same contract as openrouter version
// but ~10x faster and cheaper, ideal for the 30-min cron job
export async function groqAssumptionUpdate(
  assumption: { assumption_text: string; health_score: number; status: string; created_at: string },
  marketContext: string
): Promise<AssumptionUpdateResponse> {
  const system = `You are a startup assumption health monitor. Evaluate how market context affects a startup assumption.

Respond ONLY with valid JSON, no other text:
{
  "new_health_score": <number 1-10>,
  "new_status": "<stable|watch|at_risk|breached>",
  "alert_message": "<string or null>",
  "reasoning": "<one sentence>"
}

Rules:
- stable = score 7.0-10.0, no alert needed
- watch = score 5.0-6.9, mild concern
- at_risk = score 3.0-4.9, set alert_message
- breached = score below 3.0, set alert_message
- Only adjust score by max 1.5 points per evaluation unless context is dramatic`;

  const user = `Assumption: ${assumption.assumption_text}
Current: ${assumption.health_score}/10 (${assumption.status})
Context: ${marketContext}

Return updated health score and status.`;

  const raw = await callGroq(system, user, 0.4);
  return JSON.parse(raw) as AssumptionUpdateResponse;
}
