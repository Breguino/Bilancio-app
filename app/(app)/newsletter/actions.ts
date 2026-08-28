"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDraftNewsletter } from "@/lib/newsletter/send";
import { formatNewsletterBody } from "@/lib/newsletter/format-body";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site-url";

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
  const { t } = getDictionary();

  const subject = String(formData.get("subject") || "").trim();
  const bodyHtml = formatNewsletterBody(String(formData.get("body_html") || ""));
  const id = String(formData.get("id") || "").trim();

  if (!subject || !bodyHtml) {
    redirect("/newsletter?error=" + encodeURIComponent(t.newsletterAdmin.fieldsRequiredError));
  }

  const admin = createAdminClient();
  if (id) {
    const { error, count } = await admin
      .from("newsletter_issues")
      .update({ subject, body_html: bodyHtml }, { count: "exact" })
      .eq("id", id)
      .eq("status", "draft");

    if (error || count === 0) {
      redirect("/newsletter?error=" + encodeURIComponent(t.newsletterAdmin.draftNotFoundError));
    }

    revalidatePath("/newsletter");
    redirect(
      `/newsletter?draft=${id}&success=` + encodeURIComponent(t.newsletterAdmin.draftSavedToast)
    );
  }

  const { data: created } = await admin
    .from("newsletter_issues")
    .insert({ subject, body_html: bodyHtml })
    .select("id")
    .single();

  revalidatePath("/newsletter");
  redirect(
    `/newsletter?draft=${created?.id ?? ""}&success=` + encodeURIComponent(t.newsletterAdmin.draftSavedToast)
  );
}

export async function deleteDraft(formData: FormData) {
  await assertOwner();
  const { t } = getDictionary();
  const id = String(formData.get("id") || "").trim();

  const admin = createAdminClient();
  const { error, count } = await admin
    .from("newsletter_issues")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("status", "draft");

  revalidatePath("/newsletter");

  if (error || count === 0) {
    redirect("/newsletter?error=" + encodeURIComponent(t.newsletterAdmin.draftDeleteNotFoundError));
  }
  redirect("/newsletter?success=" + encodeURIComponent(t.newsletterAdmin.draftDeletedToast));
}

export async function sendNow(formData: FormData) {
  await assertOwner();
  const { t } = getDictionary();
  const id = String(formData.get("id") || "").trim();

  const origin = SITE_URL;
  const result = await sendDraftNewsletter(origin, id || undefined);

  revalidatePath("/newsletter");

  if (result.reason === "error") {
    redirect(
      "/newsletter?error=" +
        encodeURIComponent(t.newsletterAdmin.resendRejectedError.replace("{error}", result.error))
    );
  }

  const message =
    result.reason === "no_draft"
      ? t.newsletterAdmin.noDraftReady
      : result.reason === "no_subscribers"
      ? t.newsletterAdmin.noSubscribers
      : result.failed > 0
      ? t.newsletterAdmin.sentWithFailedTemplate
          .replace("{sent}", String(result.sent))
          .replace("{failed}", String(result.failed))
      : t.newsletterAdmin.sentTemplate.replace("{sent}", String(result.sent));

  redirect("/newsletter?success=" + encodeURIComponent(message));
}
