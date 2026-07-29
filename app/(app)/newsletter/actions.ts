"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDraftNewsletter } from "@/lib/newsletter/send";

async function assertOwner() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ownerEmail = process.env.NEWSLETTER_ADMIN_EMAIL?.toLowerCase();
  if (!user || !ownerEmail || user.email?.toLowerCase() !== ownerEmail) {
    redirect("/dashboard");
  }
}

export async function saveDraft(formData: FormData) {
  await assertOwner();

  const subject = String(formData.get("subject") || "").trim();
  const bodyHtml = String(formData.get("body_html") || "").trim();
  const id = String(formData.get("id") || "").trim();

  if (!subject || !bodyHtml) {
    redirect("/newsletter?error=" + encodeURIComponent("Scrivi oggetto e testo prima di salvare."));
  }

  const admin = createAdminClient();
  if (id) {
    await admin
      .from("newsletter_issues")
      .update({ subject, body_html: bodyHtml })
      .eq("id", id)
      .eq("status", "draft");
  } else {
    await admin.from("newsletter_issues").insert({ subject, body_html: bodyHtml });
  }

  revalidatePath("/newsletter");
  redirect("/newsletter?success=" + encodeURIComponent("Bozza salvata"));
}

export async function sendNow() {
  await assertOwner();

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://bilancino-app.vercel.app";
  const result = await sendDraftNewsletter(origin);

  revalidatePath("/newsletter");

  if (result.reason === "error") {
    redirect(
      "/newsletter?error=" +
        encodeURIComponent(`Resend ha rifiutato l'invio: ${result.error}`)
    );
  }

  const message =
    result.reason === "no_draft"
      ? "Nessuna bozza pronta da inviare."
      : result.reason === "no_subscribers"
      ? "Nessun iscritto a cui inviare."
      : result.failed > 0
      ? `Inviata a ${result.sent} iscritti (${result.failed} saltati, non consegnabili).`
      : `Inviata a ${result.sent} iscritti.`;

  redirect("/newsletter?success=" + encodeURIComponent(message));
}
