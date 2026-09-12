import { describe, it, expect } from "vitest";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  isCurrency,
  toCurrency,
  moneyFormatter,
  currencySymbol,
} from "@/lib/currency";

// Intl separa la cifra dal simbolo con uno spazio unificatore (U+00A0), non
// con uno spazio normale, e la scelta può cambiare fra una versione di ICU e
// l'altra. Confrontare il carattere esatto renderebbe questi test fragili per
// un motivo che non c'entra niente con le valute.
const spazi = (s: string) => s.replace(/[\s\u00a0\u202f]+/g, " ");

describe("isCurrency / toCurrency", () => {
  it("accepts every currency on the list", () => {
    for (const c of CURRENCIES) expect(isCurrency(c)).toBe(true);
  });

  it("rejects anything else", () => {
    for (const brutto of ["XYZ", "eur", "", "EURO", null, undefined, 42, {}]) {
      expect(isCurrency(brutto)).toBe(false);
    }
  });

  // Una riga vecchia, un campo vuoto, un valore scritto a mano: l'app deve
  // continuare a mostrare importi, non rompersi.
  it("falls back to the euro instead of throwing", () => {
    expect(toCurrency("CHF")).toBe("CHF");
    expect(toCurrency("XYZ")).toBe(DEFAULT_CURRENCY);
    expect(toCurrency(null)).toBe(DEFAULT_CURRENCY);
    expect(toCurrency(undefined)).toBe(DEFAULT_CURRENCY);
  });
});

describe("moneyFormatter", () => {
  it("writes euros the Italian way and the Irish way", () => {
    expect(spazi(moneyFormatter("it-IT", "EUR").format(1234.5))).toBe("1.234,50 €");
    expect(spazi(moneyFormatter("en-IE", "EUR").format(1234.5))).toBe("€1,234.50");
  });

  it("uses the right symbol for each currency", () => {
    expect(moneyFormatter("it-IT", "CHF").format(10)).toContain("CHF");
    expect(moneyFormatter("en-IE", "GBP").format(10)).toContain("£");
    expect(moneyFormatter("en-IE", "USD").format(10)).toContain("$");
  });

  // Il motivo per cui le cifre decimali non si impongono a mano.
  it("gives the yen no decimals, because the yen has none", () => {
    expect(moneyFormatter("it-IT", "JPY").format(1200)).not.toContain(",00");
    expect(moneyFormatter("it-IT", "EUR").format(1200)).toContain(",00");
  });

  it("groups thousands even where CLDR would not, for four digits", () => {
    // Senza useGrouping esplicito l'italiano scriverebbe "1013 €" su Node e
    // "1.013 €" nel browser, e le due versioni non combacerebbero.
    expect(spazi(moneyFormatter("it-IT", "EUR").format(1013))).toBe("1.013,00 €");
  });

  it("takes extra options, like whole amounts only", () => {
    expect(spazi(moneyFormatter("it-IT", "EUR", { maximumFractionDigits: 0 }).format(1013.7))).toBe("1.014 €");
  });
});

describe("currencySymbol", () => {
  it("pulls out just the symbol", () => {
    expect(currencySymbol("it-IT", "EUR")).toBe("€");
    expect(currencySymbol("en-IE", "GBP")).toBe("£");
    expect(currencySymbol("it-IT", "CHF")).toBe("CHF");
  });
});
