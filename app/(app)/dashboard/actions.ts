"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseImportCsv } from "@/lib/csv-import";

const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

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

export async function importTransactions(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const returnPath = String(formData.get("return_path") || "/dashboard");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(withParam(returnPath, "error", "Seleziona un file CSV da importare."));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    redirect(withParam(returnPath, "error", "Il file è troppo grande (limite 2 MB)."));
  }

  const text = await file.text();
  const { data: contacts } = await supabase.from("contacts").select("id, name");
  const { rows, imported, skipped, unmatchedContacts } = parseImportCsv(text, contacts || []);

  if (imported === 0) {
    redirect(
      withParam(
        returnPath,
        "error",
        "Nessuna riga valida trovata nel file. Controlla che le colonne siano Data, Descrizione, Categoria, Cliente, Importo."
      )
    );
  }

  const CHUNK_SIZE = 500;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map((r) => ({ ...r, user_id: user.id }));
    await supabase.from("transactions").insert(chunk);
  }

  revalidateAll();
  revalidatePath("/contacts");

  const parts = [`${imported} movimenti importati`];
  if (skipped > 0) parts.push(`${skipped} righe ignorate`);
  if (unmatchedContacts > 0) parts.push(`${unmatchedContacts} clienti non riconosciuti`);
  redirect(withParam(returnPath, "success", parts.join(", ")));
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
