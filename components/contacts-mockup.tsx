import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real client-card screen (fake example data), so
 * marketing pages can show what the CRM side of the interface looks like
 * without a real authenticated screenshot.
 */
export function ContactsMockup() {
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
          {t.shared.contactsMockup.path}
        </span>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-3">
          {t.shared.contactsMockup.exampleLabel}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-sm">{t.shared.contactsMockup.contactName}</p>
            <p className="text-xs text-ink-muted dark:text-neutral-500">{t.shared.contactsMockup.contactRole}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.shared.contactsMockup.totalRevenueLabel}
            </p>
            <p className="num font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
              {eur.format(1240)}
            </p>
          </div>
        </div>

        <div className="border-t border-border dark:border-neutral-800 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-2.5">
            {t.shared.contactsMockup.notesTitle}
          </p>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="min-w-0 truncate font-medium">{t.shared.contactsMockup.note1}</span>
              <span className="text-[10px] text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0">
                {t.shared.contactsMockup.note1Reminder}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-ink-muted dark:text-neutral-500 line-through">
                {t.shared.contactsMockup.note2}
              </span>
              <span className="text-[10px] text-ink-muted dark:text-neutral-500 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5 shrink-0">
                {t.shared.contactsMockup.note2Done}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
