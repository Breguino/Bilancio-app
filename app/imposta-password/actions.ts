"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorCode } from "@/lib/auth/auth-error";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function updatePassword(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/reset-password?error=expired_link");
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (password.length < 6) {
    redirect("/imposta-password?error=password_too_short");
  }
  if (password !== confirmPassword) {
    redirect("/imposta-password?error=password_mismatch");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/imposta-password?error=" + authErrorCode(error));
  }

  redirect("/dashboard?success=" + encodeURIComponent(t.auth.setPassword.successToast));
}
