import { describe, it, expect } from "vitest";
import { intlLocaleFor, locales } from "@/lib/i18n/locales";
import { CURRENCIES, moneyFormatter } from "@/lib/currency";

const spazi = (s: string) => s.replace(/ /g, " ");

describe("intlLocaleFor", () => {
  it("dà un tag per ogni lingua che l'app conosce", () => {
    expect(intlLocaleFor("it")).toBe("it-IT");
    expect(intlLocaleFor("en")).toBe("en-GB");
    // Se domani si aggiunge una lingua, questo scatta invece di lasciare
    // che una pagina formatti con un tag vuoto.
    for (const l of locales) {
      expect(intlLocaleFor(l), `${l} non ha un tag`).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    }
  });
});

// Questo è il motivo per cui il tag inglese è en-GB e non en-US, ed è
// l'errore che cambierebbe il significato senza dare segno: in un file
// esportato o in una ricevuta, "03/04" è il 3 aprile per noi e il 4 marzo
// per un americano. Nessuno se ne accorgerebbe leggendo il codice.
describe("le date escono col giorno davanti, in tutte e due le lingue", () => {
  const treAprile = new Date("2026-04-03T12:00:00Z");

  it("in italiano", () => {
    expect(treAprile.toLocaleDateString(intlLocaleFor("it"))).toMatch(/^0?3\/0?4\/2026$/);
  });

  it("in inglese", () => {
    expect(treAprile.toLocaleDateString(intlLocaleFor("en"))).toMatch(/^0?3\/0?4\/2026$/);
  });

  it("il mese per esteso resta leggibile", () => {
    const lunga = (l: "it" | "en") =>
      new Intl.DateTimeFormat(intlLocaleFor(l), { day: "numeric", month: "long", year: "numeric" }).format(treAprile);
    expect(lunga("it")).toBe("3 aprile 2026");
    expect(lunga("en")).toBe("3 April 2026");
  });
});

// I due tag che stavano scritti a mano prima di questa funzione erano
// "en-IE" per i soldi e "en-GB" per le date. Sono stati unificati su en-GB
// dopo aver misurato che per tutte le valute dell'app danno lo stesso
// risultato: questo test è quella misura, messa dove non può scadere.
describe("l'unificazione su en-GB non cambia come si leggono gli importi", () => {
  it("per tutte le valute supportate, en-GB dà quello che dava en-IE", () => {
    for (const valuta of CURRENCIES) {
      const gb = new Intl.NumberFormat("en-GB", { style: "currency", currency: valuta }).format(1234.5);
      const ie = new Intl.NumberFormat("en-IE", { style: "currency", currency: valuta }).format(1234.5);
      expect(gb, `${valuta} verrebbe scritta diversamente`).toBe(ie);
    }
  });

  it("e l'italiano continua a mettere il simbolo in fondo, con le migliaia", () => {
    // Si passa da moneyFormatter e non da Intl grezzo perché è quello che usa
    // l'app: l'italiano non raggruppa le migliaia sotto le cinque cifre
    // (in CLDR `minimumGroupingDigits` vale 2), e moneyFormatter forza il
    // raggruppamento apposta. Con Intl nudo uscirebbe "1234,50 €".
    expect(spazi(moneyFormatter(intlLocaleFor("it"), "EUR").format(1234.5))).toBe("1.234,50 €");
    expect(spazi(moneyFormatter(intlLocaleFor("en"), "EUR").format(1234.5))).toBe("€1,234.50");
  });
});
