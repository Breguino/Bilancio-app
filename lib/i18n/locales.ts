export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";
export const LOCALE_COOKIE = "locale";

// Il tag che si passa a Intl per formattare numeri, valute e date.
//
// Perché "en-GB" e non "en-US": le date vanno col giorno davanti — 16/09/2026,
// come in italiano. Con "en-US" la stessa data diventa 9/16/2026, e un "03/04"
// letto dalla persona sbagliata è marzo invece di aprile.
//
// Prima questa riga stava scritta a mano in quindici file, e per giunta in due
// varianti: "en-IE" per i soldi, "en-GB" per le date. Misurate tutte e due: per
// tutte e dodici le valute supportate — simbolo compreso — e per decimali e date
// lunghe, i due tag danno esattamente lo stesso risultato. L'unica differenza è
// la data corta, dove "en-GB" mette lo zero davanti al mese. Quindi ne basta
// uno, ed è quello che scrive le date meglio.
export function intlLocaleFor(locale: Locale): string {
  return locale === "it" ? "it-IT" : "en-GB";
}
