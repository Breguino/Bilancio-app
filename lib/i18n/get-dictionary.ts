import { getLocale } from "./get-locale";
import it from "./dictionaries/it";
import en from "./dictionaries/en";
import type { Locale } from "./locales";

const dictionaries = { it, en };

export function getDictionary() {
  const locale = getLocale();
  return { locale, t: dictionaries[locale] };
}

export function dictionaryFor(locale: Locale) {
  return dictionaries[locale];
}
