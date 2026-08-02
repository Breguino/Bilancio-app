import { getLocale } from "./get-locale";
import { dictionaries, dictionaryFor } from "./dictionaries";

export function getDictionary() {
  const locale = getLocale();
  return { locale, t: dictionaries[locale] };
}

export { dictionaryFor };
