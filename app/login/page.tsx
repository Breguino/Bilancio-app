import Link from "next/link";
import { login } from "./actions";
import { Brand } from "@/components/brand";
import { PasswordInput } from "@/components/password-input";
import { GoogleSignInButton } from "@/components/google-signin-button";
import { ErrorBanner } from "@/components/error-banner";
import { authErrorText } from "@/lib/auth/auth-error";
import { SubmitButton } from "@/components/submit-button";
import { AuthLegalFooter } from "@/components/auth-legal";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const { t } = getDictionary();

  return (
    // my-auto sul figlio, non items-center sul padre: se il contenuto supera il
    // viewport (telefono corto o tastiera aperta) i margini collassano e il blocco
    // parte dall'alto, invece di restare incollato sotto la barra del browser.
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm my-auto">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-ink-secondary dark:text-neutral-400 hover:text-accent transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.auth.backToHome}
        </Link>

        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <Brand size={40} nameClassName="text-2xl" />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{t.auth.login.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.auth.login.subtitle}
        </p>

        {searchParams.error ? (
          <div className="mb-4">
            <ErrorBanner message={authErrorText(searchParams.error, t.auth.errors)} />
          </div>
        ) : null}

        <GoogleSignInButton label={t.auth.continueWithGoogle} />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border dark:bg-neutral-800" />
          <span className="text-xs text-ink-muted dark:text-neutral-500">{t.auth.orDivider}</span>
          <div className="h-px flex-1 bg-border dark:bg-neutral-800" />
        </div>

        <form action={login} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={searchParams.next || "/dashboard"} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.auth.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
                {t.auth.login.passwordLabel}
              </label>
              <Link href="/reset-password" className="text-xs font-medium text-accent hover:underline">
                {t.auth.login.forgotPassword}
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              showLabel={t.auth.passwordInput.show}
              hideLabel={t.auth.passwordInput.hide}
            />
          </div>
          <SubmitButton
            pendingText={t.auth.login.submitPending}
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            {t.auth.login.submit}
          </SubmitButton>
        </form>

        <p className="text-sm text-ink-secondary dark:text-neutral-400 mt-6">
          {t.auth.login.noAccount}{" "}
          <Link href="/signup" className="text-accent font-medium">
            {t.auth.login.signupLink}
          </Link>
        </p>

        <AuthLegalFooter />
      </div>
    </main>
  );
}
