import { NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-redirect";

// Copre sia il ritorno da Google OAuth sia il clic sul link di conferma email
// (signup o reset password): non c'è modo affidabile di distinguerli da qui,
// quindi l'evento resta genericamente "una conferma è andata a buon fine",
// utile comunque per vedere il tasso di completamento dopo google_auth_started.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next") ?? "/dashboard");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await track("auth_callback_completed");
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Link+di+conferma+non+valido+o+scaduto`);
}
