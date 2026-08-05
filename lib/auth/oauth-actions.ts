"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { track } from "@vercel/analytics/server";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const origin = headers().get("origin");
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message || "Accesso con Google non disponibile")}`);
  }

  await track("google_auth_started");
  redirect(data.url);
}
