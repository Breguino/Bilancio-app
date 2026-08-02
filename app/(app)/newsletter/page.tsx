import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ErrorBanner } from "@/components/error-banner";
import { Toast } from "@/components/toast";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmButton } from "@/components/confirm-button";
import { saveDraft, sendNow } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function NewsletterAdminPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { locale, t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ownerEmail = process.env.NEWSLETTER_ADMIN_EMAIL?.toLowerCase();

  if (!user || !ownerEmail || user.email?.toLowerCase() !== ownerEmail) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const [{ data: draft }, { count: subscriberCount }, { data: sentIssues }] = await Promise.all([
    admin
      .from("newsletter_issues")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    admin
      .from("newsletter_issues")
      .select("id, subject, sent_at")
      .eq("status", "sent")
      .order("sent_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Toast message={searchParams.success} />
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.newsletterAdmin.title}</h1>
        <p className="text-sm text-ink-secondary dark:text-neutral-400 mt-1">
          {subscriberCount ?? 0} {t.newsletterAdmin.subscriberCountSuffix}
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">{t.newsletterAdmin.draftTitle}</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={saveDraft} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={draft?.id || ""} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.newsletterAdmin.subjectLabel}
            </label>
            <input
              name="subject"
              defaultValue={draft?.subject || ""}
              required
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.newsletterAdmin.bodyLabel}
            </label>
            <textarea
              name="body_html"
              defaultValue={draft?.body_html || ""}
              required
              rows={10}
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent font-mono"
            />
          </div>
          <div>
            <SubmitButton
              pendingText={t.newsletterAdmin.savingPending}
              className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
            >
              {t.newsletterAdmin.saveDraft}
            </SubmitButton>
          </div>
        </form>
        <form action={sendNow} className="mt-3">
          <ConfirmButton
            confirmMessage={t.newsletterAdmin.sendConfirmMessage}
            confirmLabel={t.newsletterAdmin.sendConfirmLabel}
            cancelLabel={t.common.cancelAction}
            ariaLabel={t.newsletterAdmin.sendAriaLabel}
            className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {t.newsletterAdmin.sendNow}
          </ConfirmButton>
        </form>
      </div>

      {sentIssues && sentIssues.length > 0 ? (
        <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
          <h2 className="font-bold mb-3">{t.newsletterAdmin.sentIssuesTitle}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {sentIssues.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3">
                <span className="truncate">{i.subject}</span>
                <span className="text-xs text-ink-muted dark:text-neutral-500 shrink-0">
                  {i.sent_at ? new Date(i.sent_at).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB") : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
