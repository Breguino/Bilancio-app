import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, NEWSLETTER_FROM } from "@/lib/resend";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildReminderEmailHtml } from "@/lib/reminders/email-template";

export type ReminderSendResult = {
  usersNotified: number;
  remindersSent: number;
};

// Gira una volta al giorno (cron): trova i promemoria dei contatti che
// scadono oggi ed effettua un solo invio per utente, anche se ne ha più di
// uno in scadenza lo stesso giorno. Manda l'email una sola volta, il giorno
// esatto della scadenza — non ripete l'invio nei giorni successivi se il
// promemoria resta "scaduto" e non segnato come fatto, per non diventare una
// notifica ripetitiva: il promemoria resta comunque visibile in app.
export async function sendDueReminders(siteUrl: string): Promise<ReminderSendResult> {
  const { t } = getDictionary();
  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: dueNotes } = await supabase
    .from("contact_notes")
    .select("*, contact:contacts(name)")
    .eq("done", false)
    .eq("remind_at", today);

  if (!dueNotes || dueNotes.length === 0) {
    return { usersNotified: 0, remindersSent: 0 };
  }

  const byUser = new Map<string, typeof dueNotes>();
  for (const note of dueNotes) {
    const list = byUser.get(note.user_id) || [];
    list.push(note);
    byUser.set(note.user_id, list);
  }

  const resend = getResendClient();
  let usersNotified = 0;

  for (const [userId, notes] of byUser) {
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const email = userData?.user?.email;
    if (!email) continue;

    const reminders = notes.map((n) => ({
      contactName: n.contact?.name || t.dashboard.contactFallback,
      note: n.note as string,
      href: `/contacts/${n.contact_id}`,
    }));

    const { error } = await resend.emails.send({
      from: NEWSLETTER_FROM,
      to: email,
      subject:
        reminders.length === 1
          ? t.reminderEmail.subjectSingular
          : t.reminderEmail.subjectPluralTemplate.replace("{count}", String(reminders.length)),
      html: buildReminderEmailHtml({
        siteUrl,
        greeting: t.reminderEmail.greeting,
        intro:
          reminders.length === 1
            ? t.reminderEmail.introSingular
            : t.reminderEmail.introPluralTemplate.replace("{count}", String(reminders.length)),
        ctaLabel: t.reminderEmail.ctaLabel,
        reminders,
      }),
    });

    if (!error) usersNotified++;
  }

  return { usersNotified, remindersSent: dueNotes.length };
}
