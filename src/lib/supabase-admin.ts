import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for the marketing site.
 *
 * The marketing site handles flows (apply form, agreement signing, peptalk
 * booking) where the user is NOT authenticated in the Supabase session sense.
 * We write on their behalf using the service role key and verify their
 * identity out-of-band (LemonSqueezy checkout lookups, signed onboarding cookies).
 *
 * NEVER expose this client to the browser. NEVER import this from a client
 * component. Only server actions, route handlers, and server components.
 */
let _admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Set these in your environment (Vercel + .env.local).",
    );
  }

  _admin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _admin;
}
