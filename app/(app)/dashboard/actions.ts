"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTransaction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const date = String(formData.get("date") || "");
  const type = String(formData.get("type") || "expense");
  const rawAmount = parseFloat(String(formData.get("amount") || "0"));
  const contactId = String(formData.get("contact_id") || "").trim() || null;
  const returnPath = String(formData.get("return_path") || "/dashboard");

  if (!description || !date || !(rawAmount > 0)) {
    redirect(withParam(returnPath, "error", "Compila descrizione, data e un importo maggiore di zero."));
  }

  const amount = type === "income" ? rawAmount : -rawAmount;

  await supabase.from("transactions").insert({
    user_id: user.id,
    description,
    category: type === "income" ? null : category,
    date,
    amount,
    contact_id: contactId,
  });

  revalidateAll();
  revalidatePath("/contacts");
  redirect(withParam(returnPath, "success", "Movimento aggiunto"));
}

function withParam(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}

export async function deleteTransaction(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("transactions").delete().eq("id", id);
  revalidateAll();
  revalidatePath("/contacts");
}

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  revalidatePath("/compare");
  revalidatePath("/yearly");
}
