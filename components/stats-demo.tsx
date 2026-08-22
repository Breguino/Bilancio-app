"use client";

import { useMemo, useState } from "react";
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
  const eur = useMemo(
    () =>
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

  const risultati = [
    { etichetta: labels.average, valore: eur.format(avg), forte: false },
    { etichetta: labels.stdDev, valore: eur.format(stdDev), forte: false },
    {
      etichetta: labels.forecastMonth6,
      valore: forecast !== null ? eur.format(forecast) : "—",
      forte: true,
    },
    {
      etichetta: labels.ci95,
      valore: ci ? `${eur.format(ci.lower)} — ${eur.format(ci.upper)}` : "—",
      forte: false,
    },
  ];

  return (
    <div className="foglio p-6 sm:p-8">
      <p className="tacca mb-3">{labels.eyebrow}</p>
      <h3 className="display text-xl mb-2">{labels.title}</h3>
      <p className="text-inchiostro-soft text-sm leading-relaxed mb-7">{labels.body}</p>

      <div className="grid grid-cols-5 gap-2 mb-7">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <label className="tacca text-[10px] text-center" htmlFor={`stats-demo-${i}`}>
              {labels.monthLabel} {i + 1}
            </label>
            <input
              id={`stats-demo-${i}`}
              type="number"
              value={v}
              onChange={(e) => updateValue(i, e.target.value)}
              className="cifra w-full border border-riga bg-carta rounded-sm px-1 py-2 text-sm text-center text-inchiostro focus:outline-none focus:border-verde"
            />
          </div>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-riga pt-6">
        {risultati.map((r) => (
          <div key={r.etichetta}>
            <dt className="tacca mb-1.5">{r.etichetta}</dt>
            <dd className={`cifra ${r.forte ? "text-verde text-lg" : "text-inchiostro text-sm"}`}>
              {r.valore}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
