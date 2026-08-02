"use client";

import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locales";

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
        <span className="absolute inset-0 flex items-center justify-between px-2.5 text-[10px] font-bold text-ink-muted dark:text-neutral-500 pointer-events-none select-none">
          <span className={locale === "it" ? "opacity-0" : "opacity-100"}>IT</span>
          <span className={locale === "en" ? "opacity-0" : "opacity-100"}>EN</span>
        </span>
        <span
          className={`absolute top-0.5 left-0.5 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center text-[10px] font-bold text-accent transition-transform duration-200 ease-out ${
            locale === "en" ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {locale.toUpperCase()}
        </span>
      </button>
    </form>
  );
}
