import { createClient } from "@/lib/supabase/server";
import { generateDueRecurringTransactions } from "@/lib/recurring";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addRecurring, deleteRecurring, toggleRecurring } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader } from "@/components/page-header";
import { X } from "lucide-react";

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

  const perMese = (r: any) => {
    const importo = Number(r.amount);
    if (r.frequency === "weekly") return (importo * 52) / 12;
    if (r.frequency === "yearly") return importo / 12;
    return importo;
  };
  const attive = rows.filter((r: any) => r.active);
  const usciteMese = attive.filter((r: any) => perMese(r) < 0).reduce((s: number, r: any) => s - perMese(r), 0);
  const entrateMese = attive.filter((r: any) => perMese(r) > 0).reduce((s: number, r: any) => s + perMese(r), 0);
  const quante = (n: number) =>
    n === 1 ? t.recurring.fromOneRule : t.recurring.fromNRules.replace("{n}", String(n));
  const nUscite = attive.filter((r: any) => perMese(r) < 0).length;
  const nEntrate = attive.filter((r: any) => perMese(r) > 0).length;
  // Le regole arrivano gia' ordinate per data: la prima attiva e' la prossima.
  const prossima = attive[0];

  const addPanel = (
    <>
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
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <Toast message={searchParams.success} />

      <PageHeader
        eyebrow={t.recurring.automationsEyebrow}
        title={t.recurring.title}
        subtitle={t.recurring.subtitle}
        actionLabel={t.recurring.newAction}
        panelTitle={t.recurring.newTitle}
        closeLabel={t.common.closeAction}
        panel={addPanel}
        defaultOpen={Boolean(searchParams.error)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.recurring.perMonthOut}</p>
          <p className="text-[22px] font-bold num">{eur.format(usciteMese)}</p>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">{quante(nUscite)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.recurring.perMonthIn}</p>
          <p className="text-[22px] font-bold num">{eur.format(entrateMese)}</p>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">{quante(nEntrate)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.recurring.nextUp}</p>
          <p className="text-[22px] font-bold truncate">{prossima ? prossima.description : t.recurring.none}</p>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">
            {prossima
              ? `${prossima.next_date.slice(8, 10)}/${prossima.next_date.slice(5, 7)}/${prossima.next_date.slice(0, 4)}`
              : t.recurring.noActiveRules}
          </p>
        </div>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-1">
          <h2 className="font-bold">{t.recurring.activeListTitle}</h2>
          <span className="text-xs text-ink-muted dark:text-neutral-500">{t.recurring.pauseHint}</span>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">{t.recurring.emptyState}</p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800 mt-3">
            {rows.map((r: any) => (
              <div
                key={r.id}
                className={`flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-3 ${
                  r.active ? "" : "opacity-60"
                }`}
              >
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
                  <form action={toggleRecurring} className="flex items-center">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="active" value={String(r.active)} />
                    <button
                      type="submit"
                      role="switch"
                      aria-checked={Boolean(r.active)}
                      aria-label={r.active ? t.recurring.pauseAction : t.recurring.resumeAction}
                      title={r.active ? t.recurring.pauseAction : t.recurring.resumeAction}
                      className={`relative w-10 h-[23px] rounded-full transition-colors shrink-0 ${
                        r.active ? "bg-accent" : "bg-border dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-[17px] h-[17px] rounded-full bg-white transition-[left] ${
                          r.active ? "left-[20px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </form>
                  <form action={deleteRecurring}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmButton
                      confirmMessage={t.recurring.deleteConfirmTemplate.replace("{description}", r.description)}
                      confirmLabel={t.common.deleteAction}
                      cancelLabel={t.common.cancelAction}
                      ariaLabel={t.recurring.deleteAriaLabel}
                      className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <X size={14} strokeWidth={2.2} />
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
