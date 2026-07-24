import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addGoal, contribute, deleteGoal } from "./actions";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});
const pct1 = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = createClient();
  const { data: goals } = await supabase.from("goals").select("*").order("created_at");
  const rows = goals || [];

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
            Risparmio
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Obiettivi</h1>
        </div>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">Nuovo obiettivo</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={addGoal} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Nome</label>
            <input
              name="name"
              required
              placeholder="Es. Vacanza estate"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Importo target (€)</label>
            <input
              name="target"
              type="number"
              step="0.01"
              min="1"
              required
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <SubmitButton
            pendingText="Creo…"
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors sm:w-fit"
          >
            Crea obiettivo
          </SubmitButton>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-ink-muted dark:text-neutral-500">Nessun obiettivo ancora — creane uno sopra.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((g) => {
            const pct = Math.min(100, (Number(g.saved) / Number(g.target)) * 100);
            const reached = Number(g.saved) >= Number(g.target);
            return (
              <div key={g.id} className="relative border border-border dark:border-neutral-800 rounded-xl p-4 bg-surface-alt dark:bg-neutral-800">
                <form action={deleteGoal} className="absolute top-3 right-3">
                  <input type="hidden" name="id" value={g.id} />
                  <ConfirmButton
                    confirmMessage={`Eliminare l'obiettivo "${g.name}"? Non si può annullare.`}
                    ariaLabel="Elimina obiettivo"
                    className="text-ink-muted dark:text-neutral-500 hover:text-red-600 text-xs w-5 h-5"
                  >
                    ✕
                  </ConfirmButton>
                </form>
                <p className="font-semibold pr-6">
                  {g.name} {reached ? "✓" : ""}
                </p>
                <div className="flex items-center justify-between text-xs text-ink-secondary dark:text-neutral-400 mt-2 num">
                  <span>{eur.format(Number(g.saved))}</span>
                  <span>{eur.format(Number(g.target))}</span>
                </div>
                <div className="h-2.5 rounded bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 overflow-hidden mt-1">
                  <div className="bar-fill h-full rounded bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">
                  {pct1(pct)} {reached ? "— obiettivo raggiunto" : "del target"}
                </p>
                <form action={contribute} className="flex items-center gap-2 mt-3">
                  <input type="hidden" name="id" value={g.id} />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Importo (€)"
                    className="border border-border dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs w-28 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <SubmitButton
                    pendingText="Aggiungo…"
                    className="border border-border dark:border-neutral-800 rounded-full px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-900 hover:border-accent hover:text-accent transition-colors"
                  >
                    + Contributo
                  </SubmitButton>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
