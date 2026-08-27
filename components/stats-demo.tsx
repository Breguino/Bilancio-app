"use client";

import { useId, useMemo, useState } from "react";
import { linearRegression, confidenceInterval95, sampleStdDev, mean } from "@/lib/statistics";

const DEFAULT_VALUES = [620, 780, 710, 890, 940];

type StatsDemoLabels = {
  eyebrow: string;
  title: string;
  body: string;
  monthLabel: string;
  average: string;
  stdDev: string;
  forecastMonth6: string;
  ci95: string;
};

const DEFAULT_LABELS: StatsDemoLabels = {
  eyebrow: "Provalo tu stesso",
  title: "Il motore statistico, dal vivo",
  body: "Modifica il risparmio netto degli ultimi 5 mesi: previsione, media e intervallo di confidenza si aggiornano subito, con la stessa formula usata dentro l'app.",
  monthLabel: "Mese",
  average: "Media",
  stdDev: "Dev. standard",
  forecastMonth6: "Previsione mese 6",
  ci95: "IC 95%",
};

export function StatsDemo({
  labels = DEFAULT_LABELS,
  numberLocale = "it-IT",
}: {
  labels?: StatsDemoLabels;
  numberLocale?: string;
} = {}) {
  const [values, setValues] = useState<number[]>(DEFAULT_VALUES);
  // Identificativi stabili fra server e browser, per collegare ogni etichetta
  // al suo campo.
  const idBase = useId();
  const eur = useMemo(
    () =>
      // useGrouping esplicito: per l'italiano i dati CLDR dicono di raggruppare
      // solo da cinque cifre in su, e Node e il browser applicano quella regola
      // in versioni diverse. Il server scriveva "1013 €" e il browser "1.013 €":
      // React buttava via l'HTML del server e ridisegnava tutto il riquadro.
      new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
        useGrouping: true,
      }),
    [numberLocale]
  );

  function updateValue(i: number, raw: string) {
    const n = Number(raw);
    setValues((prev) => prev.map((v, idx) => (idx === i ? (Number.isFinite(n) ? n : 0) : v)));
  }

  const regression = useMemo(() => linearRegression(values.map((y, x) => ({ x, y }))), [values]);
  const forecast = regression ? regression.intercept + regression.slope * values.length : null;
  const ci = useMemo(() => confidenceInterval95(values), [values]);
  const stdDev = useMemo(() => sampleStdDev(values), [values]);
  const avg = useMemo(() => mean(values), [values]);

  return (
    <div className="border border-border dark:border-neutral-800 rounded-2xl p-6 sm:p-8 bg-white dark:bg-neutral-900">
      <p className="text-xs font-bold uppercase tracking-wide text-accent mb-2">{labels.eyebrow}</p>
      <h3 className="text-xl font-extrabold tracking-tight mb-1">{labels.title}</h3>
      <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
        {labels.body}
      </p>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label
              htmlFor={`${idBase}-${i}`}
              className="text-[10px] font-semibold uppercase text-ink-muted dark:text-neutral-500 text-center"
            >
              {labels.monthLabel} {i + 1}
            </label>
            <input
              id={`${idBase}-${i}`}
              type="number"
              value={v}
              onChange={(e) => updateValue(i, e.target.value)}
              className="w-full border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-1 py-2 text-sm text-center num focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border dark:border-neutral-800 pt-5">
        <div>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{labels.average}</p>
          <p className="num font-bold">{eur.format(avg)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{labels.stdDev}</p>
          <p className="num font-bold">{eur.format(stdDev)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{labels.forecastMonth6}</p>
          <p className="num font-bold text-accent">{forecast !== null ? eur.format(forecast) : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted dark:text-neutral-500 mb-1">{labels.ci95}</p>
          <p className="num font-bold text-sm">{ci ? `${eur.format(ci.lower)} — ${eur.format(ci.upper)}` : "—"}</p>
        </div>
      </div>
    </div>
  );
}
