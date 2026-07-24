import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = ReturnType<typeof createClient>;

export type Frequency = "weekly" | "monthly" | "yearly";

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

function toIso(year: number, monthIndex0: number, day: number) {
  const mm = String(monthIndex0 + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function addMonths(year: number, monthIndex0: number, day: number, months: number) {
  const total = monthIndex0 + months;
  const newYear = year + Math.floor(total / 12);
  const newMonth0 = ((total % 12) + 12) % 12;
  const clampedDay = Math.min(day, daysInMonth(newYear, newMonth0));
  return { year: newYear, monthIndex0: newMonth0, day: clampedDay };
}

export function nextOccurrence(dateStr: string, frequency: Frequency): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const monthIndex0 = m - 1;

  if (frequency === "weekly") {
    const dt = new Date(Date.UTC(y, monthIndex0, d));
    dt.setUTCDate(dt.getUTCDate() + 7);
    return dt.toISOString().slice(0, 10);
  }

  const months = frequency === "yearly" ? 12 : 1;
  const next = addMonths(y, monthIndex0, d, months);
  return toIso(next.year, next.monthIndex0, next.day);
}

/**
 * Genera le transazioni dovute per tutte le ricorrenze attive dell'utente corrente
 * (RLS filtra automaticamente per user_id) e avanza next_date. Recupera anche le
 * occorrenze mancate se l'utente non ha aperto l'app per un po'.
 */
export async function generateDueRecurringTransactions(supabase: SupabaseServerClient) {
  const today = new Date().toISOString().slice(0, 10);

  const { data: due } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("active", true)
    .lte("next_date", today);

  if (!due || due.length === 0) return;

  for (const r of due) {
    let cursor = r.next_date as string;
    const toInsert: Record<string, unknown>[] = [];
    let guard = 0;

    while (cursor <= today && guard < 500) {
      toInsert.push({
        user_id: r.user_id,
        description: r.description,
        category: r.category,
        amount: r.amount,
        date: cursor,
        contact_id: r.contact_id,
        recurring_id: r.id,
      });
      cursor = nextOccurrence(cursor, r.frequency as Frequency);
      guard++;
      if (r.end_date && cursor > r.end_date) break;
    }

    if (toInsert.length > 0) {
      await supabase.from("transactions").insert(toInsert);
    }

    const stillActive = !(r.end_date && cursor > r.end_date);
    await supabase
      .from("recurring_transactions")
      .update({ next_date: cursor, active: stillActive })
      .eq("id", r.id);
  }
}
