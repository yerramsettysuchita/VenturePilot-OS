import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    _client = createClient(url, key);
  }
  return _client;
}

// Convenience alias for components that import `supabase` directly
export const supabase = {
  from: (...args: Parameters<SupabaseClient["from"]>) => getSupabase().from(...args),
  channel: (...args: Parameters<SupabaseClient["channel"]>) => getSupabase().channel(...args),
  removeChannel: (...args: Parameters<SupabaseClient["removeChannel"]>) => getSupabase().removeChannel(...args),
};
