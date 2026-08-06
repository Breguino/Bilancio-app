"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { track } from "@vercel/analytics/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidBirthDate, isAdult } from "@/lib/profile";

export async function signup(formData: FormData) {
  const { t } = getDictionary();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const residence = String(formData.get("residence") || "").trim();
  const origin = headers().get("origin");

  // I campi sono già "required" nel form, ma il browser non è l'ultima parola:
  // la stessa richiesta può arrivare senza passare dall'HTML, quindi validiamo
  // di nuovo qui prima di creare l'account.
  if (!firstName || !lastName || !birthDate || !residence) {
    redirect(`/signup?error=${encodeURIComponent(t.auth.signup.missingFieldsError)}`);
  }

  if (!isValidBirthDate(birthDate)) {
    redirect(`/signup?error=${encodeURIComponent(t.auth.signup.invalidBirthDateError)}`);
  }

  if (!isAdult(birthDate)) {
    redirect(`/signup?error=${encodeURIComponent(t.auth.signup.tooYoungError)}`);
  }

  await track("signup_started");

  const supabase = createClient();
  // I dati anagrafici viaggiano nei metadati della registrazione: con la
  // conferma email attiva non c'è ancora una sessione, quindi non potremmo
  // scrivere noi la riga in "profiles" (la RLS la bloccherebbe). Ci pensa il
  // trigger on_auth_user_created a leggerli da qui — vedi supabase/schema.sql.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        residence,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  await track("signup_completed");
  redirect("/signup?check_email=1");
}
