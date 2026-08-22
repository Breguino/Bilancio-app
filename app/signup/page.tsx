import Link from "next/link";
import { signup } from "./actions";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";
import { GoogleSignInButton } from "@/components/google-signin-button";
import { ErrorBanner } from "@/components/error-banner";
import { authErrorText } from "@/lib/auth/auth-error";
import { SubmitButton } from "@/components/submit-button";
import { ResendConfirmation } from "@/components/resend-confirmation";
import { AuthConsentNote, AuthLegalFooter } from "@/components/auth-legal";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; check_email?: string; resent?: string };
}) {
  const { t } = getDictionary();

  if (searchParams.check_email) {
    return (
      <main className="min-h-screen flex justify-center px-6 py-10">
        <div className="w-full max-w-sm text-center my-auto">
          <Link
            href="/"
            className="flex w-fit mx-auto items-center gap-1.5 text-sm font-medium text-ink-secondary dark:text-neutral-400 hover:text-accent transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.auth.backToHome}
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">{t.auth.signup.checkEmailTitle}</h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
            {t.auth.signup.checkEmailBodyPre}{" "}
            <Link href="/login" className="text-accent font-medium">{t.auth.signup.checkEmailLoginWord}</Link>.
          </p>

          <ResendConfirmation
            resent={Boolean(searchParams.resent)}
            labels={{
              resend: t.auth.signup.resend,
              pending: t.auth.signup.resendPending,
              cooldown: t.auth.signup.resendCooldown,
              spam: t.auth.signup.resendSpam,
              done: t.auth.signup.resendDone,
            }}
          />

          <AuthLegalFooter align="center" />
        </div>
      </main>
    );
  }

  return (
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

        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{t.auth.signup.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.auth.signup.subtitle}
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

        <form action={signup} className="flex flex-col gap-4">
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
              className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-transparent"
            />
            <span className="text-xs text-ink-muted dark:text-neutral-500">{t.auth.profileFields.birthDateHint}</span>
          </div>
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
            <label htmlFor="password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              {t.auth.signup.passwordLabel}
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              showLabel={t.auth.passwordInput.show}
              hideLabel={t.auth.passwordInput.hide}
              strengthLabels={t.auth.passwordStrength}
            />
          </div>
          <SubmitButton
            pendingText={t.auth.signup.submitPending}
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            {t.auth.signup.submit}
          </SubmitButton>

          <AuthConsentNote variant="signup" />
        </form>

        <p className="text-sm text-ink-secondary dark:text-neutral-400 mt-6">
          {t.auth.signup.haveAccount}{" "}
          <Link href="/login" className="text-accent font-medium">
            {t.auth.signup.loginLink}
          </Link>
        </p>

        <AuthLegalFooter />
      </div>
    </main>
  );
}
