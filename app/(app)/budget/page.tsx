import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { setBudget, deleteBudget } from "./actions";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});
const pct1 = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

function monthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = createClient();
  const { start, end } = monthBounds();

  const [{ data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from("budgets").select("*").order("category"),
    supabase.from("transactions").select("*").gte("date", start).lte("date", end),
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

  const categories = budgetRows.map((b) => ({
    id: b.id,
    category: b.category,
    limit: Number(b.monthly_limit),
    spend: spendByCategory.get(b.category) || 0,
  }));
  const ratioed = categories
    .map((c) => ({ ...c, ratio: c.limit > 0 ? c.spend / c.limit : 0 }))
    .sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          Questo mese
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Categorie e budget</h1>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <span className="text-sm text-ink-secondary dark:text-neutral-400">
          Budget assegnato:{" "}
          <strong className="num text-ink dark:text-neutral-100">{eur.format(totalAssigned)}</strong> di{" "}
          <strong className="num text-ink dark:text-neutral-100">{eur.format(income)}</strong> entrate
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
            ? `${eur.format(Math.abs(remaining))} oltre le entrate`
            : `${eur.format(remaining)} da assegnare`}
        </span>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">Imposta budget</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={setBudget} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Categoria</label>
            <input
              name="category"
              required
              placeholder="Es. Casa"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Limite mensile (€)</label>
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
            pendingText="Salvo…"
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors sm:w-fit"
          >
            Salva
          </SubmitButton>
        </form>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mt-2">
          Se la categoria esiste già, il limite viene aggiornato.
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
        {ratioed.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">
            Nessun budget impostato ancora — aggiungine uno sopra.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {ratioed.map((c) => {
              const fillPct = Math.min(100, c.ratio * 100);
              const over = c.ratio >= 1;
              const warn = !over && c.ratio >= 0.8;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{c.category}</span>
                    <span className="num">
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
                  <div className="flex items-center justify-between mt-1">
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
                        ? `⚠ ${pct1((c.ratio - 1) * 100)} oltre budget`
                        : `${pct1(c.ratio * 100)} del budget`}
                    </span>
                    <form action={deleteBudget}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmButton
                        confirmMessage={`Rimuovere il budget per "${c.category}"?`}
                        ariaLabel="Rimuovi budget"
                        className="text-ink-muted dark:text-neutral-500 hover:text-red-600 text-xs"
                      >
                        Rimuovi
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
