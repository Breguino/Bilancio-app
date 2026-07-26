import Link from "next/link";
import { login } from "./actions";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
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
          Torna alla home
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Accedi</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Entra con il tuo account per vedere i tuoi dati.
        </p>

        {searchParams.error ? (
          <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm px-3 py-2">
            {searchParams.error}
          </p>
        ) : null}

        <form action={login} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={searchParams.next || "/dashboard"} />
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
            <PasswordInput id="password" name="password" autoComplete="current-password" required />
          </div>
          <button
            type="submit"
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            Accedi
          </button>
        </form>

        <p className="text-sm text-ink-secondary dark:text-neutral-400 mt-6">
          Non hai un account?{" "}
          <Link href="/signup" className="text-accent font-medium">
            Registrati
          </Link>
        </p>
      </div>
    </main>
  );
}
