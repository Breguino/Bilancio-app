import { createClient } from "@/lib/supabase/server";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});
const pct1 = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

export default async function YearlyPage() {
  const supabase = createClient();
  const { data: transactions } = await supabase.from("transactions").select("*");
  const rows = transactions || [];

  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = rows.filter((t) => t.amount < 0).reduce((s, t) => s - Number(t.amount), 0);
  const net = income - expense;
  const rate = income > 0 ? (net / income) * 100 : 0;

  const byCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const cat = t.category || "Senza categoria";
      byCategory.set(cat, (byCategory.get(cat) || 0) + -Number(t.amount));
    });
  const ranked = Array.from(byCategory.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
  const max = ranked[0]?.value || 1;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          Da sempre
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Riepilogo annuale</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          Totali su tutto lo storico dei movimenti registrati.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Entrate totali</p>
          <p className="text-xl font-bold num">{eur.format(income)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Uscite totali</p>
          <p className="text-xl font-bold num">{eur.format(expense)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Risparmio netto</p>
          <p className="text-xl font-bold num">{eur.format(net)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">Tasso di risparmio</p>
          <p className="text-xl font-bold num">{rate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
        <h2 className="font-bold mb-4">Spesa totale per categoria</h2>
        {ranked.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">Nessun dato disponibile.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ranked.map((r) => {
              const pct = expense > 0 ? (r.value / expense) * 100 : 0;
              const width = (r.value / max) * 100;
              return (
                <div key={r.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{r.category}</span>
                    <span className="num">{eur.format(r.value)}</span>
                  </div>
                  <div className="h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div className="bar-fill h-full rounded bg-accent" style={{ width: `${width}%` }} />
                  </div>
                  <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">{pct1(pct)} del totale</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
