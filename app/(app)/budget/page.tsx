import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { PageHeader } from "@/components/page-header";
import { MonthStepper } from "@/components/month-stepper";
import { setBudget, deleteBudget } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { monthBounds, monthKeyOf, monthLabel, monthName, resolveMonth } from "@/lib/month";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: { month?: string; error?: string; success?: string };
}) {
  const { locale, t } = getDictionary();
  const intlLocale = locale === "it" ? "it-IT" : "en-IE";
  const eur = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const pct1 = (n: number) =>
    n.toLocaleString(intlLocale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

  const currentMonth = monthKeyOf();
  const month = resolveMonth(searchParams.month, currentMonth);
  const isCurrentMonth = month === currentMonth;
  const { start, end } = monthBounds(month);

  const supabase = createClient();

  const [{ data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from("budgets").select("*").order("category"),
    supabase.from("transactions").select("*").is("deleted_at", null).gte("date", start).lte("date", end),
  ]);

  const rows = transactions || [];
  const budgetRows = budgets || [];
  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);

  const spendByCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const key = t.category || "Senza categoria";
      spendByCategory.set(key, (spendByCategory.get(key) || 0) - Number(t.amount));
    });

  const totalAssigned = budgetRows.reduce((s, b) => s + Number(b.monthly_limit), 0);
  const remaining = income - totalAssigned;
  const assignedPct = income > 0 ? Math.min(100, (totalAssigned / income) * 100) : 0;

  const ratioed = budgetRows
    .map((b) => {
      const limit = Number(b.monthly_limit);
      const spend = spendByCategory.get(b.category) || 0;
      return { id: b.id, category: b.category, limit, spend, ratio: limit > 0 ? spend / limit : 0 };
    })
    .sort((a, b) => b.ratio - a.ratio);

  const hrefFor = (m: string) => (m === currentMonth ? "/budget" : `/budget?month=${m}`);

  const addPanel = (
    <>
      <div className="mb-4">
        <ErrorBanner message={searchParams.error} />
      </div>
      <form action={setBudget} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.budget.categoryLabel}</label>
          <input
            name="category"
            required
            placeholder={t.budget.categoryPlaceholder}
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.budget.monthlyLimitLabel}</label>
          <input
            name="monthly_limit"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <SubmitButton
          pendingText={t.budget.savingPending}
          className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors sm:w-fit"
        >
          {t.budget.save}
        </SubmitButton>
      </form>
      <p className="text-xs text-ink-muted dark:text-neutral-500 mt-2.5">{t.budget.upsertHint}</p>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <Toast message={searchParams.success} />

      <PageHeader
        eyebrow={t.appShell.navBudget}
        title={t.budget.title}
        controls={
          <MonthStepper
            month={month}
            label={monthLabel(month, intlLocale)}
            hrefFor={hrefFor}
            prevLabel={t.common.monthPrev}
            nextLabel={t.common.monthNext}
            maxMonth={currentMonth}
          />
        }
        actionLabel={t.budget.newCategoryAction}
        panelTitle={t.budget.setBudgetTitle}
        closeLabel={t.common.closeAction}
        panel={addPanel}
        defaultOpen={Boolean(searchParams.error)}
      />

      <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <span className="text-sm text-ink-secondary dark:text-neutral-400">
          {t.budget.assignedPre}{" "}
          <strong className="num text-ink dark:text-neutral-100">{eur.format(totalAssigned)}</strong>{" "}
          {t.budget.assignedOf}{" "}
          <strong className="num text-ink dark:text-neutral-100">{eur.format(income)}</strong>{" "}
          {t.budget.assignedIncome} {monthName(month, intlLocale)}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-surface-alt dark:bg-neutral-800 max-w-xs">
          <div
            className={`bar-fill h-full rounded-full ${remaining < 0 ? "bg-red-500" : "bg-accent"}`}
            style={{ width: `${assignedPct}%` }}
          />
        </div>
        <span
          className={`num text-sm font-semibold ${remaining < 0 ? "text-red-600" : "text-ink dark:text-neutral-100"}`}
        >
          {remaining < 0
            ? `${eur.format(Math.abs(remaining))} ${t.budget.overIncome}`
            : `${eur.format(remaining)} ${t.budget.toAssign}`}
        </span>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
        {ratioed.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">{t.budget.emptyState}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {ratioed.map((c) => {
              const fillPct = Math.min(100, c.ratio * 100);
              const over = c.ratio >= 1;
              const warn = !over && c.ratio >= 0.8;
              const left = c.limit - c.spend;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5 gap-2">
                    <span className="font-medium truncate">{c.category}</span>
                    <span className="num shrink-0">
                      {eur.format(c.spend)}{" "}
                      <span className="text-ink-muted dark:text-neutral-500">/ {eur.format(c.limit)}</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`bar-fill h-full rounded ${
                        over ? "bg-red-500" : warn ? "bg-amber-500" : "bg-accent"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-1.5">
                    <span
                      className={`text-xs ${
                        over
                          ? "text-red-600 dark:text-red-400 font-semibold"
                          : warn
                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-ink-muted dark:text-neutral-500"
                      }`}
                    >
                      {over
                        ? `${pct1((c.ratio - 1) * 100)} ${t.budget.overBudgetSuffix}`
                        : `${pct1(c.ratio * 100)} ${t.budget.ofBudgetSuffix}`}
                    </span>
                    <span className="flex items-center gap-3 shrink-0">
                      {/* Quanto resta e' il numero che si va a cercare: prima
                          bisognava fare la sottrazione a mente. */}
                      {left > 0 ? (
                        <span className="text-xs text-ink-muted dark:text-neutral-500 num">
                          {t.budget.remainingShort} {eur.format(left)}
                        </span>
                      ) : null}
                      <form action={deleteBudget}>
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmButton
                          confirmMessage={t.budget.removeConfirmTemplate.replace("{category}", c.category)}
                          confirmLabel={t.common.deleteAction}
                          cancelLabel={t.common.cancelAction}
                          ariaLabel={t.budget.removeAriaLabel}
                          className="text-ink-muted dark:text-neutral-500 hover:text-red-600 text-xs"
                        >
                          {t.budget.remove}
                        </ConfirmButton>
                      </form>
                    </span>
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
