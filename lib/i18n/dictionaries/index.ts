import it from "./it";
import en from "./en";
import type { Locale } from "../locales";

export const dictionaries = { it, en };

export function dictionaryFor(locale: Locale) {
  return dictionaries[locale];
}
