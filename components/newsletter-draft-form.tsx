"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { buildNewsletterEmailHtml } from "@/lib/newsletter/email-template";
import { formatNewsletterBody } from "@/lib/newsletter/format-body";

// Prima il campo per il testo era solo una textarea HTML grezza, senza modo
// di vedere come sarebbe apparsa l'email finale (header colorato, immagine
// hero, tipografia) prima di inviarla davvero. Il tab "Anteprima" la
// renderizza con lo stesso template usato dall'invio reale.
export function NewsletterDraftForm({
  action,
  draftId,
  initialSubject,
  initialBody,
  siteUrl,
  labels,
}: {
  action: (formData: FormData) => void;
  draftId: string;
  initialSubject: string;
  initialBody: string;
  siteUrl: string;
  labels: {
    subjectLabel: string;
    bodyLabel: string;
    previewTab: string;
    editTab: string;
    previewSubjectPrefix: string;
    previewEmptyState: string;
    savingPending: string;
    saveDraft: string;
    unsubscribePrompt: string;
    unsubscribeLinkText: string;
    ctaLabel: string;
  };
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const previewHtml = body.trim()
    ? buildNewsletterEmailHtml({
        siteUrl,
        bodyHtml: formatNewsletterBody(body),
        unsubscribeUrl: "#",
        unsubscribePrompt: labels.unsubscribePrompt,
        unsubscribeLinkText: labels.unsubscribeLinkText,
        ctaLabel: labels.ctaLabel,
      })
    : "";

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={draftId} />

      <div className="flex items-center gap-1 border border-border dark:border-neutral-700 rounded-full p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`text-xs font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
            tab === "edit"
              ? "bg-accent text-white"
              : "text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
          }`}
        >
          {labels.editTab}
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`text-xs font-semibold rounded-full px-3.5 py-1.5 transition-colors ${
            tab === "preview"
              ? "bg-accent text-white"
              : "text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
          }`}
        >
          {labels.previewTab}
        </button>
      </div>

      <div className={tab === "edit" ? "flex flex-col gap-3" : "hidden"}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
            {labels.subjectLabel}
          </label>
          <input
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
            {labels.bodyLabel}
          </label>
          <textarea
            name="body_html"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={10}
            className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent font-mono"
          />
        </div>
      </div>

      {tab === "preview" ? (
        <div className="flex flex-col gap-2">
          {subject ? (
            <p className="text-sm">
              <span className="text-ink-muted dark:text-neutral-500">{labels.previewSubjectPrefix}</span>{" "}
              <span className="font-semibold">{subject}</span>
            </p>
          ) : null}
          {previewHtml ? (
            <iframe
              title={labels.previewTab}
              srcDoc={previewHtml}
              sandbox=""
              className="w-full h-[520px] rounded-xl border border-border dark:border-neutral-700 bg-white"
            />
          ) : (
            <p className="text-sm text-ink-muted dark:text-neutral-500 border border-dashed border-border dark:border-neutral-700 rounded-xl px-4 py-8 text-center">
              {labels.previewEmptyState}
            </p>
          )}
        </div>
      ) : null}

      <div>
        <SubmitButton
          pendingText={labels.savingPending}
          className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
        >
          {labels.saveDraft}
        </SubmitButton>
      </div>
    </form>
  );
}
