"use client";

import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locales";

// SVG invece di emoji bandiera: senza font emoji a colori (comune su Windows)
// i caratteri regional-indicator delle emoji vengono mostrati come sigle testuali,
// non come bandiera.
function FlagIT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#009246" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#ce2b37" />
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 60,30M60,0 0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 60,30M60,0 0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gbDiag)" />
      <path d="M30,0V30M0,15H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6" />
      <clipPath id="gbDiag">
        <path d="M30,15 60,0H54L30,12 6,0H0V3L24,15 0,27V30H6L30,18 54,30H60V27L36,15Z" />
      </clipPath>
    </svg>
  );
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const nextLocale = locale === "it" ? "en" : "it";

  return (
    <form action={setLocale} aria-label={label} className="shrink-0">
      <input type="hidden" name="path" value={pathname} />
      <button
        type="submit"
        name="locale"
        value={nextLocale}
        role="switch"
        aria-checked={locale === "en"}
        className="relative inline-flex items-center w-16 h-9 rounded-full border border-border dark:border-neutral-700 bg-surface-alt dark:bg-neutral-800 transition-colors hover:border-accent/50 shrink-0"
      >
        <span className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none select-none">
          <FlagIT
            className={`w-4 h-3 rounded-[1px] transition-opacity duration-300 ease-out ${locale === "it" ? "opacity-0" : "opacity-100"}`}
          />
          <FlagGB
            className={`w-4 h-3 rounded-[1px] transition-opacity duration-300 ease-out ${locale === "en" ? "opacity-0" : "opacity-100"}`}
          />
        </span>
        <span
          className={`absolute top-0.5 left-0.5 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 shadow-sm overflow-hidden transition-transform duration-[420ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu ${
            locale === "en" ? "translate-x-7" : "translate-x-0"
          }`}
        >
          <FlagIT
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out ${locale === "it" ? "opacity-100" : "opacity-0"}`}
          />
          <FlagGB
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out ${locale === "en" ? "opacity-100" : "opacity-0"}`}
          />
        </span>
      </button>
    </form>
  );
}
