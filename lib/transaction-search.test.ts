import { describe, it, expect } from "vitest";
import { transactionSearchFilter } from "@/lib/transaction-search";

describe("transactionSearchFilter", () => {
  it("searches description and category with the same pattern", () => {
    expect(transactionSearchFilter("caffè")).toBe(
      'description.ilike."%caffè%",category.ilike."%caffè%"'
    );
  });

  it("adds the matching contacts when there are any", () => {
    expect(transactionSearchFilter("verdi", ["aaa-111", "bbb-222"])).toBe(
      'description.ilike."%verdi%",category.ilike."%verdi%",contact_id.in.(aaa-111,bbb-222)'
    );
  });

  // Il motivo per cui questo file esiste: una virgola nel testo cercato
  // spezzerebbe la stringa dei filtri in due condizioni diverse.
  it("keeps a comma inside the search term from splitting the filter", () => {
    const f = transactionSearchFilter("bar, ristorante");
    expect(f).toBe('description.ilike."%bar, ristorante%",category.ilike."%bar, ristorante%"');
    // Due condizioni, non tre: la virgola sta dentro le virgolette.
    expect(f.split('",').length).toBe(2);
  });

  it("escapes quotes and backslashes instead of letting them close the value", () => {
    expect(transactionSearchFilter('vino "buono"')).toBe(
      'description.ilike."%vino \\"buono\\"%",category.ilike."%vino \\"buono\\"%"'
    );
    expect(transactionSearchFilter("c:\\temp")).toContain('"%c:\\\\temp%"');
  });

  it("survives the characters that mean something to PostgREST", () => {
    for (const cattivo of ["(", ")", ".", "*", ",", '"', "\\"]) {
      expect(() => transactionSearchFilter(`spesa${cattivo}test`)).not.toThrow();
    }
  });
});
