import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addNote, deleteNote, toggleNoteDone } from "./actions";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});

export default async function ContactDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; success?: string };
}) {
  const supabase = createClient();

  const [{ data: contact }, { data: notes }, { data: transactions }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("contact_notes")
      .select("*")
      .eq("contact_id", params.id)
      .order("remind_at", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase.from("transactions").select("amount").eq("contact_id", params.id),
  ]);

  if (!contact) notFound();

  const revenue = (transactions || [])
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + Number(t.amount), 0);
  const today = new Date().toISOString().slice(0, 10);
  const rows = notes || [];

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div>
        <Link href="/contacts" className="text-xs font-semibold text-accent hover:underline">
          ← Contatti
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mt-2">{contact.name}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          {[contact.email, contact.phone].filter(Boolean).join(" · ") || "Nessun recapito"}
        </p>
        {revenue > 0 ? (
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
            Entrate totali collegate: {eur.format(revenue)}
          </p>
        ) : null}
        {contact.notes ? (
          <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-3 border-l-2 border-border dark:border-neutral-700 pl-3">
            {contact.notes}
          </p>
        ) : null}
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">Nuova nota / promemoria</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={addNote} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <input type="hidden" name="contact_id" value={contact.id} />
          <div className="sm:col-span-4 flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Nota</label>
            <input
              name="note"
              required
              placeholder="Es. Richiamare per rinnovo contratto"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              Promemoria (opzionale)
            </label>
            <input
              name="remind_at"
              type="date"
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <SubmitButton
            pendingText="Aggiungo…"
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            Aggiungi
          </SubmitButton>
        </form>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="px-5 pt-5">
          <h2 className="font-bold">Note e promemoria</h2>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">Nessuna nota ancora.</p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800 mt-3">
            {rows.map((n) => {
              const overdue = !n.done && n.remind_at && n.remind_at <= today;
              return (
                <div key={n.id} className="flex items-center justify-between px-5 py-3 text-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`truncate ${n.done ? "line-through text-ink-muted dark:text-neutral-500" : ""}`}>
                      {n.note}
                    </span>
                    {n.remind_at ? (
                      <span
                        className={`text-xs rounded-full px-2 py-0.5 shrink-0 ${
                          overdue
                            ? "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 font-semibold"
                            : "text-ink-muted dark:text-neutral-400 bg-surface-alt dark:bg-neutral-800"
                        }`}
                      >
                        {overdue ? "Scaduto: " : "Promemoria: "}
                        {n.remind_at.slice(8, 10)}/{n.remind_at.slice(5, 7)}/{n.remind_at.slice(0, 4)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <form action={toggleNoteDone}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="contact_id" value={contact.id} />
                      <input type="hidden" name="done" value={String(n.done)} />
                      <button
                        type="submit"
                        className="text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                      >
                        {n.done ? "Riapri" : "Fatto"}
                      </button>
                    </form>
                    <form action={deleteNote}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="contact_id" value={contact.id} />
                      <ConfirmButton
                        confirmMessage="Eliminare questa nota? Non si può annullare."
                        ariaLabel="Elimina nota"
                        className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-6 h-6 rounded"
                      >
                        ✕
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
