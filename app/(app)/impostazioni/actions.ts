"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isCurrency } from "@/lib/currency";

// La valuta dell'account. Non converte niente: cambia solo come vengono
// scritti gli importi, ovunque nell'app. Il valore viene da un elenco chiuso e
// si controlla di nuovo qui, perché un <select> non è una garanzia: la stessa
// richiesta si può rifare a mano con qualunque valore dentro.
export async function setCurrency(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const scelta = String(formData.get("currency") || "");
  if (!isCurrency(scelta)) {
    redirect("/impostazioni?error=" + encodeURIComponent(t.impostazioni.currencyInvalidError));
  }

  const { error } = await supabase
    .from("profiles")
    .update({ currency: scelta })
    .eq("user_id", user.id);

  if (error) {
    redirect("/impostazioni?error=" + encodeURIComponent(t.common.actionFailedError));
  }

  // Ogni schermata dell'app scrive importi: dopo il cambio vanno tutte
  // ridisegnate, non solo questa.
  revalidatePath("/", "layout");
  redirect("/impostazioni?success=1");
}

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
