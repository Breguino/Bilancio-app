"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function deleteContact(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/contacts");
}
