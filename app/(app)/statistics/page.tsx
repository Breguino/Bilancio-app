import { createClient } from "@/lib/supabase/server";
import { linearRegression, confidenceInterval95, sampleStdDev, zScoreOutliers } from "@/lib/statistics";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { TrendChart } from "@/components/trend-chart";

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}

export default async function StatisticsPage() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const num2 = (n: number) => n.toLocaleString(locale === "it" ? "it-IT" : "en-IE", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const monthLabel = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    return `${t.statistics.monthNamesShort[m - 1]} ${y}`;
  };

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
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          {t.statistics.eyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.statistics.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          {t.statistics.subtitle}
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">{t.statistics.trendTitle}</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          {t.statistics.trendSubtitle}
        </p>
        {!regression ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">
            {t.statistics.trendInsufficientData}
          </p>
        ) : (
          <>
            <p className="text-sm mb-4">
              {t.statistics.trendPre} {regression.slope >= 0 ? t.statistics.increasing : t.statistics.decreasing}{" "}
              {t.statistics.trendMid}{" "}
              <strong className="num">{eur.format(Math.abs(regression.slope))}</strong>{" "}
              {t.statistics.trendPost} {num2(regression.r2)}).
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-secondary dark:text-neutral-400 mb-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-[3px] rounded-full bg-accent" /> {t.statistics.recordedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-[3px] rounded-full bg-accent/40" /> {t.statistics.projectionLabel}
              </span>
            </div>
            <TrendChart
              labels={months.map(monthLabel)}
              values={netSeries}
              forecast={forecasts}
              forecastLabels={forecasts.map((_, i) => `+${i + 1}`)}
              format={(n) => eur.format(n)}
              ariaLabel={t.statistics.trendTitle}
            />
            {forecasts.length > 0 ? (
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm">
                {forecasts.map((v, i) => (
                  <span key={`f${i}`} className="text-ink-secondary dark:text-neutral-400">
                    {t.statistics.forecastLabel.replace("{n}", String(i + 1))}:{" "}
                    <b className="num font-semibold text-ink dark:text-neutral-100">{eur.format(v)}</b>
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">{t.statistics.descriptiveTitle}</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          {t.statistics.descriptiveSubtitle}
        </p>
        {netSeries.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">{t.statistics.noDataAvailable}</p>
        ) : !ci ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">
            {t.statistics.singleMonthNoticeTemplate.replace("{amount}", eur.format(netSeries[0]))}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{t.statistics.monthlyAverage}</p>
              <p className="num font-bold">{eur.format(ci.mean)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{t.statistics.stdDev}</p>
              <p className="num font-bold">{eur.format(stdDev)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{t.statistics.confidenceInterval95}</p>
              <p className="num font-bold">
                {eur.format(ci.lower)} — {eur.format(ci.upper)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-1">{t.statistics.anomaliesTitle}</h2>
        <p className="text-xs text-ink-muted dark:text-neutral-500 mb-4">
          {t.statistics.anomaliesSubtitle}
        </p>
        {outliers.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">{t.statistics.noAnomalies}</p>
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
