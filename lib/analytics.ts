export const track = async (
  event_type: string,
  properties: Record<string, unknown> = {},
  session_id?: string
) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type, session_id, properties }),
    });
  } catch {
    // Silent fail — analytics must never crash the app
  }
};
