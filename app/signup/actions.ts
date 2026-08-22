"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { track } from "@vercel/analytics/server";
import { isValidBirthDate, isAdult } from "@/lib/profile";
import { authErrorCode } from "@/lib/auth/auth-error";

// L'indirizzo appena registrato serve solo alla schermata "controlla la tua
// email", per poter rimandare il link. Sta in un cookie httpOnly e non nella
// query string: nell'URL finirebbe nella cronologia del browser e nei referer.
const PENDING_EMAIL_COOKIE = "pending_confirmation_email";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const origin = headers().get("origin");

  // I campi sono già "required" nel form, ma il browser non è l'ultima parola:
  // la stessa richiesta può arrivare senza passare dall'HTML, quindi validiamo
  // di nuovo qui prima di creare l'account.
  if (!firstName || !lastName || !birthDate) {
    redirect("/signup?error=missing_fields");
  }

  if (!isValidBirthDate(birthDate)) {
    redirect("/signup?error=invalid_birth_date");
  }

  if (!isAdult(birthDate)) {
    redirect("/signup?error=too_young");
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
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${authErrorCode(error)}`);
  }

  cookies().set(PENDING_EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/signup",
    maxAge: 60 * 30,
  });

  await track("signup_completed");
  redirect("/signup?check_email=1");
}

export async function resendConfirmation() {
  const email = cookies().get(PENDING_EMAIL_COOKIE)?.value;

  if (email) {
    const supabase = createClient();
    // Come per il reset password, l'esito non viene distinto: rispondere in
    // modo diverso a seconda che l'indirizzo esista o sia già confermato
    // direbbe a chiunque quali email hanno un account.
    await supabase.auth.resend({ type: "signup", email });
  }

  redirect("/signup?check_email=1&resent=1");
}
