import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Dictionary } from "@/lib/i18n/dictionaries/it";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string, monthNames: Dictionary["compare"]["monthNames"]) {
  const [y, m] = key.split("-").map(Number);
  return `${monthNames[m - 1]} ${y}`;
}
function monthRange(key: string) {
  const [y, m] = key.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}
function lastMonths(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    out.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return out;
}

async function totalsFor(
  supabase: ReturnType<typeof createClient>,
  key: string
) {
  const { start, end } = monthRange(key);
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .is("deleted_at", null)
    .gte("date", start)
    .lte("date", end);
  const rows = data || [];
  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = rows.filter((t) => t.amount < 0).reduce((s, t) => s - Number(t.amount), 0);
  const byCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const cat = t.category || "Senza categoria";
      byCategory.set(cat, (byCategory.get(cat) || 0) + -Number(t.amount));
    });
  return { income, expense, net: income - expense, byCategory };
}

function deltaBadge(curr: number, prev: number, higherIsGood: boolean, pct1: (n: number) => string, newLabel: string) {
  if (prev === 0) {
    if (curr === 0) {
      return (
        <span className="text-xs font-semibold rounded-full px-2 py-0.5 text-ink-muted dark:text-neutral-500 bg-surface-alt dark:bg-neutral-800">
          —
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold rounded-full px-2 py-0.5 text-ink-muted dark:text-neutral-500 bg-surface-alt dark:bg-neutral-800">
        {newLabel}
      </span>
    );
  }
  const diff = curr - prev;
  const diffPct = (diff / Math.abs(prev)) * 100;
  const isUp = diff >= 0;
  const good = higherIsGood ? isUp : !isUp;
  const cls = good ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40" : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40";
  return (
    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 num ${cls}`}>
      {isUp ? "▲" : "▼"} {pct1(Math.abs(diffPct))}%
    </span>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { a?: string; b?: string };
}) {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const pct1 = (n: number) => n.toLocaleString(locale === "it" ? "it-IT" : "en-IE", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  const months = lastMonths(12);
  const b = searchParams.b && months.includes(searchParams.b) ? searchParams.b : months[0];
  const a = searchParams.a && months.includes(searchParams.a) ? searchParams.a : months[1] || months[0];

  const supabase = createClient();
  const [totalsA, totalsB] = await Promise.all([totalsFor(supabase, a), totalsFor(supabase, b)]);

  const categories = Array.from(
    new Set([...totalsA.byCategory.keys(), ...totalsB.byCategory.keys()])
  ).sort();

  const maxValue = Math.max(totalsA.income, totalsB.income, totalsA.expense, totalsB.expense, 1);
  const chartRows = [
    { label: t.compare.entrate, va: totalsA.income, vb: totalsB.income },
    { label: t.compare.uscite, va: totalsA.expense, vb: totalsB.expense },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          {t.compare.eyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.compare.title}</h1>
      </div>

      <form method="get" className="flex items-center gap-3 flex-wrap">
        <select
          name="a"
          defaultValue={a}
          className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m, t.compare.monthNames)}
            </option>
          ))}
        </select>
        <span className="text-xs font-bold uppercase text-ink-muted dark:text-neutral-500">{t.compare.vs}</span>
        <select
          name="b"
          defaultValue={b}
          className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m, t.compare.monthNames)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2 transition-colors"
        >
          {t.compare.compareSubmit}
        </button>
      </form>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
        <h2 className="font-bold mb-1">{t.compare.visualComparisonTitle}</h2>
        <div className="flex items-center gap-4 text-xs text-ink-muted dark:text-neutral-500 mb-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ink-muted/40 dark:bg-neutral-600" /> {monthLabel(a, t.compare.monthNames)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" /> {monthLabel(b, t.compare.monthNames)}
          </span>
        </div>
        <div className="flex flex-col gap-5">
          {chartRows.map((m) => (
            <div key={m.label}>
              <p className="text-sm font-medium mb-1.5">{m.label}</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="bar-fill h-full rounded bg-ink-muted/40 dark:bg-neutral-600"
                      style={{ width: `${(m.va / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="num text-xs w-24 text-right shrink-0">{eur.format(m.va)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="bar-fill h-full rounded bg-accent"
                      style={{ width: `${(m.vb / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="num text-xs w-24 text-right shrink-0">{eur.format(m.vb)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-ink-muted dark:text-neutral-500 text-left border-b border-border dark:border-neutral-800">
                <th className="px-5 py-3 font-semibold">{t.compare.itemColumn}</th>
                <th className="px-5 py-3 font-semibold text-right">{monthLabel(a, t.compare.monthNames)}</th>
                <th className="px-5 py-3 font-semibold text-right">{monthLabel(b, t.compare.monthNames)}</th>
                <th className="px-5 py-3 font-semibold text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const va = totalsA.byCategory.get(cat) || 0;
                const vb = totalsB.byCategory.get(cat) || 0;
                return (
                  <tr key={cat} className="border-b border-border dark:border-neutral-800 last:border-0">
                    <td className="px-5 py-2.5">{cat}</td>
                    <td className="px-5 py-2.5 text-right num">{eur.format(va)}</td>
                    <td className="px-5 py-2.5 text-right num">{eur.format(vb)}</td>
                    <td className="px-5 py-2.5 text-right">{deltaBadge(vb, va, false, pct1, t.compare.new)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-ink font-bold">
                <td className="px-5 py-2.5">{t.compare.totalExpense}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsA.expense)}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsB.expense)}</td>
                <td className="px-5 py-2.5 text-right">
                  {deltaBadge(totalsB.expense, totalsA.expense, false, pct1, t.compare.new)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="px-5 py-2.5">{t.compare.income}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsA.income)}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsB.income)}</td>
                <td className="px-5 py-2.5 text-right">
                  {deltaBadge(totalsB.income, totalsA.income, true, pct1, t.compare.new)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="px-5 py-2.5">{t.compare.netSavings}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsA.net)}</td>
                <td className="px-5 py-2.5 text-right num">{eur.format(totalsB.net)}</td>
                <td className="px-5 py-2.5 text-right">
                  {deltaBadge(totalsB.net, totalsA.net, true, pct1, t.compare.new)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
