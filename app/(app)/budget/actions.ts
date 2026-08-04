"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function setBudget(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const category = String(formData.get("category") || "").trim();
  const limit = parseFloat(String(formData.get("monthly_limit") || "0"));
  if (!category || !(limit > 0)) {
    redirect("/budget?error=" + encodeURIComponent(t.budget.validationError));
  }

  await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category, monthly_limit: limit },
      { onConflict: "user_id,category" }
    );

  revalidatePath("/budget");
  redirect("/budget?success=" + encodeURIComponent(t.budget.savedToast));
}

export async function deleteBudget(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("budgets")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect("/budget?error=" + encodeURIComponent(t.common.notFoundError));
  }

  revalidatePath("/budget");
}
