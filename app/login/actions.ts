"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-redirect";
import { authErrorCode } from "@/lib/auth/auth-error";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = safeNext(String(formData.get("next") || "/dashboard"));

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${authErrorCode(error)}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}
