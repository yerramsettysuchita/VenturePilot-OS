import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { generateAssumptionUpdate } from "@/lib/openrouter";
import { groqAssumptionUpdate } from "@/lib/groq";

// Groq is preferred — ~10x faster, ideal for the 30-min cron.
// Falls back to OpenRouter (Claude) if Groq fails.
async function smartAssumptionUpdate(
  assumption: { assumption_text: string; health_score: number; status: string; created_at: string },
  context: string
) {
  if (process.env.GROQ_API_KEY) {
    try {
      return await groqAssumptionUpdate(assumption, context);
    } catch (e) {
      console.warn("Groq failed, falling back to OpenRouter:", e);
    }
  }
  return generateAssumptionUpdate(assumption, context);
}

export const dynamic = "force-dynamic";

// Called two ways:
// 1. Cron (every 30 min) — Authorization: Bearer CRON_SECRET → updates ALL stale assumptions
// 2. UI (user clicks refresh) — body: { session_id } → updates only that session

export async function POST(request: NextRequest) {
  const db = getSupabaseAdmin();

  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

    const body = await request.json().catch(() => ({})) as { session_id?: string };
    const userSessionId = body.session_id;

    // --- UI-triggered: refresh one session's assumptions ---
    if (userSessionId && !isCron) {
      const { data: assumptions } = await db
        .from("assumptions")
        .select("*")
        .eq("session_id", userSessionId)
        .in("status", ["stable", "watch", "at_risk"]);

      if (!assumptions || assumptions.length === 0) {
        return NextResponse.json({ success: true, updated: 0 });
      }

      const updates = await processAssumptions(assumptions, db);
      return NextResponse.json({ success: true, updated: updates.length, updates });
    }

    // --- Cron-triggered: update all stale assumptions across all sessions ---
    if (!isCron && cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: assumptions } = await db
      .from("assumptions")
      .select("*")
      .lt("last_checked_at", thirtyMinutesAgo)
      .in("status", ["stable", "watch", "at_risk"])
      .limit(20);

    if (!assumptions || assumptions.length === 0) {
      return NextResponse.json({ success: true, updated: 0, message: "No assumptions need updating" });
    }

    const updates = await processAssumptions(assumptions, db);
    return NextResponse.json({ success: true, updated: updates.length, updates });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Monitor error";
    console.error("Monitor error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Support GET for easy Vercel cron testing
export async function GET(request: NextRequest) {
  return POST(request);
}

// ─── Core processor ──────────────────────────────────────────────────────────

type Assumption = {
  id: string;
  session_id: string;
  assumption_text: string;
  health_score: number;
  status: string;
  created_at: string;
};

async function processAssumptions(
  assumptions: Assumption[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any
): Promise<{ id: string; old_score: number; new_score: number; new_status: string }[]> {
  const updates: { id: string; old_score: number; new_score: number; new_status: string }[] = [];

  for (const assumption of assumptions) {
    try {
      const context = buildMarketContext(assumption);
      const update = await smartAssumptionUpdate(assumption, context);

      await db
        .from("assumptions")
        .update({
          health_score: update.new_health_score,
          status: update.new_status,
          alert_message: update.alert_message,
          last_checked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", assumption.id);

      // Log status changes to analytics
      if (update.new_status !== assumption.status) {
        try {
          await db.from("analytics_events").insert([{
            event_type: "assumption_status_changed",
            session_id: assumption.session_id,
            properties: {
              assumption_id: assumption.id,
              assumption_text: assumption.assumption_text.slice(0, 80),
              old_status: assumption.status,
              new_status: update.new_status,
              old_score: assumption.health_score,
              new_score: update.new_health_score,
            },
          }]);
        } catch {}
      }

      updates.push({
        id: assumption.id,
        old_score: assumption.health_score,
        new_score: update.new_health_score,
        new_status: update.new_status,
      });
    } catch (err) {
      // Never let one failed assumption block the rest
      console.error("Failed to update assumption:", assumption.id, err);
      continue;
    }
  }

  return updates;
}

// Builds a time-aware market context string so the AI has something meaningful to evaluate
function buildMarketContext(assumption: Assumption): string {
  const ageHours = (Date.now() - new Date(assumption.created_at).getTime()) / (1000 * 60 * 60);
  const score = assumption.health_score;
  const parts: string[] = [];

  if (ageHours > 168) {
    parts.push("This assumption is over a week old. Market conditions shift over time — apply realistic time-decay to confidence.");
  } else if (ageHours > 72) {
    parts.push("This assumption is a few days old. Consider mild uncertainty increase from market movement.");
  } else if (ageHours > 24) {
    parts.push("This assumption is about a day old. Slight confidence adjustment may be warranted.");
  } else {
    parts.push("This assumption was just created. Maintain current health unless there is a clear reason to adjust.");
  }

  if (score >= 8.5) {
    parts.push("Currently very healthy. Maintain or apply very minor decay only.");
  } else if (score >= 6.5) {
    parts.push("Moderately healthy. Small fluctuation is realistic.");
  } else if (score >= 4.5) {
    parts.push("Already in watch territory. Could stabilize or worsen based on assumption type.");
  } else {
    parts.push("Already at risk. Evaluate whether conditions have improved or worsened.");
  }

  parts.push("Evaluate based on typical startup market risk for this kind of assumption.");

  return parts.join(" ");
}
