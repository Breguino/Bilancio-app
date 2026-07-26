"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center my-auto">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg mb-8" aria-label="Bilancino">
          <Logo size={40} />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Qualcosa è andato storto</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          Si è verificato un errore imprevisto. Riprova, o torna alla home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="border border-border dark:border-neutral-800 font-semibold text-sm rounded-full px-6 py-2.5 hover:border-accent hover:text-accent transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </main>
  );
}
