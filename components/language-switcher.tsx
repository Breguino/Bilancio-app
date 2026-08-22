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

// Nomi nella lingua nativa (non tradotti): "Italiano" e "English" restano
// riconoscibili indipendentemente dalla lingua corrente dell'interfaccia.
const LOCALE_NAMES: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
};

const FLAGS: Record<Locale, typeof FlagIT> = {
  it: FlagIT,
  en: FlagGB,
};

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const nextLocale = locale === "it" ? "en" : "it";
  const NextFlag = FLAGS[nextLocale];

  return (
    <div className="relative group shrink-0">
      <span
        role="tooltip"
        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-md bg-ink dark:bg-neutral-700 text-white text-xs font-medium px-2.5 py-1.5 shadow-md opacity-0 scale-95 translate-y-[-2px] pointer-events-none transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 z-30"
      >
        <NextFlag className="w-4 h-3 rounded-[1px] shrink-0" />
        {LOCALE_NAMES[nextLocale]}
      </span>
      <form action={setLocale}>
        <input type="hidden" name="path" value={pathname} />
        <button
          type="submit"
          name="locale"
          value={nextLocale}
          aria-label={label}
          className="relative w-9 h-9 rounded-full border border-border dark:border-neutral-700 bg-surface-alt dark:bg-neutral-800 overflow-hidden shrink-0 transition-colors hover:border-accent/50 active:scale-95"
        >
          <FlagIT
            className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-out ${locale === "it" ? "opacity-100" : "opacity-0"}`}
          />
          <FlagGB
            className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-out ${locale === "en" ? "opacity-100" : "opacity-0"}`}
          />
        </button>
      </form>
    </div>
  );
}
