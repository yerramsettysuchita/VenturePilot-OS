import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "venturepilot2025";

export async function POST(request: NextRequest) {
  try {
    const { password, action, id, status } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getSupabaseAdmin();

    if (action === "get_waitlist") {
      const { data, error } = await db
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === "update_status" && id && status) {
      const { error } = await db
        .from("waitlist")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "get_analytics") {
      const { data: events } = await db
        .from("analytics_events")
        .select("event_type, properties")
        .order("created_at", { ascending: false })
        .limit(500);

      const total_simulations = events?.filter((e) => e.event_type === "simulation_run").length ?? 0;
      const total_signups = events?.filter((e) => e.event_type === "waitlist_signup").length ?? 0;

      return NextResponse.json({ success: true, data: { total_simulations, total_signups } });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
