import { getLocale } from "./get-locale";
import { dictionaries, dictionaryFor } from "./dictionaries";
import { intlLocaleFor } from "./locales";

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale], intlLocale: intlLocaleFor(locale) };
}

export { dictionaryFor };
