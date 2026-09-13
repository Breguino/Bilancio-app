import { describe, it, expect } from "vitest";
import { csvField } from "@/lib/csv-export";
import { parseImportCsv } from "@/lib/csv-import";

// `csvField` è dieci righe e fino a oggi non aveva un test. Non è una
// formattazione: è la difesa contro la CSV injection. Un campo che comincia
// per "=", "+", "-" o "@" viene letto da Excel e da Google Sheets come una
// formula, non come testo — e una descrizione scritta da chi importa un file
// può diventare qualcosa che si esegue sul computer di chi lo apre.
//
// Un controllo di sicurezza che nessun test sorveglia è un controllo che si
// può rompere senza che nessuno se ne accorga.
describe("csvField: protezione dalle formule", () => {
  it("neutralizza i quattro caratteri che aprono una formula", () => {
    expect(csvField("=1+1")).toBe("'=1+1");
    expect(csvField("+1")).toBe("'+1");
    expect(csvField("-30")).toBe("'-30");
    expect(csvField("@SUM(A1)")).toBe("'@SUM(A1)");
  });

  it("neutralizza l'attacco vero, non solo il caso di scuola", () => {
    // La forma classica: una formula che apre un programma esterno passandogli
    // il contenuto del foglio. Dopo l'apice è testo e basta.
    const attacco = '=cmd|\' /C calc\'!A0';
    expect(csvField(attacco).startsWith("'=")).toBe(true);
  });

  it("non tocca il testo normale", () => {
    expect(csvField("Spesa al supermercato")).toBe("Spesa al supermercato");
    expect(csvField("2026-09-13")).toBe("2026-09-13");
    expect(csvField("120.50")).toBe("120.50");
    // Un meno che non sta all'inizio non apre niente.
    expect(csvField("Conto 1-2")).toBe("Conto 1-2");
  });

  it("tratta i valori mancanti come stringa vuota, non come \"null\"", () => {
    expect(csvField(null)).toBe("");
    expect(csvField(undefined)).toBe("");
    expect(csvField(0)).toBe("0");
  });
});

describe("csvField: caratteri che spezzerebbero il file", () => {
  it("mette fra virgolette i campi che contengono un separatore", () => {
    // Il nostro export usa il punto e virgola, ma la virgola va comunque
    // protetta: il file può essere riaperto da un programma che usa quella.
    expect(csvField("Rossi; Verdi")).toBe('"Rossi; Verdi"');
    expect(csvField("Rossi, Verdi")).toBe('"Rossi, Verdi"');
  });

  it("mette fra virgolette i campi che vanno a capo", () => {
    expect(csvField("prima riga\nseconda")).toBe('"prima riga\nseconda"');
  });

  it("raddoppia le virgolette interne, come vuole il formato", () => {
    expect(csvField('Fattura "urgente"')).toBe('"Fattura ""urgente"""');
  });

  it("applica tutte e due le protezioni quando servono entrambe", () => {
    // Comincia per "-" e contiene un punto e virgola: apice *dentro* le
    // virgolette, altrimenti una delle due difese salta.
    expect(csvField("-30; anticipo")).toBe('"\'-30; anticipo"');
  });
});

// Il test che conta più di tutti gli altri messi insieme: un file esportato
// da Bilancino deve poter rientrare in Bilancino. È già successo una volta
// che non fosse vero — l'apice davanti agli importi negativi faceva scartare
// ogni riga di spesa — ed è il motivo per cui `unescapeCsvField` esiste.
describe("un export rientra dalla porta dell'import", () => {
  // Ricostruito come lo scrive app/api/export/route.ts: intestazioni dal
  // dizionario, campi uniti da ";", righe da CRLF, BOM davanti.
  function esporta(righe: string[][]): string {
    return "﻿" + righe.map((r) => r.map(csvField).join(";")).join("\r\n");
  }

  const intestazioni = ["Data", "Descrizione", "Categoria", "Cliente", "Importo"];

  it("riporta indietro spese, entrate e contatti senza perdere una riga", () => {
    const csv = esporta([
      intestazioni,
      ["2026-09-13", "Spesa al supermercato", "Casa", "", "-30,50"],
      ["2026-09-12", "Fattura Verdi", "Entrata", "Verdi", "1200,00"],
      ["2026-09-11", "Rossi; Verdi", "Ufficio", "", "-15,00"],
    ]);

    const esito = parseImportCsv(csv, [{ id: "id-verdi", name: "Verdi" }]);

    expect(esito.skipped).toBe(0);
    expect(esito.imported).toBe(3);

    // L'apice davanti a "-30,50" è stato tolto: l'importo è di nuovo negativo.
    expect(esito.rows[0]).toEqual({
      description: "Spesa al supermercato",
      category: "Casa",
      date: "2026-09-13",
      amount: -30.5,
      contact_id: null,
    });

    // "Entrata" è un'etichetta, non una categoria vera: torna a null.
    expect(esito.rows[1].amount).toBe(1200);
    expect(esito.rows[1].category).toBe(null);
    expect(esito.rows[1].contact_id).toBe("id-verdi");

    // Il punto e virgola dentro la descrizione non ha spezzato la riga.
    expect(esito.rows[2].description).toBe("Rossi; Verdi");
    expect(esito.rows[2].amount).toBe(-15);
  });

  it("non riporta dentro una formula sotto forma di formula", () => {
    const csv = esporta([intestazioni, ["2026-09-13", "=1+1", "Casa", "", "-10,00"]]);
    const esito = parseImportCsv(csv, []);

    // Rientra come testo — l'apice viene tolto perché era nostro — ma nel
    // file che sta sul disco l'apice c'era.
    expect(esito.rows[0].description).toBe("=1+1");
    expect(csv).toContain("'=1+1");
  });
});
