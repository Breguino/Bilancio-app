import { describe, it as test, expect } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";

// Il diario di /novita è scritto due volte, una per lingua, e le due copie
// devono raccontare gli stessi rilasci. È già andata storta una volta in modo
// diverso — la data di "ultimo aggiornamento" era rimasta indietro rispetto
// alle voci — e la lezione è che due copie della stessa cosa divergono se
// nessuno le confronta. Questi test le confrontano.

const voci = {
  it: dictionaries.it.novita.entries,
  en: dictionaries.en.novita.entries,
};

describe("diario delle novità", () => {
  test("lists the same dates in both languages", () => {
    expect(voci.en.map((v) => v.date)).toEqual(voci.it.map((v) => v.date));
  });

  test("has the same number of bullet points per entry in both languages", () => {
    // Aggiungere una riga in italiano e scordarsi l'inglese è l'errore facile:
    // la pagina continua a funzionare e nessuno se ne accorge finché non la
    // legge qualcuno in inglese.
    const perData = voci.it.map((v, i) => [v.date, v.items.length, voci.en[i].items.length]);
    for (const [data, quanteIt, quanteEn] of perData) {
      expect(`${data}: ${quanteEn}`).toBe(`${data}: ${quanteIt}`);
    }
  });

  test("uses real ISO dates, not hand-written ones", () => {
    for (const lingua of ["it", "en"] as const) {
      for (const v of voci[lingua]) {
        expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // Una data come 2026-02-31 passa la regex ma non esiste: Date la
        // farebbe scivolare al 3 marzo. Il confronto lo intercetta.
        expect(new Date(`${v.date}T12:00:00Z`).toISOString().slice(0, 10)).toBe(v.date);
      }
    }
  });

  test("keeps the newest entry first, because the page shows it as the last update", () => {
    const date = voci.it.map((v) => v.date);
    expect(date).toEqual([...date].sort().reverse());
  });

  // La lista "A cosa sto pensando" è scritta due volte come il diario, e corre
  // lo stesso rischio: un'idea aggiunta in italiano e dimenticata in inglese.
  test("lists the same number of ideas in both languages", () => {
    expect(dictionaries.en.novita.ideas.length).toBe(dictionaries.it.novita.ideas.length);
  });

  test("has no empty entry", () => {
    for (const lingua of ["it", "en"] as const) {
      for (const v of voci[lingua]) {
        expect(v.items.length).toBeGreaterThan(0);
      }
    }
  });
});
