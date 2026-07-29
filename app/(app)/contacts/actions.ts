"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseContactsCsv } from "@/lib/csv-import";

const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

export async function addContact(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    redirect("/contacts?error=" + encodeURIComponent("Indica un nome per il contatto."));
  }
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;

  await supabase.from("contacts").insert({
    user_id: user.id,
    name,
    email,
    phone,
    notes,
  });

  revalidatePath("/contacts");
  redirect("/contacts?success=" + encodeURIComponent("Contatto aggiunto"));
}

export async function importContacts(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/contacts?error=" + encodeURIComponent("Seleziona un file CSV da importare."));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    redirect("/contacts?error=" + encodeURIComponent("Il file è troppo grande (limite 2 MB)."));
  }

  const text = await file.text();
  const { data: existing } = await supabase.from("contacts").select("name");
  const { rows, imported, skipped, duplicates } = parseContactsCsv(
    text,
    (existing || []).map((c) => c.name)
  );

  if (imported === 0) {
    redirect(
      "/contacts?error=" +
        encodeURIComponent(
          "Nessun contatto valido trovato nel file. Controlla che la prima colonna sia il Nome."
        )
    );
  }

  const CHUNK_SIZE = 500;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map((r) => ({ ...r, user_id: user.id }));
    await supabase.from("contacts").insert(chunk);
  }

  revalidatePath("/contacts");

  const parts = [`${imported} contatti importati`];
  if (duplicates > 0) parts.push(`${duplicates} già esistenti`);
  if (skipped > 0) parts.push(`${skipped} righe senza nome ignorate`);
  redirect("/contacts?success=" + encodeURIComponent(parts.join(", ")));
}

export async function deleteContact(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/contacts");
}
