"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function addNote(formData: FormData) {
  const { t } = getDictionary();
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
    redirect(`/contacts/${contactId}?error=` + encodeURIComponent(t.contactDetail.noteTextValidationError));
  }

  await supabase.from("contact_notes").insert({
    user_id: user.id,
    contact_id: contactId,
    note,
    remind_at: remindAt,
  });

  revalidatePath(`/contacts/${contactId}`);
  redirect(`/contacts/${contactId}?success=` + encodeURIComponent(t.contactDetail.noteAddedToast));
}

export async function toggleNoteDone(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const contactId = String(formData.get("contact_id") || "");
  const done = String(formData.get("done") || "") === "true";
  if (!id) return;

  const { error, count } = await supabase
    .from("contact_notes")
    .update({ done: !done }, { count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect(`/contacts/${contactId}?error=` + encodeURIComponent(t.common.notFoundError));
  }

  revalidatePath(`/contacts/${contactId}`);
}

export async function deleteNote(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const contactId = String(formData.get("contact_id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("contact_notes")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect(`/contacts/${contactId}?error=` + encodeURIComponent(t.common.notFoundError));
  }

  revalidatePath(`/contacts/${contactId}`);
}
