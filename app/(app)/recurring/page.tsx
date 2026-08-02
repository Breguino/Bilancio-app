import { createClient } from "@/lib/supabase/server";
import { generateDueRecurringTransactions } from "@/lib/recurring";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addRecurring, deleteRecurring, toggleRecurring } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function RecurringPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const frequencyLabels: Record<string, string> = {
    weekly: t.recurring.frequencyWeekly,
    monthly: t.recurring.frequencyMonthly,
    yearly: t.recurring.frequencyYearly,
  };

  const supabase = createClient();
  await generateDueRecurringTransactions(supabase);

  const [{ data: recurring }, { data: contacts }] = await Promise.all([
    supabase
      .from("recurring_transactions")
      .select("*, contact:contacts(id, name)")
      .order("next_date", { ascending: true }),
    supabase.from("contacts").select("id, name").order("name"),
  ]);

  const rows = recurring || [];
  const contactList = contacts || [];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          {t.recurring.automationsEyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.recurring.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          {t.recurring.subtitle}
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">{t.recurring.newTitle}</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={addRecurring} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.descriptionLabel}</label>
            <input
              name="description"
              required
              placeholder={t.recurring.descriptionPlaceholder}
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.typeLabel}</label>
            <select
              name="type"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="expense">{t.recurring.expenseOption}</option>
              <option value="income">{t.recurring.incomeOption}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.categoryLabel}</label>
            <input
              name="category"
              placeholder={t.recurring.categoryPlaceholder}
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.contactLabel}</label>
            <select
              name="contact_id"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">{t.recurring.noneOption}</option>
              {contactList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.amountLabel}</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.frequencyLabel}</label>
            <select
              name="frequency"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="monthly">{t.recurring.frequencyMonthly}</option>
              <option value="weekly">{t.recurring.frequencyWeekly}</option>
              <option value="yearly">{t.recurring.frequencyYearly}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.startDateLabel}</label>
            <input
              name="start_date"
              type="date"
              defaultValue={today}
              required
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.recurring.endDateLabel}</label>
            <input
              name="end_date"
              type="date"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <SubmitButton
            pendingText={t.recurring.addingPending}
            className="sm:col-span-6 sm:w-fit bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            {t.recurring.addSubmit}
          </SubmitButton>
        </form>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="px-5 pt-5">
          <h2 className="font-bold">{t.recurring.activeListTitle}</h2>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">{t.recurring.emptyState}</p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800 mt-3">
            {rows.map((r: any) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                  <span className="truncate font-medium">{r.description}</span>
                  {r.category ? (
                    <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5 shrink-0">
                      {r.category}
                    </span>
                  ) : null}
                  {r.contact ? (
                    <span className="text-xs text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0">
                      {r.contact.name}
                    </span>
                  ) : null}
                  <span className="text-xs text-ink-muted dark:text-neutral-500 shrink-0">
                    {frequencyLabels[r.frequency] || r.frequency} · {t.recurring.nextPrefix}: {r.next_date.slice(8, 10)}/
                    {r.next_date.slice(5, 7)}/{r.next_date.slice(0, 4)}
                  </span>
                  {!r.active ? (
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-full px-2 py-0.5 shrink-0">
                      {t.recurring.paused}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`num font-semibold ${
                      r.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-neutral-100"
                    }`}
                  >
                    {r.amount > 0 ? "+" : "−"}
                    {eur.format(Math.abs(Number(r.amount)))}
                  </span>
                  <form action={toggleRecurring}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="active" value={String(r.active)} />
                    <button
                      type="submit"
                      className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                    >
                      {r.active ? t.recurring.pauseAction : t.recurring.resumeAction}
                    </button>
                  </form>
                  <form action={deleteRecurring}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmButton
                      confirmMessage={t.recurring.deleteConfirmTemplate.replace("{description}", r.description)}
                      confirmLabel={t.common.deleteAction}
                      cancelLabel={t.common.cancelAction}
                      ariaLabel={t.recurring.deleteAriaLabel}
                      className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-6 h-6 rounded"
                    >
                      ✕
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
