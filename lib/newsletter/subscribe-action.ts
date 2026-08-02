"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const { t } = getDictionary();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: t.shared.newsletterForm.invalidEmailError };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  // 23505 = unique_violation: già iscritto — trattiamolo come un successo
  // silenzioso, non serve dirlo a chi prova a iscriversi due volte.
  if (error && error.code !== "23505") {
    return { status: "error", message: t.shared.newsletterForm.genericError };
  }

  return { status: "success", message: t.shared.newsletterForm.successMessage };
}
