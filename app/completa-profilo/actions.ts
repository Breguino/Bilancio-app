"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidBirthDate, isAdult } from "@/lib/profile";

export async function completeProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();

  if (!firstName || !lastName || !birthDate) {
    redirect("/completa-profilo?error=missing_fields");
  }

  if (!isValidBirthDate(birthDate)) {
    redirect("/completa-profilo?error=invalid_birth_date");
  }

  if (!isAdult(birthDate)) {
    redirect("/completa-profilo?error=too_young");
  }

  // La riga esiste già (la crea il trigger alla nascita dell'utente), ma usiamo
  // upsert per non dipendere da quell'ordine: se per qualsiasi motivo mancasse,
  // qui viene creata invece di fallire in silenzio.
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect("/completa-profilo?error=save_failed");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
