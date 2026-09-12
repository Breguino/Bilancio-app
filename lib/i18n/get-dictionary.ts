import { getLocale } from "./get-locale";
import { dictionaries, dictionaryFor } from "./dictionaries";

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}

export { dictionaryFor };
