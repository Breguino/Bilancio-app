import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { addContact, deleteContact } from "./actions";

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: contacts }, { data: transactions }, { data: dueNotes }] = await Promise.all([
    supabase.from("contacts").select("*").order("name", { ascending: true }),
    supabase.from("transactions").select("contact_id, amount").not("contact_id", "is", null),
    supabase.from("contact_notes").select("contact_id").eq("done", false).lte("remind_at", today),
  ]);

  const rows = contacts || [];
  const revenueByContact = new Map<string, number>();
  (transactions || []).forEach((t) => {
    if (t.amount > 0 && t.contact_id) {
      revenueByContact.set(t.contact_id, (revenueByContact.get(t.contact_id) || 0) + Number(t.amount));
    }
  });
  const dueCountByContact = new Map<string, number>();
  (dueNotes || []).forEach((n) => {
    dueCountByContact.set(n.contact_id, (dueCountByContact.get(n.contact_id) || 0) + 1);
  });

  return (
    <div className="flex flex-col gap-8">
      <Toast message={searchParams.success} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">CRM</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Contatti</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          Visibili solo a te — {rows.length} contatt{rows.length === 1 ? "o" : "i"}.
        </p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-4">Nuovo contatto</h2>
        <div className="mb-4">
          <ErrorBanner message={searchParams.error} />
        </div>
        <form action={addContact} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Nome</label>
            <input
              name="name"
              required
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Email</label>
            <input
              name="email"
              type="email"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Telefono</label>
            <input
              name="phone"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">Note</label>
            <input
              name="notes"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <SubmitButton
            pendingText="Aggiungo…"
            className="sm:col-span-4 sm:w-fit bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            Aggiungi contatto
          </SubmitButton>
        </form>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500 px-5 py-6">Nessun contatto ancora.</p>
        ) : (
          <div className="divide-y divide-border dark:divide-neutral-800">
            {rows.map((c) => {
              const revenue = revenueByContact.get(c.id) || 0;
              const dueCount = dueCountByContact.get(c.id) || 0;
              return (
                <div key={c.id} className="flex flex-wrap items-center justify-between px-5 py-3 text-sm gap-4">
                  <div className="min-w-0">
                    <Link href={`/contacts/${c.id}`} className="font-semibold truncate hover:text-accent block">
                      {c.name}
                    </Link>
                    <p className="text-ink-muted dark:text-neutral-500 text-xs truncate">
                      {[c.email, c.phone].filter(Boolean).join(" · ") || "—"}
                    </p>
                    {c.notes ? (
                      <p className="text-ink-secondary dark:text-neutral-400 text-xs mt-0.5 truncate">{c.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {dueCount > 0 ? (
                      <span
                        className="text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-full px-2.5 py-1"
                        title="Promemoria in scadenza"
                      >
                        {dueCount} promemoria
                      </span>
                    ) : null}
                    {revenue > 0 ? (
                      <span
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-full px-2.5 py-1 num"
                        title="Entrate totali collegate a questo contatto"
                      >
                        {eur.format(revenue)}
                      </span>
                    ) : null}
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmButton
                        confirmMessage={`Eliminare il contatto "${c.name}"? Verranno scollegati anche i movimenti collegati. Non si può annullare.`}
                        ariaLabel="Elimina contatto"
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
