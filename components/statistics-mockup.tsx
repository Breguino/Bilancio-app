import { TriangleAlert } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real Statistiche screen (fake example data), so
 * marketing pages can show what the analytics side of the interface looks
 * like without a real authenticated screenshot.
 */
export function StatisticsMockup() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border dark:border-neutral-800 bg-surface-alt dark:bg-neutral-800/60">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[11px] font-medium text-ink-muted dark:text-neutral-500">
          {t.shared.statisticsMockup.path}
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-3">
          {t.shared.statisticsMockup.exampleLabel}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.statisticsMockup.average}
            </p>
            <p className="num font-bold text-sm mt-0.5">{eur.format(410)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.statisticsMockup.stdDev}
            </p>
            <p className="num font-bold text-sm mt-0.5">{eur.format(85)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.statisticsMockup.ci95}
            </p>
            <p className="num font-bold text-sm mt-0.5">
              {eur.format(340)}–{eur.format(480)}
            </p>
          </div>
        </div>

        <div className="border-t border-border dark:border-neutral-800 pt-3">
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2.5">
            <TriangleAlert size={15} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                {t.shared.statisticsMockup.anomalyTitle}
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                {t.shared.statisticsMockup.anomalyDescription} · {eur.format(180)} ·{" "}
                {t.shared.statisticsMockup.anomalyDetail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
