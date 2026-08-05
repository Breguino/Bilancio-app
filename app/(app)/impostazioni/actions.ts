"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// Ogni tabella con dati dell'utente ha user_id con "on delete cascade" verso
// auth.users (vedi supabase/schema.sql): eliminare l'utente con l'admin API
// basta a far sparire in automatico movimenti, budget, obiettivi, contatti,
// note e ricorrenze — non serve cancellarli uno per uno a mano.
export async function deleteAccount() {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    redirect("/impostazioni?error=" + encodeURIComponent(t.impostazioni.deleteFailedError));
  }

  await supabase.auth.signOut();
  redirect("/");
}
