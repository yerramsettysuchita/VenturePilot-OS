import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rateLimit";
import { sendWaitlistConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 3, 60000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { full_name, email, founder_type, stage, biggest_challenge, startup_idea, team_size } = body;

    if (!email || !full_name) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const db = getSupabaseAdmin();

    // Check for duplicate
    const { data: existing } = await db
      .from("waitlist")
      .select("id, status")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, already_registered: true, status: existing.status });
    }

    const { data, error } = await db
      .from("waitlist")
      .insert([{ full_name, email, founder_type, stage, biggest_challenge, startup_idea, team_size, status: "pending" }])
      .select()
      .single();

    if (error) throw error;

    await db.from("analytics_events").insert([{
      event_type: "waitlist_signup",
      properties: { email, founder_type, stage },
    }]);

    // Send confirmation email (non-blocking — never fails the request)
    sendWaitlistConfirmation(email, full_name).catch(() => {});

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Waitlist error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
