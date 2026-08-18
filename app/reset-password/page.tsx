import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { AuthLegalFooter } from "@/components/auth-legal";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  const { t } = getDictionary();

  if (searchParams.sent) {
    return (
      <main className="min-h-screen flex justify-center px-6 py-10">
        <div className="w-full max-w-sm text-center my-auto">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
            <Logo size={40} />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">{t.auth.resetPassword.sentTitle}</h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-sm">
            {t.auth.resetPassword.sentBodyPre}{" "}
            <Link href="/login" className="text-accent font-medium">{t.auth.resetPassword.sentBodyLoginWord}</Link>.
          </p>

          <AuthLegalFooter align="center" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm my-auto">
        <Link
          href="/login"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-ink-secondary dark:text-neutral-400 hover:text-accent transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.auth.backToLogin}
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{t.auth.resetPassword.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.auth.resetPassword.subtitle}
        </p>

        <form action={requestPasswordReset} className="flex flex-col gap-4">
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
          <SubmitButton
            pendingText={t.auth.resetPassword.submitPending}
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            {t.auth.resetPassword.submit}
          </SubmitButton>
        </form>

        <AuthLegalFooter />
      </div>
    </main>
  );
}
