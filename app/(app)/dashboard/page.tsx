import Link from "next/link";
import { Bell, Download, Receipt, RefreshCw, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateDueRecurringTransactions } from "@/lib/recurring";
import { Sparkline } from "@/components/sparkline";
import { DescriptionCategoryFields } from "@/components/description-category-fields";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { FileInputButton } from "@/components/file-input-button";
import { PageHeader } from "@/components/page-header";
import { MonthStepper } from "@/components/month-stepper";
import { CollapsibleFilters } from "@/components/collapsible-filters";
import { addTransaction, deleteTransaction, importTransactions } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { lastMonthKeys, monthBounds, monthKeyOf, monthLabel, monthName, resolveMonth } from "@/lib/month";

// Quanti movimenti stanno in panoramica prima del collegamento all'elenco
// completo. Prima ci finiva tutto il mese: la colonna dei budget accanto
// finiva a meta' pagina e sotto restava mezzo schermo vuoto.
const RIGHE_IN_PANORAMICA = 8;

function trendBadge(
  curr: number,
  prev: number,
  higherIsGood: boolean,
  pct1: (n: number) => string,
  newLabel: string,
  reference: string
) {
  if (prev === 0 && curr === 0) return null;
  if (prev === 0) {
    return <span className="text-xs font-semibold text-ink-muted dark:text-neutral-500">{newLabel}</span>;
  }
  const diffPct = ((curr - prev) / Math.abs(prev)) * 100;
  const isUp = curr >= prev;
  const good = higherIsGood ? isUp : !isUp;
  const cls = good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  return (
    <span className="flex items-baseline gap-1.5 mt-1.5">
      <span className={`text-xs font-semibold num ${cls}`}>
        {isUp ? "▲" : "▼"} {pct1(Math.abs(diffPct))}
      </span>
      {/* Il confronto senza il termine di paragone non dice niente: "▼ 13,1%"
          rispetto a che cosa? Qui c'e' scritto il mese. */}
      <span className="text-xs text-ink-muted dark:text-neutral-500">{reference}</span>
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    month?: string;
    type?: string;
    category?: string;
    contact?: string;
    q?: string;
    from?: string;
    to?: string;
    tutti?: string;
    error?: string;
    success?: string;
  };
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

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await generateDueRecurringTransactions(supabase);

  // Il mese sta nell'indirizzo: si puo' tornare indietro, e il mese che stai
  // guardando resta anche se ricarichi o mandi il link a qualcuno.
  const currentMonth = monthKeyOf();
  const month = resolveMonth(searchParams.month, currentMonth);
  const isCurrentMonth = month === currentMonth;
  const meseScelto = monthLabel(month, intlLocale);

  const { start, end } = monthBounds(month);
  const trendMonths = lastMonthKeys(6, month);
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
    { count: allTimeTransactionCount },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, contact:contacts(id, name)")
      .is("deleted_at", null)
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false }),
    supabase.from("contacts").select("id, name").order("name"),
    supabase
      .from("transactions")
      .select("date, amount")
      .is("deleted_at", null)
      .gte("date", trendStart)
      .lte("date", end),
    supabase.from("budgets").select("*").order("category"),
    supabase.from("transactions").select("category").is("deleted_at", null),
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
      .is("deleted_at", null)
      .not("category", "is", null)
      .order("date", { ascending: false })
      .limit(300),
    supabase.from("transactions").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("profiles").select("first_name").maybeSingle(),
  ]);

  // Il nome viene chiesto in fase di registrazione e sta in "profiles": il
  // saluto usava la parte prima della @ dell'email, che per la maggior parte
  // degli indirizzi non e' un nome. Se manca (chi entra con Google prima di
  // completare il profilo) si torna a quella.
  const greetingName = profile?.first_name?.trim() || user?.email?.split("@")[0];

  const isNewAccount = (allTimeTransactionCount || 0) === 0;

  const categoryOptions = Array.from(
    new Set((allCategories || []).map((c) => c.category).filter((c): c is string => Boolean(c)))
  ).sort();

  const filterType = searchParams.type === "income" || searchParams.type === "expense" ? searchParams.type : "";
  const filterCategory = searchParams.category?.trim() || "";
  const filterContact = searchParams.contact?.trim() || "";
  const filterQuery = searchParams.q?.trim() || "";
  const filterFrom = searchParams.from?.trim() || "";
  const filterTo = searchParams.to?.trim() || "";
  const showAll = searchParams.tutti === "1";
  // I filtri avanzati sono quelli nascosti dietro "Altri filtri": se uno e'
  // attivo il pannello deve aprirsi da solo.
  const hasAdvancedFilters = Boolean(filterCategory || filterContact || filterQuery || filterFrom || filterTo);
  const hasFilters = hasAdvancedFilters || Boolean(filterType);

  const paramsWith = (changes: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const base: Record<string, string> = {
      month: isCurrentMonth ? "" : month,
      type: filterType,
      category: filterCategory,
      contact: filterContact,
      q: filterQuery,
      from: filterFrom,
      to: filterTo,
      tutti: showAll ? "1" : "",
    };
    Object.entries({ ...base, ...changes }).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    const qs = p.toString();
    return qs ? `/dashboard?${qs}` : "/dashboard";
  };

  const returnPath = paramsWith({});

  const rows = transactions || [];
  const contactList = contacts || [];
  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = rows.filter((t) => t.amount < 0).reduce((s, t) => s - Number(t.amount), 0);
  const net = income - expense;
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = isCurrentMonth ? today : end;

  const upcoming = [
    ...(upcomingRecurring || []).map((r) => ({
      key: `rec-${r.id}`,
      date: r.next_date as string,
      kind: "recurring" as const,
      title: r.description as string,
      sub: `${Number(r.amount) > 0 ? "+" : "−"}${eur.format(Math.abs(Number(r.amount)))} · ${t.dashboard.recurringSuffix}`,
      href: "/recurring",
    })),
    ...(upcomingReminders || []).map((n) => ({
      key: `note-${n.id}`,
      date: n.remind_at as string,
      kind: "reminder" as const,
      title: n.note as string,
      sub: n.contact?.name || t.dashboard.contactFallback,
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
  const comparedTo = `${t.dashboard.comparedToPrefix} ${monthName(trendMonths[last - 1], intlLocale)}`;

  const spendByCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const key = t.category || "Senza categoria";
      spendByCategory.set(key, (spendByCategory.get(key) || 0) - Number(t.amount));
    });
  const allBudgets = (budgets || []).map((b) => {
    const limit = Number(b.monthly_limit);
    const spend = spendByCategory.get(b.category) || 0;
    return { id: b.id, category: b.category, limit, spend, ratio: limit > 0 ? spend / limit : 0 };
  });
  const budgetStatus = allBudgets.slice().sort((a, b) => b.ratio - a.ratio).slice(0, 3);
  // Il numero che si va davvero a cercare: quanto resta da spendere sui budget
  // impostati. Prima c'erano solo le tre barre e questa somma andava fatta a
  // mente.
  const budgetLeft = allBudgets.reduce((s, b) => s + Math.max(0, b.limit - b.spend), 0);

  let displayRows = rows;
  if (hasAdvancedFilters) {
    let filterQueryBuilder = supabase
      .from("transactions")
      .select("*, contact:contacts(id, name)")
      .is("deleted_at", null)
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
  if (filterType === "income") displayRows = displayRows.filter((r: any) => Number(r.amount) > 0);
  if (filterType === "expense") displayRows = displayRows.filter((r: any) => Number(r.amount) < 0);

  const totalRows = displayRows.length;
  const visibleRows = showAll ? displayRows : displayRows.slice(0, RIGHE_IN_PANORAMICA);
  const listBalance = displayRows.reduce((s: number, r: any) => s + Number(r.amount), 0);
  const countLabel = (totalRows === 1 ? t.dashboard.countOne : t.dashboard.countMany).replace(
    "{n}",
    String(totalRows)
  );

  const chipClass = (on: boolean) =>
    `rounded-full px-3 py-1.5 text-[13px] transition-colors ${
      on
        ? "bg-accent-soft dark:bg-accent/20 text-accent font-semibold"
        : "border border-border dark:border-neutral-700 text-ink-secondary dark:text-neutral-400 font-medium hover:border-accent hover:text-accent"
    }`;

  const sideCards = budgetStatus.length > 0 || upcoming.length > 0;

  const addPanel = (
    <>
      <div className="mb-4">
        <ErrorBanner message={searchParams.error} />
      </div>
      <form action={addTransaction} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <DescriptionCategoryFields
          key={rows.length}
          history={categoryHistory || []}
          descriptionLabel={t.dashboard.formDescriptionLabel}
          categoryLabel={t.dashboard.formCategoryLabel}
          categoryPlaceholder={t.dashboard.formCategoryPlaceholder}
        />
        <div className="flex flex-col gap-1 order-2">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.typeLabel}</label>
          <select
            name="type"
            className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="expense">{t.dashboard.expenseOption}</option>
            <option value="income">{t.dashboard.incomeOption}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 order-4">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.contactLabel}</label>
          <select
            name="contact_id"
            className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">{t.dashboard.noneOption}</option>
            {contactList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 order-5">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.amountLabel}</label>
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
        <input type="hidden" name="date" value={defaultDate} />
        <input type="hidden" name="return_path" value={returnPath} />
        <SubmitButton
          pendingText={t.dashboard.addingPending}
          className="order-6 sm:col-span-6 sm:w-fit bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
        >
          {t.dashboard.addSubmit}
        </SubmitButton>
      </form>
      {contactList.length === 0 ? (
        <p className="text-xs text-ink-muted dark:text-neutral-500 mt-2">
          {t.dashboard.contactHintPre} <Link href="/contacts" className="text-accent">{t.appShell.navContatti}</Link>{" "}
          {t.dashboard.contactHintPost}
        </p>
      ) : null}
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <Toast message={searchParams.success} />

      <PageHeader
        eyebrow={isNewAccount ? undefined : t.appShell.navPanoramica}
        title={
          isNewAccount ? `${t.dashboard.welcomeTitle}, ${greetingName}` : `${t.dashboard.greeting}, ${greetingName}`
        }
        subtitle={isNewAccount ? t.dashboard.welcomeBody : undefined}
        controls={
          isNewAccount ? undefined : (
            <MonthStepper
              month={month}
              label={meseScelto}
              hrefFor={(m) => paramsWith({ month: m === currentMonth ? "" : m, tutti: "" })}
              prevLabel={t.common.monthPrev}
              nextLabel={t.common.monthNext}
              maxMonth={currentMonth}
            />
          )
        }
        actionLabel={t.dashboard.addTransactionTitle}
        panelTitle={t.dashboard.addTransactionTitle}
        closeLabel={t.common.closeAction}
        panel={addPanel}
        defaultOpen={Boolean(searchParams.error) || isNewAccount}
      />

      {isNewAccount ? null : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.home.entrate}</p>
              <p className="text-2xl font-bold num whitespace-nowrap">{eur.format(income)}</p>
              {trendBadge(incomeSeries[last], incomeSeries[last - 1] ?? 0, true, pct1, t.dashboard.trendNew, comparedTo)}
            </div>
            <Sparkline values={incomeSeries} />
          </div>
          <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.home.uscite}</p>
              <p className="text-2xl font-bold num whitespace-nowrap">{eur.format(expense)}</p>
              {trendBadge(expenseSeries[last], expenseSeries[last - 1] ?? 0, false, pct1, t.dashboard.trendNew, comparedTo)}
            </div>
            <Sparkline values={expenseSeries} />
          </div>
          <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.home.netto}</p>
              <p className="text-2xl font-bold num whitespace-nowrap">{eur.format(net)}</p>
              {trendBadge(netSeries[last], netSeries[last - 1] ?? 0, true, pct1, t.dashboard.trendNew, comparedTo)}
            </div>
            <Sparkline values={netSeries} />
          </div>
        </div>
      )}

      {/* Due colonne da 1024px in su: a sinistra il flusso dei movimenti, a
          destra budget e scadenze. Prima era tutto impilato in una colonna
          sola e l'elenco dei movimenti cominciava dopo tre schede. */}
      <div className={sideCards ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] gap-6 items-start" : ""}>
        <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3.5">
            <h2 className="font-bold">
              {hasFilters ? t.dashboard.filterResultsTitle : t.dashboard.transactionsTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/cestino"
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
              >
                <Trash2 size={13} strokeWidth={2} />
                {t.dashboard.trashLink}
              </Link>
              <a
                href="/api/export"
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
              >
                <Download size={13} strokeWidth={2} />
                {t.dashboard.exportCsv}
              </a>
              <form action={importTransactions} className="flex items-center gap-1.5">
                <input type="hidden" name="return_path" value={returnPath} />
                <FileInputButton
                  name="file"
                  accept=".csv,text/csv"
                  required
                  title={t.dashboard.importTitle}
                  importingLabel={t.shared.fileInput.importingLabel}
                  importLabel={t.shared.fileInput.importLabel}
                />
              </form>
            </div>
          </div>

          <CollapsibleFilters
            moreLabel={t.dashboard.moreFilters}
            lessLabel={t.dashboard.lessFilters}
            defaultOpen={hasAdvancedFilters}
            chips={
              <>
                <Link href={paramsWith({ type: "", tutti: "" })} className={chipClass(!filterType)}>
                  {t.dashboard.filterAllTypes}
                </Link>
                <Link href={paramsWith({ type: "income", tutti: "" })} className={chipClass(filterType === "income")}>
                  {t.home.entrate}
                </Link>
                <Link href={paramsWith({ type: "expense", tutti: "" })} className={chipClass(filterType === "expense")}>
                  {t.home.uscite}
                </Link>
              </>
            }
          >
            <form method="get" className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
              {filterType ? <input type="hidden" name="type" value={filterType} /> : null}
              {isCurrentMonth ? null : <input type="hidden" name="month" value={month} />}
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.searchLabel}</label>
                <input
                  name="q"
                  defaultValue={filterQuery}
                  placeholder={t.dashboard.descriptionPlaceholder}
                  className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.categoryLabel}</label>
                <select
                  name="category"
                  defaultValue={filterCategory}
                  className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">{t.dashboard.allCategoriesOption}</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.contactLabel}</label>
                <select
                  name="contact"
                  defaultValue={filterContact}
                  className="w-full sm:w-auto border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">{t.dashboard.allContactsOption}</option>
                  {contactList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* "Da" e "A" sono una coppia: su mobile stanno affiancate a metà larghezza invece
                  di occupare una riga intera ciascuna, così il filtro per periodo si legge come un
                  intervallo unico e il form resta corto. Da sm in su il wrapper sparisce
                  (display:contents) e i due campi tornano in fila con gli altri filtri. */}
              <div className="flex gap-3 w-full sm:contents">
                <div className="flex flex-col gap-1 flex-1 min-w-0 sm:flex-none sm:w-auto">
                  <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.fromLabel}</label>
                  <input
                    name="from"
                    type="date"
                    defaultValue={filterFrom}
                    className="w-full min-w-0 appearance-none border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0 sm:flex-none sm:w-auto">
                  <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.dashboard.toLabel}</label>
                  <input
                    name="to"
                    type="date"
                    defaultValue={filterTo}
                    className="w-full min-w-0 appearance-none border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2 transition-colors"
              >
                {t.dashboard.filterSubmit}
              </button>
              {hasAdvancedFilters ? (
                <Link
                  href={paramsWith({ category: "", contact: "", q: "", from: "", to: "" })}
                  className="text-xs font-semibold text-ink-muted dark:text-neutral-500 hover:text-accent px-1 py-2 text-center sm:text-left"
                >
                  {t.dashboard.resetFilters}
                </Link>
              ) : null}
            </form>
          </CollapsibleFilters>

          {visibleRows.length === 0 ? (
            <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6 border-t border-border dark:border-neutral-800">
              {hasFilters
                ? t.dashboard.noResultsFiltered
                : isNewAccount
                ? t.dashboard.noResultsNew
                : t.dashboard.noResultsMonth}
            </p>
          ) : (
            <div className="divide-y divide-border dark:divide-neutral-800 border-t border-border dark:border-neutral-800">
              {/* Descrizione sulla prima riga, etichette sotto: in due colonne
                  la riga unica non ci stava e la descrizione veniva troncata
                  dopo poche lettere, che è proprio il dato da leggere. */}
              {visibleRows.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="text-ink-muted dark:text-neutral-500 num text-xs sm:text-[13px] w-11 shrink-0 self-start pt-0.5">
                    {tx.date.slice(8, 10)}/{tx.date.slice(5, 7)}
                  </span>
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <span className="truncate">{tx.description}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {tx.category ? (
                        <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5">
                          {tx.category}
                        </span>
                      ) : null}
                      {tx.contact ? (
                        <span className="text-xs text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5">
                          {tx.contact.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`num font-semibold shrink-0 ${
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-neutral-100"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "−"}
                    {eur.format(Math.abs(Number(tx.amount)))}
                  </span>
                  {tx.amount > 0 && tx.contact_id ? (
                    <Link
                      href={`/receipt/${tx.id}`}
                      aria-label={t.dashboard.receiptLink}
                      title={t.dashboard.receiptLink}
                      className="w-8 h-8 rounded-full border border-border dark:border-neutral-700 text-ink-muted dark:text-neutral-500 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0"
                    >
                      <Receipt size={14} strokeWidth={1.8} />
                    </Link>
                  ) : null}
                  <form action={deleteTransaction}>
                    <input type="hidden" name="id" value={tx.id} />
                    <input type="hidden" name="return_path" value={returnPath} />
                    <ConfirmButton
                      confirmMessage={t.dashboard.confirmDeleteTemplate.replace("{description}", tx.description)}
                      confirmLabel={t.common.deleteAction}
                      cancelLabel={t.common.cancelAction}
                      ariaLabel={t.dashboard.deleteAriaLabel}
                      className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-8 h-8 -mr-1.5 rounded-full flex items-center justify-center shrink-0"
                    >
                      <X size={14} strokeWidth={2.2} />
                    </ConfirmButton>
                  </form>
                </div>
              ))}
            </div>
          )}

          {visibleRows.length > 0 ? (
            <div className="flex items-center justify-between gap-3 px-5 py-3 text-[13px] text-ink-muted dark:text-neutral-500 border-t border-border dark:border-neutral-800">
              <span>
                {countLabel} · {t.dashboard.balanceLabel}{" "}
                <b className="num font-semibold text-ink dark:text-neutral-100">
                  {listBalance >= 0 ? "+" : "−"}
                  {eur.format(Math.abs(listBalance))}
                </b>
              </span>
              {totalRows > visibleRows.length ? (
                <Link href={paramsWith({ tutti: "1" })} className="text-xs font-semibold text-accent hover:underline">
                  {t.dashboard.seeAllCount.replace("{n}", String(totalRows))}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        {sideCards ? (
          <div className="flex flex-col gap-6">
            {budgetStatus.length > 0 ? (
              <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold">Budget</h2>
                  <Link href="/budget" className="text-xs font-semibold text-accent hover:underline">
                    {t.dashboard.seeAll}
                  </Link>
                </div>
                <div className="flex items-baseline justify-between gap-2 rounded-lg bg-accent-soft dark:bg-accent/15 px-3.5 py-3 mb-4">
                  <span className="text-xs text-ink-secondary dark:text-neutral-300">{t.dashboard.remainingLabel}</span>
                  <span className="num text-lg font-bold text-accent dark:text-accent-soft">{eur.format(budgetLeft)}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {budgetStatus.map((b) => {
                    const fillPct = Math.min(100, b.ratio * 100);
                    const over = b.ratio >= 1;
                    const warn = !over && b.ratio >= 0.8;
                    return (
                      <div key={b.id}>
                        <div className="flex items-center justify-between text-sm mb-1 gap-2">
                          <span className="font-medium truncate">{b.category}</span>
                          <span className="num shrink-0">
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
                            {pct1((b.ratio - 1) * 100)} {t.dashboard.overBudgetSuffix}
                          </p>
                        ) : warn ? (
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                            {pct1(b.ratio * 100)} {t.dashboard.ofBudgetSuffix}
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
                <h2 className="font-bold mb-4">{t.dashboard.dueSoon}</h2>
                <div className="flex flex-col gap-0.5">
                  {upcoming.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center gap-2.5 text-sm hover:bg-surface-alt dark:hover:bg-neutral-800 rounded-lg px-2 py-2 -mx-2 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-surface-alt dark:bg-neutral-800 text-ink-secondary dark:text-neutral-400 flex items-center justify-center shrink-0">
                        {item.kind === "recurring" ? (
                          <RefreshCw size={14} strokeWidth={1.8} />
                        ) : (
                          <Bell size={14} strokeWidth={1.8} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="text-xs text-ink-muted dark:text-neutral-500 truncate">{item.sub}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold shrink-0 ml-auto ${
                          item.overdue ? "text-red-600 dark:text-red-400" : "text-ink-muted dark:text-neutral-500"
                        }`}
                      >
                        {item.overdue
                          ? t.dashboard.overdue
                          : item.date === today
                          ? t.dashboard.today
                          : `${item.date.slice(8, 10)}/${item.date.slice(5, 7)}`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
