"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/recurring");
  revalidatePath("/budget");
  revalidatePath("/compare");
  revalidatePath("/yearly");
}

export async function addRecurring(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const type = String(formData.get("type") || "expense");
  const rawAmount = parseFloat(String(formData.get("amount") || "0"));
  const contactId = String(formData.get("contact_id") || "").trim() || null;
  const frequency = String(formData.get("frequency") || "monthly");
  const startDate = String(formData.get("start_date") || "");
  const endDate = String(formData.get("end_date") || "").trim() || null;

  if (!description || !startDate || !(rawAmount > 0)) {
    redirect("/recurring?error=" + encodeURIComponent(t.recurring.validationError));
  }
  if (endDate && endDate < startDate) {
    redirect("/recurring?error=" + encodeURIComponent(t.recurring.endBeforeStartError));
  }

  const amount = type === "income" ? rawAmount : -rawAmount;

  await supabase.from("recurring_transactions").insert({
    user_id: user.id,
    description,
    category: type === "income" ? null : category,
    amount,
    contact_id: contactId,
    frequency,
    start_date: startDate,
    next_date: startDate,
    end_date: endDate,
  });

  revalidateAll();
  redirect("/recurring?success=" + encodeURIComponent(t.recurring.addedToast));
}

export async function toggleRecurring(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  if (!id) return;

  const willBeActive = !active;
  if (willBeActive) {
    // Riattivare una ricorrenza la cui prossima occorrenza è già oltre la
    // data di fine genererebbe subito un movimento fuori dal periodo voluto
    // (generateDueRecurringTransactions la riprende al primo caricamento).
    const { data: recurring } = await supabase
      .from("recurring_transactions")
      .select("next_date, end_date")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (recurring?.end_date && recurring.next_date > recurring.end_date) {
      redirect("/recurring?error=" + encodeURIComponent(t.recurring.resumePastEndDateError));
    }
  }

  const { error, count } = await supabase
    .from("recurring_transactions")
    .update({ active: willBeActive }, { count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect("/recurring?error=" + encodeURIComponent(t.common.notFoundError));
  }

  revalidateAll();
}

export async function deleteRecurring(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("recurring_transactions")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect("/recurring?error=" + encodeURIComponent(t.common.notFoundError));
  }

  revalidateAll();
}
