import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center my-auto">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Pagina non trovata</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Il link che hai seguito non esiste più, o l'indirizzo è sbagliato.
        </p>
        <Link
          href="/"
          className="inline-flex bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    </main>
  );
}
