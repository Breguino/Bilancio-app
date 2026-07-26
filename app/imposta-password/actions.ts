"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/reset-password?error=Il+link+è+scaduto+o+non+è+più+valido.+Richiedine+uno+nuovo.");
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (password.length < 6) {
    redirect("/imposta-password?error=" + encodeURIComponent("La password deve avere almeno 6 caratteri."));
  }
  if (password !== confirmPassword) {
    redirect("/imposta-password?error=" + encodeURIComponent("Le due password non coincidono."));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/imposta-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard?success=" + encodeURIComponent("Password aggiornata"));
}
