import Link from "next/link";
import { updatePassword } from "./actions";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";
import { ErrorBanner } from "@/components/error-banner";
import { authErrorText } from "@/lib/auth/auth-error";
import { SubmitButton } from "@/components/submit-button";
import { AuthLegalFooter } from "@/components/auth-legal";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function ImpostaPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { t } = getDictionary();

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm my-auto">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{t.auth.setPassword.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.auth.setPassword.subtitle}
        </p>

        {searchParams.error ? <div className="mb-4"><ErrorBanner message={authErrorText(searchParams.error, t.auth.errors)} /></div> : null}

        <form action={updatePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.auth.setPassword.newPasswordLabel}
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
              showLabel={t.auth.passwordInput.show}
              hideLabel={t.auth.passwordInput.hide}
              strengthLabels={t.auth.passwordStrength}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm_password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.auth.setPassword.confirmPasswordLabel}
            </label>
            <PasswordInput
              id="confirm_password"
              name="confirm_password"
              autoComplete="new-password"
              required
              minLength={6}
              showLabel={t.auth.passwordInput.show}
              hideLabel={t.auth.passwordInput.hide}
            />
          </div>
          <SubmitButton
            pendingText={t.auth.setPassword.submitPending}
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            {t.auth.setPassword.submit}
          </SubmitButton>
        </form>

        <AuthLegalFooter />
      </div>
    </main>
  );
}
