import { createClient } from "@supabase/supabase-js";

// Service role: bypassa la Row Level Security. Va usato SOLO lato server per
// operazioni che devono vedere/scrivere dati non legati a una sessione utente
// (iscritti alla newsletter, invio, disiscrizione) — mai esposto al client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
