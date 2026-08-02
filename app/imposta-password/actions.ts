"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function updatePassword(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/reset-password?error=" + encodeURIComponent(t.auth.resetPassword.linkExpiredError));
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (password.length < 6) {
    redirect("/imposta-password?error=" + encodeURIComponent(t.auth.setPassword.tooShortError));
  }
  if (password !== confirmPassword) {
    redirect("/imposta-password?error=" + encodeURIComponent(t.auth.setPassword.mismatchError));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/imposta-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard?success=" + encodeURIComponent(t.auth.setPassword.successToast));
}
