"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setBudget(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const category = String(formData.get("category") || "").trim();
  const limit = parseFloat(String(formData.get("monthly_limit") || "0"));
  if (!category || !(limit > 0)) {
    redirect("/budget?error=" + encodeURIComponent("Indica una categoria e un limite maggiore di zero."));
  }

  await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category, monthly_limit: limit },
      { onConflict: "user_id,category" }
    );

  revalidatePath("/budget");
  redirect("/budget?success=" + encodeURIComponent("Budget salvato"));
}

export async function deleteBudget(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("budgets").delete().eq("id", id);
  revalidatePath("/budget");
}
