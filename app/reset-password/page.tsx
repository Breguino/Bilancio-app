import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { Logo } from "@/components/logo";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { sent?: string };
}) {
  if (searchParams.sent) {
    return (
      <main className="min-h-screen flex justify-center px-6 py-10">
        <div className="w-full max-w-sm text-center my-auto">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
            <Logo size={40} />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">Controlla la tua email</h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-sm">
            Se esiste un account con quell'indirizzo, ti abbiamo inviato un link per reimpostare la
            password. Aprilo per continuare, poi torna ad{" "}
            <Link href="/login" className="text-accent font-medium">accedere</Link>.
          </p>
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
          Torna al login
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Password dimenticata</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Inserisci l'email del tuo account: ti mandiamo un link per impostarne una nuova.
        </p>

        <form action={requestPasswordReset} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="mt-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full py-2.5 transition-colors"
          >
            Invia link
          </button>
        </form>
      </div>
    </main>
  );
}
