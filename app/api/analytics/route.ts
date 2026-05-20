import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  try {
    const { event_type, session_id, properties } = await request.json();

    await getSupabaseAdmin().from("analytics_events").insert([{
      event_type,
      session_id: session_id ?? null,
      properties: properties ?? {},
    }]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
