import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { createExecutionBoard } from "@/lib/projecthub";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 3, 60000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { session_id, startup_idea, recommended_path } = body;

    if (!session_id || !recommended_path) {
      return NextResponse.json({ error: "session_id and recommended_path are required." }, { status: 400 });
    }

    const board = await createExecutionBoard(session_id, startup_idea ?? "", recommended_path);

    const db = getSupabaseAdmin();
    await db.from("venture_sessions").update({
      status: "executing",
      founder_context: { board_id: board.board_id, board_url: board.board_url },
      updated_at: new Date().toISOString(),
    }).eq("session_id", session_id);

    await db.from("analytics_events").insert([{
      event_type: "board_created",
      session_id,
      properties: { board_id: board.board_id, milestone_count: (board.milestones as unknown[]).length },
    }]);

    return NextResponse.json({ success: true, board_id: board.board_id, board_url: board.board_url, milestones: board.milestones });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
