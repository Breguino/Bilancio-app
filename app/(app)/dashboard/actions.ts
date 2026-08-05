"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { track } from "@vercel/analytics/server";
import { createClient } from "@/lib/supabase/server";
import { parseImportCsv } from "@/lib/csv-import";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

export async function addTransaction(formData: FormData) {
  const { t } = getDictionary();
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
    redirect(withParam(returnPath, "error", t.dashboard.addTransactionValidationError));
  }

  const amount = type === "income" ? rawAmount : -rawAmount;

  const { count: existingCount } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true });

  await supabase.from("transactions").insert({
    user_id: user.id,
    description,
    category: type === "income" ? null : category,
    date,
    amount,
    contact_id: contactId,
  });

  if ((existingCount ?? 0) === 0) {
    await track("first_transaction_created");
  }

  revalidateAll();
  revalidatePath("/contacts");
  redirect(withParam(returnPath, "success", t.dashboard.addedToast));
}

export async function importTransactions(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const returnPath = String(formData.get("return_path") || "/dashboard");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(withParam(returnPath, "error", t.dashboard.selectFileError));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    redirect(withParam(returnPath, "error", t.dashboard.fileTooLargeError));
  }

  const text = await file.text();
  const { data: contacts } = await supabase.from("contacts").select("id, name");
  const { rows, imported, skipped, unmatchedContacts } = parseImportCsv(text, contacts || []);

  if (imported === 0) {
    redirect(withParam(returnPath, "error", t.dashboard.noValidRowsError));
  }

  const { count: existingCount } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true });

  const CHUNK_SIZE = 500;
  let insertedCount = 0;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map((r) => ({ ...r, user_id: user.id }));
    const { error } = await supabase.from("transactions").insert(chunk);
    if (error) break;
    insertedCount += chunk.length;
  }

  revalidateAll();
  revalidatePath("/contacts");

  if (insertedCount === 0) {
    redirect(withParam(returnPath, "error", t.common.actionFailedError));
  }

  if ((existingCount ?? 0) === 0 && insertedCount > 0) {
    await track("first_transaction_created");
  }

  const parts = [t.dashboard.importedCount.replace("{n}", String(insertedCount))];
  if (insertedCount < imported) parts.push(t.dashboard.partialImportError);
  if (skipped > 0) parts.push(t.dashboard.skippedCount.replace("{n}", String(skipped)));
  if (unmatchedContacts > 0) parts.push(t.dashboard.unmatchedContactsCount.replace("{n}", String(unmatchedContacts)));
  redirect(withParam(returnPath, "success", parts.join(", ")));
}

function withParam(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}

export async function deleteTransaction(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const returnPath = String(formData.get("return_path") || "/dashboard");

  if (!id) {
    redirect(withParam(returnPath, "error", t.dashboard.transactionNotFoundError));
  }

  // Eliminazione "soft": sposta nel cestino invece di cancellare subito.
  // Va contata: senza `count` un id inesistente (o una riga filtrata da RLS)
  // tornerebbe senza errore e senza spostare niente, lasciando l'utente a
  // fissare la stessa riga senza il minimo segnale di cosa sia andato storto.
  const { error, count } = await supabase
    .from("transactions")
    .update({ deleted_at: new Date().toISOString() }, { count: "exact" })
    .eq("id", id)
    .is("deleted_at", null);

  if (error || count === 0) {
    redirect(withParam(returnPath, "error", t.dashboard.deleteFailedError));
  }

  revalidateAll();
  revalidatePath("/contacts");
  revalidatePath("/cestino");
  redirect(withParam(returnPath, "success", t.dashboard.movedToTrashToast));
}

export async function restoreTransaction(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("transactions")
    .update({ deleted_at: null }, { count: "exact" })
    .eq("id", id);

  if (error || count === 0) {
    redirect(withParam("/cestino", "error", t.common.notFoundError));
  }

  revalidateAll();
  revalidatePath("/contacts");
  revalidatePath("/cestino");
  redirect(withParam("/cestino", "success", t.dashboard.restoredToast));
}

export async function permanentlyDeleteTransaction(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("transactions")
    .delete({ count: "exact" })
    .eq("id", id)
    .not("deleted_at", "is", null);

  if (error || count === 0) {
    redirect(withParam("/cestino", "error", t.common.notFoundError));
  }

  revalidatePath("/cestino");
  redirect(withParam("/cestino", "success", t.dashboard.permanentlyDeletedToast));
}

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  revalidatePath("/compare");
  revalidatePath("/yearly");
}
