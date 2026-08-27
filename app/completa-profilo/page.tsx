import Link from "next/link";
import { redirect } from "next/navigation";
import { completeProfile } from "./actions";
import { Brand } from "@/components/brand";
import { ErrorBanner } from "@/components/error-banner";
import { authErrorText } from "@/lib/auth/auth-error";
import { SubmitButton } from "@/components/submit-button";
import { AuthConsentNote, AuthLegalFooter } from "@/components/auth-legal";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isProfileComplete, type Profile } from "@/lib/profile";

export default async function CompletaProfiloPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { t } = getDictionary();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, birth_date")
    .eq("user_id", user.id)
    .maybeSingle();

  // Chi ha già i dati non ha niente da completare: evita che la pagina resti
  // raggiungibile a mano e riproponga un form inutile.
  if (isProfileComplete(profile as Profile | null)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm my-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <Brand size={40} nameClassName="text-2xl" />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{t.auth.completeProfile.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.auth.completeProfile.subtitle}
        </p>

        {searchParams.error ? (
          <div className="mb-4">
            <ErrorBanner message={authErrorText(searchParams.error, t.auth.errors)} />
          </div>
        ) : null}

        <form action={completeProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first_name" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
                {t.auth.profileFields.firstNameLabel}
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                defaultValue={profile?.first_name ?? ""}
                className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="last_name" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
                {t.auth.profileFields.lastNameLabel}
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                autoComplete="family-name"
                defaultValue={profile?.last_name ?? ""}
                className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="birth_date" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.auth.profileFields.birthDateLabel}
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              required
              autoComplete="bday"
              defaultValue={profile?.birth_date ?? ""}
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-transparent"
            />
            <span className="text-xs text-ink-muted dark:text-neutral-500">{t.auth.profileFields.birthDateHint}</span>
          </div>
          <SubmitButton
            pendingText={t.auth.completeProfile.submitPending}
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            {t.auth.completeProfile.submit}
          </SubmitButton>

          <AuthConsentNote variant="continue" />
        </form>

        {/* Chi entra con Google finisce qui senza averlo chiesto: senza una via
            di uscita resterebbe bloccato sul form, con la sessione aperta e
            nessun modo di chiuderla. La rotta /logout accetta solo POST. */}
        <form action="/logout" method="post" className="mt-6 text-center">
          <span className="text-sm text-ink-secondary dark:text-neutral-400">
            {t.auth.completeProfile.notYouPre}{" "}
          </span>
          <button type="submit" className="text-sm font-medium text-accent hover:underline">
            {t.auth.completeProfile.signOut}
          </button>
        </form>

        <AuthLegalFooter />
      </div>
    </main>
  );
}
