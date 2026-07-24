"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addNote(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const contactId = String(formData.get("contact_id") || "");
  const note = String(formData.get("note") || "").trim();
  const remindAt = String(formData.get("remind_at") || "").trim() || null;
  if (!contactId) return;
  if (!note) {
    redirect(`/contacts/${contactId}?error=` + encodeURIComponent("Scrivi il testo della nota."));
  }

  await supabase.from("contact_notes").insert({
    user_id: user.id,
    contact_id: contactId,
    note,
    remind_at: remindAt,
  });

  revalidatePath(`/contacts/${contactId}`);
  redirect(`/contacts/${contactId}?success=` + encodeURIComponent("Nota aggiunta"));
}

export async function toggleNoteDone(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const contactId = String(formData.get("contact_id") || "");
  const done = String(formData.get("done") || "") === "true";
  if (!id) return;
  await supabase.from("contact_notes").update({ done: !done }).eq("id", id);
  revalidatePath(`/contacts/${contactId}`);
}

export async function deleteNote(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const contactId = String(formData.get("contact_id") || "");
  if (!id) return;
  await supabase.from("contact_notes").delete().eq("id", id);
  revalidatePath(`/contacts/${contactId}`);
}
