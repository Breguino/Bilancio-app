import { describe, it, expect } from "vitest";
import {
  monthKeyOf,
  resolveMonth,
  monthBounds,
  shiftMonth,
  lastMonthKeys,
  monthLabel,
  monthName,
} from "@/lib/month";

// Questo modulo decide i confini di ogni mese, e quindi ogni totale che l'app
// mostra: se monthBounds sbaglia di un giorno, la panoramica somma un movimento
// che non c'entra e nessun test se ne accorge. Fino a qui non ne aveva nessuno.
//
// I valori attesi sono ricavati dalle definizioni, non copiati da
// un'esecuzione. Le date si costruiscono e si formattano entrambe in ora
// locale, quindi i risultati non dipendono dal fuso: verificato girando la
// suite anche a UTC+14 e a UTC-11, dove un errore di fuso si vedrebbe.

describe("monthKeyOf", () => {
  it("writes the month with two digits", () => {
    expect(monthKeyOf(new Date(2026, 0, 15))).toBe("2026-01");
    expect(monthKeyOf(new Date(2026, 8, 1))).toBe("2026-09");
    expect(monthKeyOf(new Date(2026, 11, 31))).toBe("2026-12");
  });

  it("takes the day it is when nobody passes a date", () => {
    expect(monthKeyOf()).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });
});

describe("resolveMonth", () => {
  it("keeps a month in the past, and the current one", () => {
    expect(resolveMonth("2026-03", "2026-09")).toBe("2026-03");
    expect(resolveMonth("2026-09", "2026-09")).toBe("2026-09");
    expect(resolveMonth("2019-12", "2026-09")).toBe("2019-12");
  });

  // Il confronto è fra stringhe, e funziona solo perché il mese ha sempre due
  // cifre: "2025-12" <= "2026-01" a dicembre come a gennaio.
  it("compares across the turn of the year", () => {
    expect(resolveMonth("2025-12", "2026-01")).toBe("2025-12");
    expect(resolveMonth("2026-02", "2026-01")).toBe("2026-01");
  });

  it("refuses the future and falls back to the current month", () => {
    expect(resolveMonth("2027-01", "2026-09")).toBe("2026-09");
    expect(resolveMonth("2099-12", "2026-09")).toBe("2026-09");
  });

  it("refuses anything that is not a month", () => {
    for (const brutto of ["2026-13", "2026-00", "2026-1", "26-01", "2026/01", "", "   ", "abc", "2026-01-01", "12026-01"]) {
      expect(resolveMonth(brutto, "2026-09")).toBe("2026-09");
    }
    expect(resolveMonth(undefined, "2026-09")).toBe("2026-09");
  });

  it("ignores the spaces around it", () => {
    expect(resolveMonth("  2026-05  ", "2026-09")).toBe("2026-05");
  });

  // Comportamento attuale, non desiderato: la forma \d{4} accetta anche gli
  // anni sotto il 100, e JavaScript mappa gli anni 0-99 sul Novecento. Con
  // ?month=0000-01 la pagina finisce nel gennaio 1900 — un mese vuoto con
  // l'etichetta sbagliata. Non si perde niente e non si apre niente, ma è
  // scritto qui perché sia visibile: il giorno che si stringa la forma, questo
  // test cade e va aggiornato di proposito.
  it("accepts years below 100 today, which JavaScript maps onto the 1900s", () => {
    expect(resolveMonth("0000-01", "2026-09")).toBe("0000-01");
    expect(monthBounds("0000-01").start).toBe("1900-01-01");
    expect(monthBounds("0050-03").start).toBe("1950-03-01");
  });
});

describe("monthBounds", () => {
  it("goes from the first to the last day", () => {
    expect(monthBounds("2026-01")).toEqual({ start: "2026-01-01", end: "2026-01-31" });
    expect(monthBounds("2026-04")).toEqual({ start: "2026-04-01", end: "2026-04-30" });
    expect(monthBounds("2026-12")).toEqual({ start: "2026-12-01", end: "2026-12-31" });
  });

  it("gets February right, leap year or not", () => {
    expect(monthBounds("2026-02").end).toBe("2026-02-28");
    expect(monthBounds("2024-02").end).toBe("2024-02-29");
  });

  // La regola dei secoli: divisibile per 100 non è bisestile, divisibile per
  // 400 sì. È il caso che una sottrazione di giorni fatta a mano sbaglia.
  it("gets the century rule right too", () => {
    expect(monthBounds("1900-02").end).toBe("1900-02-28");
    expect(monthBounds("2000-02").end).toBe("2000-02-29");
  });

  it("pads days and months to two digits", () => {
    const { start, end } = monthBounds("2026-09");
    expect(start).toBe("2026-09-01");
    expect(end).toBe("2026-09-30");
  });
});

describe("shiftMonth", () => {
  it("steps back and forward by one", () => {
    expect(shiftMonth("2026-05", -1)).toBe("2026-04");
    expect(shiftMonth("2026-05", 1)).toBe("2026-06");
  });

  it("crosses the year in both directions", () => {
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
  });

  it("takes jumps longer than a year", () => {
    expect(shiftMonth("2026-06", 6)).toBe("2026-12");
    expect(shiftMonth("2026-06", 7)).toBe("2027-01");
    expect(shiftMonth("2026-06", -18)).toBe("2024-12");
  });

  it("stays put on zero", () => {
    expect(shiftMonth("2026-06", 0)).toBe("2026-06");
  });
});

describe("lastMonthKeys", () => {
  it("ends on the month asked for, oldest first", () => {
    expect(lastMonthKeys(3, "2026-01")).toEqual(["2025-11", "2025-12", "2026-01"]);
  });

  it("returns just that month when one is asked for", () => {
    expect(lastMonthKeys(1, "2026-05")).toEqual(["2026-05"]);
  });

  it("gives the six months the overview draws", () => {
    expect(lastMonthKeys(6, "2026-03")).toEqual([
      "2025-10",
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
  });

  it("goes back more than a year without repeating a month", () => {
    const keys = lastMonthKeys(13, "2026-01");
    expect(keys).toHaveLength(13);
    expect(keys[0]).toBe("2025-01");
    expect(keys[12]).toBe("2026-01");
    expect(new Set(keys).size).toBe(13);
  });

  it("returns nothing for zero", () => {
    expect(lastMonthKeys(0, "2026-01")).toEqual([]);
  });
});

describe("monthLabel / monthName", () => {
  // Intl separa le parole con spazi che possono cambiare fra una versione di
  // ICU e l'altra: il confronto si fa sulle parole, non sui caratteri esatti.
  const spazi = (s: string) => s.replace(/[\s  ]+/g, " ");

  it("capitalises the Italian label, which Intl writes lowercase", () => {
    expect(spazi(monthLabel("2026-08", "it-IT"))).toBe("Agosto 2026");
    expect(spazi(monthLabel("2026-01", "it-IT"))).toBe("Gennaio 2026");
  });

  it("leaves English alone, where the month is already capitalised", () => {
    expect(spazi(monthLabel("2026-08", "en-GB"))).toBe("August 2026");
  });

  it("gives the bare month name without the year", () => {
    expect(monthName("2026-08", "it-IT")).toBe("agosto");
    expect(monthName("2026-12", "it-IT")).toBe("dicembre");
    expect(monthName("2026-08", "en-GB")).toBe("August");
  });

  it("names all twelve months without repeating one", () => {
    const nomi = Array.from({ length: 12 }, (_, i) =>
      monthName(`2026-${String(i + 1).padStart(2, "0")}`, "it-IT")
    );
    expect(new Set(nomi).size).toBe(12);
    expect(nomi[0]).toBe("gennaio");
    expect(nomi[11]).toBe("dicembre");
  });
});
