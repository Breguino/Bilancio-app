import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { FileInputButton } from "@/components/file-input-button";
import { addContact, deleteContact, importContacts } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/components/page-header";
import { Search, X } from "lucide-react";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; error?: string; success?: string };
}) {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });

  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: contacts }, { data: transactions }, { data: dueNotes }] = await Promise.all([
    supabase.from("contacts").select("*").order("name", { ascending: true }),
    supabase
      .from("transactions")
      .select("contact_id, amount")
      .is("deleted_at", null)
      .not("contact_id", "is", null),
    supabase.from("contact_notes").select("contact_id").eq("done", false).lte("remind_at", today),
  ]);

  const query = searchParams.q?.trim() || "";
  const tutti = contacts || [];
  // Con una rubrica lunga scorrere e' l'unico modo per trovare qualcuno:
  // qui il nome si cerca, e la ricerca resta nell'indirizzo.
  const rows = query ? tutti.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())) : tutti;

  // Le iniziali al posto del pallino vuoto: in un elenco di nomi si riconosce
  // la riga giusta prima di leggerla.
  const iniziali = (nome: string) =>
    nome
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase();
  const revenueByContact = new Map<string, number>();
  (transactions || []).forEach((t) => {
    if (t.amount > 0 && t.contact_id) {
      revenueByContact.set(t.contact_id, (revenueByContact.get(t.contact_id) || 0) + Number(t.amount));
    }
  });
  const dueCountByContact = new Map<string, number>();
  (dueNotes || []).forEach((n) => {
    dueCountByContact.set(n.contact_id, (dueCountByContact.get(n.contact_id) || 0) + 1);
  });

  return (
    <div className="flex flex-col gap-6">
      <Toast message={searchParams.success} />
      <PageHeader
        eyebrow={t.contacts.crmEyebrow}
        title={t.contacts.title}
        subtitle={`${t.contacts.visibleOnlyToYouPre} ${tutti.length} ${
          tutti.length === 1 ? t.contacts.contactSingular : t.contacts.contactPlural
        }.`}
        actionLabel={t.contacts.newAction}
        panelTitle={t.contacts.newContactTitle}
        closeLabel={t.common.closeAction}
        panel={
          <>
            <div className="mb-4">
              <ErrorBanner message={searchParams.error} />
            </div>
      <form action={addContact} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.contacts.nameLabel}</label>
          <input
            name="name"
            required
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.contacts.emailLabel}</label>
          <input
            name="email"
            type="email"
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.contacts.phoneLabel}</label>
          <input
            name="phone"
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.contacts.notesLabel}</label>
          <input
            name="notes"
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <SubmitButton
          pendingText={t.contacts.addingPending}
          className="sm:col-span-4 sm:w-fit bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
        >
          {t.contacts.addSubmit}
        </SubmitButton>
      </form>

      <div className="mt-5 pt-5 border-t border-border dark:border-neutral-800">
        <form action={importContacts}>
          <FileInputButton
            name="file"
            accept=".csv,text/csv"
            required
            title={t.contacts.importTitle}
            importingLabel={t.shared.fileInput.importingLabel}
            importLabel={t.shared.fileInput.importLabel}
          />
        </form>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mt-2">
          {t.contacts.importHint}
        </p>
      </div>
          </>
        }
        defaultOpen={Boolean(searchParams.error)}
      />

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <form method="get" className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border dark:border-neutral-800 text-ink-muted dark:text-neutral-500">
          <Search size={16} strokeWidth={1.9} aria-hidden="true" />
          <input
            name="q"
            defaultValue={query}
            placeholder={t.contacts.searchPlaceholder}
            aria-label={t.contacts.searchPlaceholder}
            className="w-full bg-transparent text-sm text-ink dark:text-neutral-100 focus:outline-none"
          />
        </form>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">
            {query ? t.contacts.noSearchResults : t.contacts.emptyState}
          </p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800">
            {rows.map((c) => {
              const revenue = revenueByContact.get(c.id) || 0;
              const dueCount = dueCountByContact.get(c.id) || 0;
              return (
                <div key={c.id} className="flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-4">
                  <div className="min-w-0 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-surface-alt dark:bg-neutral-800 text-ink-secondary dark:text-neutral-400 flex items-center justify-center text-[13px] font-bold shrink-0"
                    >
                      {iniziali(c.name)}
                    </span>
                    <div className="min-w-0">
                    <Link href={`/contacts/${c.id}`} className="font-semibold truncate hover:text-accent block">
                      {c.name}
                    </Link>
                    <p className="text-ink-muted dark:text-neutral-500 text-xs truncate">
                      {[c.email, c.phone].filter(Boolean).join(" · ") || t.contacts.noContactInfo}
                    </p>
                    {c.notes ? (
                      <p className="text-ink-secondary dark:text-neutral-400 text-xs mt-0.5 truncate">{c.notes}</p>
                    ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {dueCount > 0 ? (
                      <span
                        className="text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-full px-2.5 py-1"
                        title={t.contacts.dueRemindersTitle}
                      >
                        {dueCount} {dueCount === 1 ? t.contacts.reminderSingular : t.contacts.reminderPlural}
                      </span>
                    ) : null}
                    {revenue > 0 ? (
                      <span
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-full px-2.5 py-1 num"
                        title={t.contacts.totalRevenueTitle}
                      >
                        {eur.format(revenue)}
                      </span>
                    ) : null}
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmButton
                        confirmMessage={t.contacts.deleteConfirmTemplate.replace("{name}", c.name)}
                        confirmLabel={t.common.deleteAction}
                        cancelLabel={t.common.cancelAction}
                        ariaLabel={t.contacts.deleteAriaLabel}
                        className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        <X size={14} strokeWidth={2.2} />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
