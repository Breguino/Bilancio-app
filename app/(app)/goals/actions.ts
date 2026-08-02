"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function addGoal(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  const target = parseFloat(String(formData.get("target") || "0"));
  if (!name || !(target > 0)) {
    redirect("/goals?error=" + encodeURIComponent(t.goals.nameTargetValidationError));
  }

  await supabase.from("goals").insert({ user_id: user.id, name, target, saved: 0 });
  revalidatePath("/goals");
  redirect("/goals?success=" + encodeURIComponent(t.goals.createdToast));
}

export async function contribute(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const amount = parseFloat(String(formData.get("amount") || "0"));
  if (!id) return;
  if (!(amount > 0)) {
    redirect("/goals?error=" + encodeURIComponent(t.goals.contributionValidationError));
  }

  const { data: goal } = await supabase.from("goals").select("saved").eq("id", id).single();
  if (!goal) return;

  await supabase
    .from("goals")
    .update({ saved: Number(goal.saved) + amount })
    .eq("id", id);

  revalidatePath("/goals");
  redirect("/goals?success=" + encodeURIComponent(t.goals.contributedToast));
}

export async function deleteGoal(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("goals").delete().eq("id", id);
  revalidatePath("/goals");
}
