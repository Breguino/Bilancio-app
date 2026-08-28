import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ErrorBanner } from "@/components/error-banner";
import { Toast } from "@/components/toast";
import { ConfirmButton } from "@/components/confirm-button";
import { NewsletterDraftForm } from "@/components/newsletter-draft-form";
import { saveDraft, sendNow, deleteDraft } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site-url";

export default async function NewsletterAdminPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string; draft?: string };
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

  const [{ data: drafts }, { count: subscriberCount }, { data: sentIssues }] = await Promise.all([
    admin
      .from("newsletter_issues")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false }),
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

  const isNew = searchParams.draft === "new" || !drafts || drafts.length === 0;
  const selectedDraft = isNew ? null : drafts!.find((d) => d.id === searchParams.draft) ?? drafts![0];

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
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="font-bold">{t.newsletterAdmin.draftTitle}</h2>
          <Link
            href="/newsletter?draft=new"
            className="text-xs font-semibold text-accent hover:underline shrink-0"
          >
            {t.newsletterAdmin.newDraftAction}
          </Link>
        </div>

        {drafts && drafts.length > 0 ? (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {drafts.map((d) => (
              <Link
                key={d.id}
                href={`/newsletter?draft=${d.id}`}
                className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors truncate max-w-[200px] ${
                  selectedDraft?.id === d.id
                    ? "bg-accent text-white border-accent"
                    : "border-border dark:border-neutral-700 text-ink-secondary dark:text-neutral-400 hover:border-accent hover:text-accent"
                }`}
              >
                {d.subject || t.newsletterAdmin.untitledDraft}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <NewsletterDraftForm
          key={selectedDraft?.id || "new"}
          action={saveDraft}
          draftId={selectedDraft?.id || ""}
          initialSubject={selectedDraft?.subject || ""}
          initialBody={selectedDraft?.body_html || ""}
          siteUrl={SITE_URL}
          labels={{
            subjectLabel: t.newsletterAdmin.subjectLabel,
            bodyLabel: t.newsletterAdmin.bodyLabel,
            previewTab: t.newsletterAdmin.previewTab,
            editTab: t.newsletterAdmin.editTab,
            previewSubjectPrefix: t.newsletterAdmin.previewSubjectPrefix,
            previewEmptyState: t.newsletterAdmin.previewEmptyState,
            savingPending: t.newsletterAdmin.savingPending,
            saveDraft: t.newsletterAdmin.saveDraft,
            unsubscribePrompt: t.newsletterAdmin.unsubscribePrompt,
            unsubscribeLinkText: t.newsletterAdmin.unsubscribeLinkText,
            ctaLabel: t.newsletterAdmin.emailCtaLabel,
            novitaPrompt: t.newsletterAdmin.emailNovitaPrompt,
            novitaLinkText: t.newsletterAdmin.emailNovitaLinkText,
          }}
        />

        {selectedDraft ? (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <form action={sendNow}>
              <input type="hidden" name="id" value={selectedDraft.id} />
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
            <form action={deleteDraft}>
              <input type="hidden" name="id" value={selectedDraft.id} />
              <ConfirmButton
                confirmMessage={t.newsletterAdmin.deleteDraftConfirmMessage}
                confirmLabel={t.newsletterAdmin.deleteDraftConfirmLabel}
                cancelLabel={t.common.cancelAction}
                ariaLabel={t.newsletterAdmin.deleteDraftAriaLabel}
                className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-4 py-2 text-red-600 dark:text-red-400 hover:border-red-400 transition-colors"
              >
                {t.newsletterAdmin.deleteDraftAction}
              </ConfirmButton>
            </form>
          </div>
        ) : null}
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
