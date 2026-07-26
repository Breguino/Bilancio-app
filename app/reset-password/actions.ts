"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const origin = headers().get("origin");

  if (email) {
    const supabase = createClient();
    // Non controlliamo né segnaliamo l'esito: rispondere diversamente a seconda
    // che l'email esista rivelerebbe quali indirizzi hanno un account (user
    // enumeration). Mostriamo sempre lo stesso messaggio di conferma.
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/imposta-password`,
    });
  }

  redirect("/reset-password?sent=1");
}
