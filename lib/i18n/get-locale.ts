import { cookies } from "next/headers";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "./locales";

export function getLocale(): Locale {
  const raw = cookies().get(LOCALE_COOKIE)?.value;
  return (locales as readonly string[]).includes(raw || "") ? (raw as Locale) : defaultLocale;
}
