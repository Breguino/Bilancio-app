import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { Toast } from "@/components/toast";
import { restoreTransaction, permanentlyDeleteTransaction } from "../dashboard/actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function CestinoPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });

  const supabase = createClient();
  const { data: trashed } = await supabase
    .from("transactions")
    .select("*, contact:contacts(id, name)")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  const rows = trashed || [];

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      {searchParams.error ? <ErrorBanner message={searchParams.error} /> : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          {t.cestino.eyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.cestino.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          {t.cestino.subtitlePre}{" "}
          {rows.length} {rows.length === 1 ? t.cestino.transactionSingular : t.cestino.transactionPlural}{" "}
          {t.cestino.subtitleSuffix}
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">
            {t.cestino.emptyState}
          </p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800">
            {rows.map((tx: any) => (
              {/* Stessa struttura responsive della lista movimenti in Panoramica: su mobile la
                  descrizione sta in cima e data + etichette vanno sulla riga di dettaglio sotto. */}
              <div key={tx.id} className="flex items-start sm:items-center justify-between px-5 py-3 text-sm gap-3">
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="truncate order-1 sm:order-2">{tx.description}</span>
                  <div className="flex items-center gap-2 min-w-0 order-2 sm:order-1 sm:contents">
                    <span className="text-ink-muted dark:text-neutral-500 num text-xs sm:text-sm shrink-0 sm:w-14 sm:order-1">
                      {tx.date.slice(8, 10)}/{tx.date.slice(5, 7)}
                    </span>
                    {tx.category ? (
                      <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5 shrink-0 sm:order-3">
                        {tx.category}
                      </span>
                    ) : null}
                    {tx.contact ? (
                      <span className="text-xs text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0 sm:order-4">
                        {tx.contact.name}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`num font-semibold ${
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-neutral-100"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "−"}
                    {eur.format(Math.abs(Number(tx.amount)))}
                  </span>
                  <form action={restoreTransaction}>
                    <input type="hidden" name="id" value={tx.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                    >
                      {t.cestino.restoreAction}
                    </button>
                  </form>
                  <form action={permanentlyDeleteTransaction}>
                    <input type="hidden" name="id" value={tx.id} />
                    <ConfirmButton
                      confirmMessage={t.cestino.permanentlyDeleteConfirmTemplate.replace("{description}", tx.description)}
                      confirmLabel={t.cestino.permanentlyDeleteConfirmLabel}
                      cancelLabel={t.common.cancelAction}
                      ariaLabel={t.cestino.permanentlyDeleteAriaLabel}
                      className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-9 h-9 -mr-2 rounded-full flex items-center justify-center shrink-0"
                    >
                      ✕
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
