// La valuta dell'account. Una sola per utente: tutti gli importi sono in
// quella, quindi le somme restano vere senza dover convertire niente e senza
// dipendere da un fornitore di cambi.
//
// L'elenco è chiuso. Un codice arbitrario in una colonna che decide come si
// legge ogni cifra dell'app è un guasto silenzioso: Intl accetterebbe anche
// "XYZ" e scriverebbe "XYZ 12,00" senza lamentarsi. Lo stesso elenco è ripetuto
// come vincolo sulla tabella profiles (vedi supabase/schema.sql): aggiungerne
// una vuol dire toccare tutti e due i posti.
export const CURRENCIES = [
  "EUR",
  "CHF",
  "GBP",
  "USD",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "CAD",
  "AUD",
  "JPY",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

// Quello che arriva dal database o da un modulo non è garantito: una riga
// vecchia, un valore scritto a mano, un campo vuoto. Si torna all'euro invece
// di far scoppiare la pagina.
export function toCurrency(value: unknown): Currency {
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}

// Il formattatore degli importi. Le cifre decimali non le imponiamo: le decide
// Intl in base alla valuta, ed è giusto così — lo yen non ha centesimi, e
// scrivere "¥ 1.200,00" sarebbe sbagliato.
export function moneyFormatter(
  intlLocale: string,
  currency: Currency,
  options: Intl.NumberFormatOptions = {}
): Intl.NumberFormat {
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    // Esplicito perché per l'italiano i dati CLDR raggruppano solo da cinque
    // cifre in su, e Node e il browser applicano quella regola in versioni
    // diverse: il server scriveva "1013 €" e il browser "1.013 €", e React
    // ridisegnava il riquadro a ogni visita.
    useGrouping: true,
    ...options,
  });
}

// Il simbolo da solo, per i segnaposto dei campi e per l'import CSV.
export function currencySymbol(intlLocale: string, currency: Currency): string {
  const parti = moneyFormatter(intlLocale, currency).formatToParts(0);
  return parti.find((p) => p.type === "currency")?.value ?? currency;
}
