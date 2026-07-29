"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Inserisci un'email valida." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  // 23505 = unique_violation: già iscritto — trattiamolo come un successo
  // silenzioso, non serve dirlo a chi prova a iscriversi due volte.
  if (error && error.code !== "23505") {
    return { status: "error", message: "Qualcosa è andato storto. Riprova." };
  }

  return { status: "success", message: "Iscrizione confermata, grazie!" };
}
