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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  const amount = parseFloat(String(formData.get("amount") || "0"));
  if (!id) return;
  if (!(amount > 0)) {
    redirect("/goals?error=" + encodeURIComponent(t.goals.contributionValidationError));
  }

  const { data: goal, error: fetchError } = await supabase
    .from("goals")
    .select("saved")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (fetchError || !goal) {
    redirect("/goals?error=" + encodeURIComponent(t.common.notFoundError));
  }

  // Nota: leggi-poi-scrivi, non atomico — due contributi quasi simultanei
  // sullo stesso obiettivo possono in teoria perderne uno (race condition).
  // Un incremento atomico richiederebbe una funzione Postgres lato database.
  const { error, count } = await supabase
    .from("goals")
    .update({ saved: Number(goal.saved) + amount }, { count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect("/goals?error=" + encodeURIComponent(t.common.actionFailedError));
  }

  revalidatePath("/goals");
  redirect("/goals?success=" + encodeURIComponent(t.goals.contributedToast));
}

export async function deleteGoal(formData: FormData) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error, count } = await supabase
    .from("goals")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error || count === 0) {
    redirect("/goals?error=" + encodeURIComponent(t.common.notFoundError));
  }

  revalidatePath("/goals");
}
