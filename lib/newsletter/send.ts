import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, NEWSLETTER_FROM } from "@/lib/resend";

const BATCH_SIZE = 100;

export type SendResult =
  | { reason: "no_draft"; sent: 0 }
  | { reason: "no_subscribers"; sent: 0 }
  | { reason: "error"; sent: number; error: string }
  | { reason: "ok"; sent: number; failed: number };

// Prende la bozza più recente e la manda a tutti gli iscritti attivi. Usata
// sia dal cron mensile che dal pulsante "Invia adesso" nella pagina admin.
export async function sendDraftNewsletter(siteUrl: string): Promise<SendResult> {
  const supabase = createAdminClient();

  const { data: issue } = await supabase
    .from("newsletter_issues")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!issue || !issue.subject?.trim() || !issue.body_html?.trim()) {
    return { reason: "no_draft", sent: 0 };
  }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .is("unsubscribed_at", null);

  if (!subscribers || subscribers.length === 0) {
    return { reason: "no_subscribers", sent: 0 };
  }

  const resend = getResendClient();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const emails = batch.map((s) => ({
      from: NEWSLETTER_FROM,
      to: s.email,
      subject: issue.subject,
      html: `${issue.body_html}<p style="margin-top:32px;font-size:12px;color:#8b8c94">Non vuoi più ricevere questa newsletter? <a href="${siteUrl}/api/newsletter/unsubscribe?token=${s.unsubscribe_token}">Disiscriviti</a>.</p>`,
    }));

    // batchValidation "permissive": se un destinatario non è consegnabile
    // (tipico in modalità sandbox senza dominio verificato, o un indirizzo
    // che rimbalza in produzione) gli altri vengono comunque inviati invece
    // di far fallire l'intero gruppo — con "strict" (il default) bastava un
    // solo destinatario problematico per bloccare tutti.
    const { data, error } = await resend.batch.send(emails, { batchValidation: "permissive" });

    if (error) {
      return { reason: "error", sent, error: error.message };
    }

    const batchFailed = data?.errors?.length ?? 0;
    failed += batchFailed;
    sent += batch.length - batchFailed;
  }

  if (sent === 0) {
    return { reason: "error", sent: 0, error: "Nessun destinatario consegnabile (controlla la modalità sandbox di Resend)." };
  }

  await supabase
    .from("newsletter_issues")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", issue.id);

  return { reason: "ok", sent, failed };
}
