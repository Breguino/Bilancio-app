import Link from "next/link";
import { signup } from "./actions";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; check_email?: string };
}) {
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
            Torna alla home
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">Controlla la tua email</h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-sm">
            Ti abbiamo inviato un link di conferma. Aprilo per attivare il tuo account, poi torna
            ad <Link href="/login" className="text-accent font-medium">accedere</Link>.
          </p>
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
          Torna alla home
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Crea il tuo account</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Ogni account ha i propri dati, separati e privati.
        </p>

        {searchParams.error ? (
          <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm px-3 py-2">
            {searchParams.error}
          </p>
        ) : null}

        <form action={signup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">
              Email
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
              Password
            </label>
            <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={8} />
            <span className="text-xs text-ink-muted dark:text-neutral-500">Almeno 8 caratteri.</span>
          </div>
          <button
            type="submit"
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            Registrati
          </button>
        </form>

        <p className="text-sm text-ink-secondary dark:text-neutral-400 mt-6">
          Hai gia' un account?{" "}
          <Link href="/login" className="text-accent font-medium">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
