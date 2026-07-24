import { createClient } from "@/lib/supabase/server";
import { generateDueRecurringTransactions } from "@/lib/recurring";
import { Sparkline } from "@/components/sparkline";
import { DescriptionCategoryFields } from "@/components/description-category-fields";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addTransaction, deleteTransaction } from "./actions";

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

function monthKeyOf(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthKeys(n: number, ref = new Date()) {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    keys.push(monthKeyOf(new Date(ref.getFullYear(), ref.getMonth() - i, 1)));
  }
  return keys;
}

function trendBadge(curr: number, prev: number, higherIsGood: boolean) {
  if (prev === 0 && curr === 0) return null;
  if (prev === 0) {
    return <span className="text-xs font-semibold text-ink-muted dark:text-neutral-500">nuovo</span>;
  }
  const diffPct = ((curr - prev) / Math.abs(prev)) * 100;
  const isUp = curr >= prev;
  const good = higherIsGood ? isUp : !isUp;
  const cls = good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  return (
    <span className={`text-xs font-semibold num ${cls}`}>
      {isUp ? "▲" : "▼"} {Math.abs(diffPct).toFixed(1)}%
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    contact?: string;
    q?: string;
    from?: string;
    to?: string;
    error?: string;
    success?: string;
  };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await generateDueRecurringTransactions(supabase);

  const { start, end } = monthBounds();
  const trendMonths = lastNMonthKeys(6);
  const [firstY, firstM] = trendMonths[0].split("-").map(Number);
  const trendStart = new Date(firstY, firstM - 1, 1).toISOString().slice(0, 10);
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 7);
  const horizonStr = horizon.toISOString().slice(0, 10);

  const [
    { data: transactions },
    { data: contacts },
    { data: trendRows },
    { data: budgets },
    { data: allCategories },
    { data: upcomingRecurring },
    { data: upcomingReminders },
    { data: categoryHistory },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, contact:contacts(id, name)")
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false }),
    supabase.from("contacts").select("id, name").order("name"),
    supabase.from("transactions").select("date, amount").gte("date", trendStart).lte("date", end),
    supabase.from("budgets").select("*").order("category"),
    supabase.from("transactions").select("category"),
    supabase
      .from("recurring_transactions")
      .select("*")
      .eq("active", true)
      .lte("next_date", horizonStr)
      .order("next_date", { ascending: true }),
    supabase
      .from("contact_notes")
      .select("*, contact:contacts(id, name)")
      .eq("done", false)
      .lte("remind_at", horizonStr)
      .order("remind_at", { ascending: true }),
    supabase
      .from("transactions")
      .select("description, category")
      .not("category", "is", null)
      .order("date", { ascending: false })
      .limit(300),
  ]);

  const categoryOptions = Array.from(
    new Set((allCategories || []).map((c) => c.category).filter((c): c is string => Boolean(c)))
  ).sort();

  const filterCategory = searchParams.category?.trim() || "";
  const filterContact = searchParams.contact?.trim() || "";
  const filterQuery = searchParams.q?.trim() || "";
  const filterFrom = searchParams.from?.trim() || "";
  const filterTo = searchParams.to?.trim() || "";
  const hasFilters = Boolean(filterCategory || filterContact || filterQuery || filterFrom || filterTo);

  const returnParams = new URLSearchParams();
  if (filterCategory) returnParams.set("category", filterCategory);
  if (filterContact) returnParams.set("contact", filterContact);
  if (filterQuery) returnParams.set("q", filterQuery);
  if (filterFrom) returnParams.set("from", filterFrom);
  if (filterTo) returnParams.set("to", filterTo);
  const returnPath = returnParams.toString() ? `/dashboard?${returnParams.toString()}` : "/dashboard";

  const rows = transactions || [];
  const contactList = contacts || [];
  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = rows.filter((t) => t.amount < 0).reduce((s, t) => s - Number(t.amount), 0);
  const net = income - expense;
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = [
    ...(upcomingRecurring || []).map((r) => ({
      key: `rec-${r.id}`,
      date: r.next_date as string,
      icon: "🔁",
      title: r.description as string,
      sub: `${Number(r.amount) > 0 ? "+" : "−"}${eur.format(Math.abs(Number(r.amount)))} · ricorrente`,
      href: "/recurring",
    })),
    ...(upcomingReminders || []).map((n) => ({
      key: `note-${n.id}`,
      date: n.remind_at as string,
      icon: "🔔",
      title: n.note as string,
      sub: n.contact?.name || "Contatto",
      href: `/contacts/${n.contact_id}`,
    })),
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)
    .map((item) => ({ ...item, overdue: item.date <= today }));

  const incomeByMonth = new Map<string, number>();
  const expenseByMonth = new Map<string, number>();
  (trendRows || []).forEach((t) => {
    const key = t.date.slice(0, 7);
    if (t.amount > 0) incomeByMonth.set(key, (incomeByMonth.get(key) || 0) + Number(t.amount));
    else expenseByMonth.set(key, (expenseByMonth.get(key) || 0) + -Number(t.amount));
  });
  const incomeSeries = trendMonths.map((k) => incomeByMonth.get(k) || 0);
  const expenseSeries = trendMonths.map((k) => expenseByMonth.get(k) || 0);
  const netSeries = incomeSeries.map((v, i) => v - expenseSeries[i]);
  const last = incomeSeries.length - 1;

  const spendByCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const key = t.category || "Senza categoria";
      spendByCategory.set(key, (spendByCategory.get(key) || 0) - Number(t.amount));
    });
  const budgetStatus = (budgets || [])
    .map((b) => {
      const limit = Number(b.monthly_limit);
      const spend = spendByCategory.get(b.category) || 0;
      return { id: b.id, category: b.category, limit, spend, ratio: limit > 0 ? spend / limit : 0 };
    })
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3);

  let displayRows = rows;
  if (hasFilters) {
    let filterQueryBuilder = supabase
      .from("transactions")
      .select("*, contact:contacts(id, name)")
      .order("date", { ascending: false })
      .limit(200);
    if (filterCategory) filterQueryBuilder = filterQueryBuilder.eq("category", filterCategory);
    if (filterContact) filterQueryBuilder = filterQueryBuilder.eq("contact_id", filterContact);
    if (filterQuery) filterQueryBuilder = filterQueryBuilder.ilike("description", `%${filterQuery}%`);
    if (filterFrom) filterQueryBuilder = filterQueryBuilder.gte("date", filterFrom);
    if (filterTo) filterQueryBuilder = filterQueryBuilder.lte("date", filterTo);
    const { data: filtered } = await filterQueryBuilder;
    displayRows = filtered || [];
  }

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          Questo mese
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Ciao, {user?.email?.split("@")[0]}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Entrate</p>
            <p className="text-2xl font-bold num">{eur.format(income)}</p>
            {trendBadge(incomeSeries[last], incomeSeries[last - 1] ?? 0, true)}
          </div>
          <Sparkline values={incomeSeries} />
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Uscite</p>
            <p className="text-2xl font-bold num">{eur.format(expense)}</p>
            {trendBadge(expenseSeries[last], expenseSeries[last - 1] ?? 0, false)}
          </div>
          <Sparkline values={expenseSeries} />
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Netto</p>
            <p className="text-2xl font-bold num">{eur.format(net)}</p>
            {trendBadge(netSeries[last], netSeries[last - 1] ?? 0, true)}
          </div>
          <Sparkline values={netSeries} />
        </div>
      </div>

      {budgetStatus.length > 0 ? (
        <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Budget</h2>
            <a href="/budget" className="text-xs font-semibold text-accent hover:underline">
              Vedi tutti →
            </a>
          </div>
          <div className="flex flex-col gap-4">
            {budgetStatus.map((b) => {
              const fillPct = Math.min(100, b.ratio * 100);
              const over = b.ratio >= 1;
              const warn = !over && b.ratio >= 0.8;
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{b.category}</span>
                    <span className="num">
                      {eur.format(b.spend)}{" "}
                      <span className="text-ink-muted dark:text-neutral-500">/ {eur.format(b.limit)}</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`bar-fill h-full rounded ${over ? "bg-red-500" : warn ? "bg-amber-500" : "bg-accent"}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  {over ? (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
                      ⚠ {pct1((b.ratio - 1) * 100)} oltre budget
                    </p>
                  ) : warn ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                      {pct1(b.ratio * 100)} del budget
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
          <h2 className="font-bold mb-4">In scadenza</h2>
          <div className="flex flex-col gap-1">
            {upcoming.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="flex items-center justify-between gap-3 text-sm hover:bg-surface-alt dark:hover:bg-neutral-800 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="text-xs text-ink-muted dark:text-neutral-500 truncate">{item.sub}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold shrink-0 ${
                    item.overdue ? "text-red-600 dark:text-red-400" : "text-ink-muted dark:text-neutral-500"
                  }`}
                >
                  {item.overdue
                    ? "scaduto"
                    : item.date === today
                    ? "oggi"
                    : `${item.date.slice(8, 10)}/${item.date.slice(5, 7)}`}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">Aggiungi movimento</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={addTransaction} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <DescriptionCategoryFields key={rows.length} history={categoryHistory || []} />
          <div className="flex flex-col gap-1 order-2">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Tipo</label>
            <select
              name="type"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="expense">Spesa</option>
              <option value="income">Entrata</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 order-4">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Cliente</label>
            <select
              name="contact_id"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">— nessuno —</option>
              {contactList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 order-5">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Importo (€)</label>
            <input
              key={rows.length}
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <input type="hidden" name="date" value={today} />
          <input type="hidden" name="return_path" value={returnPath} />
          <SubmitButton
            pendingText="Aggiungo…"
            className="order-6 sm:col-span-6 sm:w-fit bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            Aggiungi
          </SubmitButton>
        </form>
        {contactList.length === 0 ? (
          <p className="text-xs text-ink-muted dark:text-neutral-500 mt-2">
            Aggiungi un contatto nella pagina <a href="/contacts" className="text-accent">Contatti</a> per poter
            collegare un movimento a un cliente.
          </p>
        ) : null}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="font-bold">{hasFilters ? "Risultati filtro" : "Movimenti del mese"}</h2>
          <a
            href="/api/export"
            className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
          >
            ⬇ Esporta CSV
          </a>
        </div>
        <form method="get" className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 px-5 pt-4">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Cerca</label>
            <input
              name="q"
              defaultValue={filterQuery}
              placeholder="Descrizione…"
              className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Categoria</label>
            <select
              name="category"
              defaultValue={filterCategory}
              className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Tutte</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Cliente</label>
            <select
              name="contact"
              defaultValue={filterContact}
              className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Tutti</option>
              {contactList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Da</label>
            <input
              name="from"
              type="date"
              defaultValue={filterFrom}
              className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">A</label>
            <input
              name="to"
              type="date"
              defaultValue={filterTo}
              className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2 transition-colors"
          >
            Filtra
          </button>
          {hasFilters ? (
            <a
              href="/dashboard"
              className="text-xs font-semibold text-ink-muted dark:text-neutral-500 hover:text-accent px-1 py-2 text-center sm:text-left"
            >
              Azzera
            </a>
          ) : null}
        </form>
        {displayRows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">
            Nessun movimento {hasFilters ? "trovato con questi filtri." : "questo mese."}
          </p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800 mt-3">
            {displayRows.map((t: any) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-ink-muted dark:text-neutral-500 num w-14 shrink-0">
                    {t.date.slice(8, 10)}/{t.date.slice(5, 7)}
                  </span>
                  <span className="truncate">{t.description}</span>
                  {t.category ? (
                    <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5 shrink-0">
                      {t.category}
                    </span>
                  ) : null}
                  {t.contact ? (
                    <span className="text-xs text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0">
                      {t.contact.name}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`num font-semibold ${
                      t.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-neutral-100"
                    }`}
                  >
                    {t.amount > 0 ? "+" : "−"}
                    {eur.format(Math.abs(Number(t.amount)))}
                  </span>
                  {t.amount > 0 && t.contact_id ? (
                    <a
                      href={`/receipt/${t.id}`}
                      className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-2.5 py-1 hover:border-accent hover:text-accent transition-colors shrink-0"
                    >
                      Ricevuta
                    </a>
                  ) : null}
                  <form action={deleteTransaction}>
                    <input type="hidden" name="id" value={t.id} />
                    <ConfirmButton
                      confirmMessage={`Eliminare il movimento "${t.description}"? Non si può annullare.`}
                      ariaLabel="Elimina movimento"
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
