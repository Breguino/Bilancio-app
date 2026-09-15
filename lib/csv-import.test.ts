import { describe, it, expect } from "vitest";
import { parseImportCsv, parseContactsCsv } from "@/lib/csv-import";
import { csvField } from "@/lib/csv-export";

const noContacts: { id: string; name: string }[] = [];

describe("parseImportCsv", () => {
  it("parses a standard semicolon file with Italian dates and decimal commas", () => {
    const csv = [
      "Data;Descrizione;Categoria;Cliente;Importo",
      "23/07/2026;Enel;Benzina;;-30,00",
      "23/07/2026;Stipendio;Entrata;Ardian Bregu;1000,00",
    ].join("\r\n");

    const result = parseImportCsv(csv, [{ id: "c1", name: "Ardian Bregu" }]);

    expect(result.imported).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.rows[0]).toEqual({
      description: "Enel",
      category: "Benzina",
      date: "2026-07-23",
      amount: -30,
      contact_id: null,
    });
    expect(result.rows[1]).toMatchObject({
      description: "Stipendio",
      category: null, // "Entrata" è il segnaposto per nessuna categoria, non va importato come tale
      amount: 1000,
      contact_id: "c1",
    });
  });

  it("skips rows missing description, date, or a nonzero amount, and counts them", () => {
    const csv = [
      "Data;Descrizione;Categoria;Cliente;Importo",
      ";Senza data;;;10,00",
      "23/07/2026;;;;10,00",
      "23/07/2026;Importo zero;;;0",
      "23/07/2026;Importo non numerico;;;abc",
      "23/07/2026;Riga valida;;;5,00",
    ].join("\r\n");

    const result = parseImportCsv(csv, noContacts);

    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(4);
    expect(result.rows[0].description).toBe("Riga valida");
  });

  it("links a contact only on an exact case-insensitive name match, never creating one", () => {
    const csv = [
      "Data;Descrizione;Categoria;Cliente;Importo",
      "23/07/2026;Pagamento;;ARDIAN BREGU;100,00",
      "23/07/2026;Altro pagamento;;Un Cliente Inesistente;50,00",
    ].join("\r\n");

    const result = parseImportCsv(csv, [{ id: "c1", name: "Ardian Bregu" }]);

    expect(result.rows[0].contact_id).toBe("c1");
    expect(result.rows[1].contact_id).toBeNull();
    expect(result.unmatchedContacts).toBe(1);
  });

  it("falls back to positional columns when no recognizable header is present", () => {
    const csv = "23/07/2026;Senza intestazione;;;12,50";

    const result = parseImportCsv(csv, noContacts);

    expect(result.imported).toBe(1);
    expect(result.rows[0]).toMatchObject({ description: "Senza intestazione", amount: 12.5 });
  });

  it("auto-detects a comma-delimited file", () => {
    const csv = ["Data,Descrizione,Categoria,Cliente,Importo", "2026-07-23,Spesa,Casa,,-20.5"].join("\n");

    const result = parseImportCsv(csv, noContacts);

    expect(result.imported).toBe(1);
    expect(result.rows[0]).toMatchObject({ description: "Spesa", category: "Casa", date: "2026-07-23", amount: -20.5 });
  });

  it("round-trips its own export without dropping expense rows (regression test)", () => {
    // Bug reale: l'export antepone un apice ai campi che iniziano per =+-@ per
    // bloccare l'injection di formule in Excel/Sheets, quindi un importo negativo
    // esce come "'-30". L'import non lo toglieva, quindi ogni spesa veniva
    // scartata silenziosamente — esportare e reimportare i propri dati cancellava
    // tutto lo storico delle spese. Questo test blocca la regressione.
    const header = ["Data", "Descrizione", "Categoria", "Cliente", "Importo"].map(csvField).join(";");
    const expenseRow = ["2026-07-23", "Enel", "Benzina", "", "-30"].map(csvField).join(";");
    const incomeRow = ["2026-07-23", "Stipendio", "Entrata", "Ardian Bregu", "1000"].map(csvField).join(";");
    const csv = "﻿" + [header, expenseRow, incomeRow].join("\r\n");

    const result = parseImportCsv(csv, [{ id: "c1", name: "Ardian Bregu" }]);

    expect(result.skipped).toBe(0);
    expect(result.imported).toBe(2);
    expect(result.rows.find((r) => r.description === "Enel")?.amount).toBe(-30);
  });
});

describe("parseContactsCsv", () => {
  it("parses a standard semicolon file with a header", () => {
    const csv = [
      "Nome;Email;Telefono;Note",
      "Ardian Bregu;ardian@example.com;333123456;Cliente storico",
      "Maria Rossi;;;",
    ].join("\r\n");

    const result = parseContactsCsv(csv, []);

    expect(result.imported).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.duplicates).toBe(0);
    expect(result.rows[0]).toEqual({
      name: "Ardian Bregu",
      email: "ardian@example.com",
      phone: "333123456",
      notes: "Cliente storico",
    });
    expect(result.rows[1]).toEqual({ name: "Maria Rossi", email: null, phone: null, notes: null });
  });

  it("skips rows without a name and counts them", () => {
    const csv = ["Nome;Email;Telefono;Note", ";senza-nome@example.com;;", "Valido;;;"].join("\r\n");

    const result = parseContactsCsv(csv, []);

    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.rows[0].name).toBe("Valido");
  });

  it("skips contacts that already exist (case-insensitive) instead of duplicating them", () => {
    const csv = ["Nome;Email;Telefono;Note", "ARDIAN BREGU;;;", "Nuovo Cliente;;;"].join("\r\n");

    const result = parseContactsCsv(csv, ["Ardian Bregu"]);

    expect(result.imported).toBe(1);
    expect(result.duplicates).toBe(1);
    expect(result.rows[0].name).toBe("Nuovo Cliente");
  });

  it("skips a name repeated twice within the same file after the first occurrence", () => {
    const csv = ["Nome;Email;Telefono;Note", "Mario Verdi;;;", "Mario Verdi;;;"].join("\r\n");

    const result = parseContactsCsv(csv, []);

    expect(result.imported).toBe(1);
    expect(result.duplicates).toBe(1);
  });

  it("falls back to positional columns when no recognizable header is present", () => {
    const csv = "Senza intestazione;;333999888;";

    const result = parseContactsCsv(csv, []);

    expect(result.imported).toBe(1);
    expect(result.rows[0]).toMatchObject({ name: "Senza intestazione", phone: "333999888" });
  });

  it("auto-detects a comma-delimited file", () => {
    const csv = ["Nome,Email,Telefono,Note", "Giulia Bianchi,giulia@example.com,,"].join("\n");

    const result = parseContactsCsv(csv, []);

    expect(result.imported).toBe(1);
    expect(result.rows[0]).toMatchObject({ name: "Giulia Bianchi", email: "giulia@example.com" });
  });
});

// L'app non è più solo in euro: un estratto conto può arrivare con qualunque
// simbolo davanti all'importo, e prima veniva scartato senza dire niente.
describe("importi con valute diverse dall'euro", () => {
  const conImporto = (testo: string) =>
    parseImportCsv(
      ["Data;Descrizione;Importo", `23/07/2026;Spesa;${testo}`].join("\r\n"),
      noContacts
    ).rows[0]?.amount;

  it("reads amounts with any currency symbol or code in front", () => {
    expect(conImporto("€ 120,50")).toBe(120.5);
    expect(conImporto("CHF 120.50")).toBe(120.5);
    expect(conImporto("£120.50")).toBe(120.5);
    expect(conImporto("$120.50")).toBe(120.5);
    expect(conImporto("120,50 kr")).toBe(120.5);
    expect(conImporto("¥1200")).toBe(1200);
  });

  it("keeps the minus sign and the thousands separator", () => {
    expect(conImporto("CHF -1.234,50")).toBe(-1234.5);
    expect(conImporto("-£1,234.50")).toBe(-1234.5);
  });
});

describe("formato inglese degli importi", () => {
  const conImporto = (testo: string) =>
    parseImportCsv(
      ["Data;Descrizione;Importo", `23/07/2026;Spesa;${testo}`].join("\r\n"),
      noContacts
    ).rows[0]?.amount;

  // Il separatore dei decimali è l'ultimo che compare: in "1.234,50" è la
  // virgola, in "1,234.50" è il punto. Senza questa regola un estratto conto
  // inglese leggeva 1,23450 dove c'era milleduecentotrentaquattro.
  it("tells the Italian and the English thousands separator apart", () => {
    expect(conImporto("1.234,50")).toBe(1234.5);
    expect(conImporto("1,234.50")).toBe(1234.5);
    expect(conImporto("1.234.567,89")).toBe(1234567.89);
    expect(conImporto("1,234,567.89")).toBe(1234567.89);
  });

  it("still handles a single separator on its own", () => {
    expect(conImporto("1234,50")).toBe(1234.5);
    expect(conImporto("1234.50")).toBe(1234.5);
    expect(conImporto("1234")).toBe(1234);
  });
});

// L'export scrive "Importo (EUR)" perché un file di cifre nude non dice in che
// valuta sono. Se l'import non riconoscesse quell'intestazione, la colonna
// degli importi resterebbe non mappata e *ogni riga* verrebbe scartata:
// reimportare il proprio export darebbe zero movimenti, senza un errore.
describe("intestazioni con la valuta fra parentesi", () => {
  const riga = "2026-09-15;Spesa;Casa;;-30,50";

  it("riconosce la colonna importo scritta con la valuta", () => {
    const esito = parseImportCsv(`Data;Descrizione;Categoria;Cliente;Importo (EUR)\n${riga}`, []);
    expect(esito.skipped).toBe(0);
    expect(esito.rows[0].amount).toBe(-30.5);
  });

  it("continua ad accettare i file esportati prima di questo cambiamento", () => {
    // Chi ha un CSV scaricato la settimana scorsa non deve trovarselo rifiutato.
    const esito = parseImportCsv(`Data;Descrizione;Categoria;Cliente;Importo\n${riga}`, []);
    expect(esito.skipped).toBe(0);
    expect(esito.rows[0].amount).toBe(-30.5);
  });

  it("vale anche per le altre colonne e per l'inglese", () => {
    const esito = parseImportCsv(
      `Date;Description;Category;Client;Amount (GBP)\n2026-09-15;Shopping;Home;;-30.50`,
      []
    );
    expect(esito.skipped).toBe(0);
    expect(esito.rows[0].amount).toBe(-30.5);
  });

  it("non si confonde con una parentesi che sta in mezzo", () => {
    // "Importo (netto) finale" non è un'intestazione che conosciamo, e deve
    // restare sconosciuta: la normalizzazione toglie solo una parentesi finale.
    const esito = parseImportCsv(`Data;Descrizione;Categoria;Cliente;Importo (netto) finale\n${riga}`, []);
    expect(esito.skipped).toBeGreaterThan(0);
  });
});
