"use client";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { dictionaryFor } from "@/lib/i18n/dictionaries";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locales";

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const raw = match ? decodeURIComponent(match[1]) : "";
  return (locales as readonly string[]).includes(raw) ? (raw as Locale) : defaultLocale;
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // console.error finisce nella console di chi ha il problema, cioè dove
    // non la legge nessuno. Sentry lo manda anche a noi — e se il DSN non è
    // impostato questa riga non fa niente.
    Sentry.captureException(error);
    console.error(error);
    setLocale(readLocaleCookie());
  }, [error]);

  const t = dictionaryFor(locale);

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center my-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <Brand size={40} nameClassName="text-2xl" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">{t.errors.somethingWrongTitle}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.errors.somethingWrongBody}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            {t.errors.retry}
          </button>
          <Link
            href="/"
            className="border border-border dark:border-neutral-800 font-semibold text-sm rounded-full px-6 py-2.5 hover:border-accent hover:text-accent transition-colors"
          >
            {t.errors.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
