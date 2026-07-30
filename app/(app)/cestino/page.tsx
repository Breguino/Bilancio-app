import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { Toast } from "@/components/toast";
import { restoreTransaction, permanentlyDeleteTransaction } from "../dashboard/actions";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});

export default async function CestinoPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
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
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          Cestino
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Movimenti eliminati</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          Restano qui 30 giorni prima di essere eliminati per sempre in automatico —
          {" "}{rows.length} moviment{rows.length === 1 ? "o" : "i"} in questo momento.
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">
            Il cestino è vuoto.
          </p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800">
            {rows.map((t: any) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-ink-muted dark:text-neutral-500 num w-14 shrink-0">
                    {t.date.slice(8, 10)}/{t.date.slice(5, 7)}
                  </span>
                  <span className="truncate">{t.description}</span>
                  {t.category ? (
                    <span className="text-xs text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800 rounded-full px-2 py-0.5 shrink-0">
                      {t.category}
                    </span>
                  ) : null}
                  {t.contact ? (
                    <span className="text-xs text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-2 py-0.5 shrink-0">
                      {t.contact.name}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`num font-semibold ${
                      t.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-neutral-100"
                    }`}
                  >
                    {t.amount > 0 ? "+" : "−"}
                    {eur.format(Math.abs(Number(t.amount)))}
                  </span>
                  <form action={restoreTransaction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                    >
                      ↩ Ripristina
                    </button>
                  </form>
                  <form action={permanentlyDeleteTransaction}>
                    <input type="hidden" name="id" value={t.id} />
                    <ConfirmButton
                      confirmMessage={`Eliminare per sempre "${t.description}"? Questa volta non si può annullare.`}
                      confirmLabel="Elimina per sempre"
                      ariaLabel="Elimina per sempre"
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
