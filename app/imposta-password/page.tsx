import Link from "next/link";
import { updatePassword } from "./actions";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";
import { ErrorBanner } from "@/components/error-banner";

export default function ImpostaPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm my-auto">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Imposta una nuova password</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Scegli la password che vuoi usare da ora in poi.
        </p>

        {searchParams.error ? <div className="mb-4"><ErrorBanner message={searchParams.error} /></div> : null}

        <form action={updatePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              Nuova password
            </label>
            <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={6} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm_password" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              Ripeti la password
            </label>
            <PasswordInput id="confirm_password" name="confirm_password" autoComplete="new-password" required minLength={6} />
          </div>
          <button
            type="submit"
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            Salva password
          </button>
        </form>
      </div>
    </main>
  );
}
