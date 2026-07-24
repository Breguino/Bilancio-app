"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/recurring");
  revalidatePath("/budget");
  revalidatePath("/compare");
  revalidatePath("/yearly");
}

export async function addRecurring(formData: FormData) {
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
    redirect("/recurring?error=" + encodeURIComponent("Compila descrizione, data e un importo maggiore di zero."));
  }
  if (endDate && endDate < startDate) {
    redirect("/recurring?error=" + encodeURIComponent("La data di fine non può essere precedente alla data di inizio."));
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
  redirect("/recurring?success=" + encodeURIComponent("Ricorrenza aggiunta"));
}

export async function toggleRecurring(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  if (!id) return;
  await supabase.from("recurring_transactions").update({ active: !active }).eq("id", id);
  revalidateAll();
}

export async function deleteRecurring(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("recurring_transactions").delete().eq("id", id);
  revalidateAll();
}
