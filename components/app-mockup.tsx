import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real Panoramica screen (fake example data), so
 * marketing pages can show what the interface looks like without a
 * real authenticated screenshot.
 */
export function AppMockup() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const rows = [
    { date: "23/07", description: t.shared.appMockup.demoSalary, category: "Ardian Bregu", amount: 1000, positive: true },
    { date: "23/07", description: t.shared.appMockup.demoUtility, category: t.shared.appMockup.demoCategory, amount: -30, positive: false },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border dark:border-neutral-800 bg-surface-alt dark:bg-neutral-800/60">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[11px] font-medium text-ink-muted dark:text-neutral-500">
          bilancino.app/dashboard
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-3">
          {t.shared.appMockup.exampleOverview}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.appMockup.entrate}
            </p>
            <p className="num font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{eur.format(1000)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.appMockup.uscite}
            </p>
            <p className="num font-bold text-rose-500 dark:text-rose-400 text-sm mt-0.5">{eur.format(30)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.appMockup.netto}
            </p>
            <p className="num font-bold text-sm mt-0.5">{eur.format(970)}</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium">{t.shared.appMockup.demoCategory}</span>
            <span className="num text-ink-muted dark:text-neutral-500">30 € / 250 €</span>
          </div>
          <div className="h-2 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
            <div className="h-full rounded bg-accent" style={{ width: "12%" }} />
          </div>
        </div>

        <div className="border-t border-border dark:border-neutral-800 pt-3 flex flex-col gap-2.5">
          {rows.map((r) => (
            <div key={r.description} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-ink-muted dark:text-neutral-500 num shrink-0">{r.date}</span>
                <span className="truncate font-medium">{r.description}</span>
                <span className="text-[10px] text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0">
                  {r.category}
                </span>
              </div>
              <span
                className={`num font-semibold shrink-0 ${
                  r.positive ? "text-emerald-600 dark:text-emerald-400" : ""
                }`}
              >
                {r.positive ? "+" : "−"}
                {eur.format(Math.abs(r.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
