"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import { locales, type Locale } from "@/lib/i18n/locales";

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

const FLAGS: Record<Locale, typeof FlagIT> = {
  it: FlagIT,
  en: FlagGB,
};

const LOCALE_LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
};

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const CurrentFlag = FLAGS[locale];

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border dark:border-neutral-700 bg-surface-alt dark:bg-neutral-800 overflow-hidden transition-colors hover:border-accent/50"
      >
        <CurrentFlag className="w-full h-full" />
      </button>

      <form
        action={setLocale}
        role="listbox"
        aria-label={label}
        className={`absolute right-0 top-full mt-2 z-30 min-w-[9.5rem] rounded-xl border border-border dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg py-1 origin-top-right transition-all duration-150 ease-out ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <input type="hidden" name="path" value={pathname} />
        {locales.map((loc) => {
          const Flag = FLAGS[loc];
          return (
            <button
              key={loc}
              type="submit"
              name="locale"
              value={loc}
              role="option"
              aria-selected={loc === locale}
              tabIndex={open ? 0 : -1}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-left hover:bg-surface-alt dark:hover:bg-neutral-800 transition-colors ${
                loc === locale ? "text-accent" : "text-ink-secondary dark:text-neutral-300"
              }`}
            >
              <Flag className="w-5 h-3.5 rounded-[1px] shrink-0" />
              {LOCALE_LABELS[loc]}
            </button>
          );
        })}
      </form>
    </div>
  );
}
