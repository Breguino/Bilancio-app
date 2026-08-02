"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseContactsCsv } from "@/lib/csv-import";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

export async function addContact(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    redirect("/contacts?error=" + encodeURIComponent(t.contacts.nameValidationError));
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
  redirect("/contacts?success=" + encodeURIComponent(t.contacts.addedToast));
}

export async function importContacts(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/contacts?error=" + encodeURIComponent(t.contacts.selectFileError));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    redirect("/contacts?error=" + encodeURIComponent(t.contacts.fileTooLargeError));
  }

  const text = await file.text();
  const { data: existing } = await supabase.from("contacts").select("name");
  const { rows, imported, skipped, duplicates } = parseContactsCsv(
    text,
    (existing || []).map((c) => c.name)
  );

  if (imported === 0) {
    redirect("/contacts?error=" + encodeURIComponent(t.contacts.noValidContactsError));
  }

  const CHUNK_SIZE = 500;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE).map((r) => ({ ...r, user_id: user.id }));
    await supabase.from("contacts").insert(chunk);
  }

  revalidatePath("/contacts");

  const parts = [t.contacts.importedCount.replace("{n}", String(imported))];
  if (duplicates > 0) parts.push(t.contacts.duplicatesCount.replace("{n}", String(duplicates)));
  if (skipped > 0) parts.push(t.contacts.skippedNoNameCount.replace("{n}", String(skipped)));
  redirect("/contacts?success=" + encodeURIComponent(parts.join(", ")));
}

export async function deleteContact(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/contacts");
}
