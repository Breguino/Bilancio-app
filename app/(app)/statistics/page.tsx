import { createClient } from "@/lib/supabase/server";
import { linearRegression, confidenceInterval95, sampleStdDev, zScoreOutliers } from "@/lib/statistics";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});
const num2 = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const MONTH_NAMES = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export default async function StatisticsPage() {
  const supabase = createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, date, description, category, amount")
    .is("deleted_at", null)
    .order("date", { ascending: true });
  const rows = transactions || [];

  const monthMap = new Map<string, { income: number; expense: number }>();
  for (const t of rows) {
    const key = monthKey(t.date);
    const entry = monthMap.get(key) || { income: 0, expense: 0 };
    if (t.amount > 0) entry.income += Number(t.amount);
    else entry.expense += -Number(t.amount);
    monthMap.set(key, entry);
  }
  const months = Array.from(monthMap.keys()).sort();
  const netSeries = months.map((k) => monthMap.get(k)!.income - monthMap.get(k)!.expense);

  const regression = linearRegression(netSeries.map((y, x) => ({ x, y })));
  const forecastCount = 2;
  const forecasts = regression
    ? Array.from({ length: forecastCount }, (_, i) => regression.intercept + regression.slope * (netSeries.length + i))
    : [];

  const ci = netSeries.length >= 2 ? confidenceInterval95(netSeries) : null;
  const stdDev = netSeries.length >= 2 ? sampleStdDev(netSeries) : 0;

  const byCategory = new Map<string, { id: string; amount: number }[]>();
  for (const t of rows) {
    if (Number(t.amount) >= 0) continue;
    const cat = t.category || "Senza categoria";
    const arr = byCategory.get(cat) || [];
    arr.push({ id: t.id, amount: -Number(t.amount) });
    byCategory.set(cat, arr);
  }

  const rowsById = new Map(rows.map((t) => [t.id, t]));
  const outliers = Array.from(byCategory.entries())
    .flatMap(([category, list]) => zScoreOutliers(list, 2).map((o) => ({ ...o, category })))
    .map((o) => ({ ...o, tx: rowsById.get(o.id)! }))
    .sort((a, b) => b.tx.date.localeCompare(a.tx.date));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          Analisi
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Statistiche</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          Statistica descrittiva, inferenziale e trend econometrici sui tuoi movimenti.
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">Andamento e previsione</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          Regressione lineare (OLS) sul risparmio netto mensile.
        </p>
        {!regression ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">
            Servono almeno 2 mesi di storico per calcolare un trend.
          </p>
        ) : (
          <>
            <p className="text-sm mb-4">
              Il risparmio netto sta {regression.slope >= 0 ? "aumentando" : "diminuendo"} di circa{" "}
              <strong className="num">{eur.format(Math.abs(regression.slope))}</strong> al mese (R² ={" "}
              {num2(regression.r2)}).
            </p>
            <div className="flex flex-col gap-2">
              {months.map((k, i) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary dark:text-neutral-400">{monthLabel(k)}</span>
                  <span className="num">{eur.format(netSeries[i])}</span>
                </div>
              ))}
              {forecasts.map((v, i) => (
                <div
                  key={`f${i}`}
                  className="flex items-center justify-between text-sm border-t border-dashed border-border dark:border-neutral-700 pt-2 mt-1"
                >
                  <span className="text-accent">Previsione +{i + 1} mese</span>
                  <span className="num text-accent font-semibold">{eur.format(v)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">Statistiche descrittive</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          Calcolate sul risparmio netto mensile di tutto lo storico.
        </p>
        {netSeries.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">Nessun dato disponibile.</p>
        ) : !ci ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">
            Con un solo mese di storico ({eur.format(netSeries[0])}) non è possibile calcolare deviazione standard o
            intervallo di confidenza — servono almeno 2 mesi.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">Media mensile</p>
              <p className="num font-bold">{eur.format(ci.mean)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">Deviazione std.</p>
              <p className="num font-bold">{eur.format(stdDev)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">Intervallo di confidenza 95%</p>
              <p className="num font-bold">
                {eur.format(ci.lower)} — {eur.format(ci.upper)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">Spese anomale rilevate</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          Transazioni che si scostano di oltre 2 deviazioni standard dalla media della loro categoria (servono almeno
          4 movimenti nella stessa categoria).
        </p>
        {outliers.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">Nessuna spesa anomala rilevata.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {outliers.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <span className="font-medium">{o.tx.description}</span>{" "}
                  <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5">
                    {o.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="num text-red-600 dark:text-red-400 font-semibold">{eur.format(o.amount)}</span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-full px-2 py-0.5">
                    z={o.zScore.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
