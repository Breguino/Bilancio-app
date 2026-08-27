// Il mese che si sta guardando, preso dall'indirizzo. Prima ogni pagina
// guardava solo il mese in corso: il primo di settembre il mese appena chiuso
// spariva, e non c'era modo di tornarci.

export function monthKeyOf(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const FORMATO = /^\d{4}-(0[1-9]|1[0-2])$/;

// Accetta il mese solo se ha la forma giusta e non e' nel futuro: un valore
// arbitrario nell'indirizzo non deve poter mandare la pagina in un mese vuoto
// a cinquant'anni da adesso.
export function resolveMonth(raw: string | undefined, max = monthKeyOf()) {
  const asked = raw?.trim() || "";
  return FORMATO.test(asked) && asked <= max ? asked : max;
}

export function monthBounds(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { start: iso(new Date(y, m - 1, 1)), end: iso(new Date(y, m, 0)) };
}

export function shiftMonth(monthKey: string, by: number) {
  const [y, m] = monthKey.split("-").map(Number);
  return monthKeyOf(new Date(y, m - 1 + by, 1));
}

export function lastMonthKeys(n: number, endKey: string) {
  const [y, m] = endKey.split("-").map(Number);
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) keys.push(monthKeyOf(new Date(y, m - 1 - i, 1)));
  return keys;
}

function dateOf(monthKey: string) {
  return new Date(Number(monthKey.slice(0, 4)), Number(monthKey.slice(5, 7)) - 1, 1);
}

// In italiano Intl scrive "agosto 2026" tutto minuscolo: qui e' un'etichetta,
// non una frase, quindi va con la maiuscola.
export function monthLabel(monthKey: string, intlLocale: string) {
  const testo = new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(dateOf(monthKey));
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}

export function monthName(monthKey: string, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, { month: "long" }).format(dateOf(monthKey));
}
