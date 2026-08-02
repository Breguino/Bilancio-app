"use client";

import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <form action={setLocale} aria-label={label} className="flex items-center gap-1 text-xs font-bold shrink-0">
      <input type="hidden" name="path" value={pathname} />
      <button
        type="submit"
        name="locale"
        value="it"
        aria-current={locale === "it"}
        className={
          locale === "it"
            ? "text-accent"
            : "text-ink-muted dark:text-neutral-500 hover:text-ink dark:hover:text-neutral-100"
        }
      >
        IT
      </button>
      <span className="text-ink-muted dark:text-neutral-600" aria-hidden="true">
        /
      </span>
      <button
        type="submit"
        name="locale"
        value="en"
        aria-current={locale === "en"}
        className={
          locale === "en"
            ? "text-accent"
            : "text-ink-muted dark:text-neutral-500 hover:text-ink dark:hover:text-neutral-100"
        }
      >
        EN
      </button>
    </form>
  );
}
