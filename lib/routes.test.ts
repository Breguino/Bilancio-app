import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  PROTECTED_EXACT,
  PROTECTED_PREFIXES,
  isProtectedPath,
  crawlerDisallowList,
} from "@/lib/routes";

describe("isProtectedPath", () => {
  it("riconosce le pagine riservate", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/completa-profilo")).toBe(true);
    expect(isProtectedPath("/contacts/abc-123")).toBe(true);
    expect(isProtectedPath("/receipt/abc-123")).toBe(true);
  });

  it("lascia passare le pagine pubbliche e gli indirizzi inesistenti", () => {
    // Il caso che aveva causato il bug del redirect: un indirizzo che non
    // esiste non è "riservato", deve poter arrivare al 404 vero.
    expect(isProtectedPath("/pagina-inesistente")).toBe(false);
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/privacy")).toBe(false);
    expect(isProtectedPath("/guide/qualcosa")).toBe(false);
  });

  it("non confonde un indirizzo che inizia come uno riservato", () => {
    // "/contacts" è riservata, ma "/contactsomething" è un'altra cosa.
    expect(isProtectedPath("/contactsomething")).toBe(false);
    expect(isProtectedPath("/dashboard-pubblica")).toBe(false);
  });
});

describe("crawlerDisallowList", () => {
  const disallow = crawlerDisallowList();

  // L'invariante che tiene allineati middleware e robots.txt: se qualcuno
  // aggiunge una rotta riservata, deve risultare esclusa dai motori di ricerca
  // senza dover aggiornare una seconda lista a mano.
  it("copre ogni rotta riservata, direttamente o tramite un prefisso", () => {
    const covered = (path: string) =>
      disallow.some((rule) => path === rule || path.startsWith(`${rule}/`));

    for (const path of PROTECTED_EXACT) {
      expect(covered(path), `${path} non è coperta da robots.txt`).toBe(true);
    }
    for (const prefix of PROTECTED_PREFIXES) {
      expect(covered(prefix.replace(/\/$/, "")), `${prefix} non è coperta`).toBe(true);
    }
  });

  it("esclude anche le rotte tecniche non indicizzabili", () => {
    expect(disallow).toContain("/api");
    expect(disallow).toContain("/auth");
  });

  it("non ripete una regola già coperta da un prefisso più ampio", () => {
    // "/api/export" è riservata, ma "/api" la copre già.
    expect(disallow).not.toContain("/api/export");
  });

  it("non contiene duplicati", () => {
    expect(disallow.length).toBe(new Set(disallow).size);
  });
});

// Il controllo che mancava, e che è il motivo per cui questo file esiste.
//
// `PROTECTED_EXACT` è un elenco scritto a mano, e il commento in cima a
// lib/routes.ts lo dice: chi aggiunge una pagina sotto app/(app) deve
// ricordarsi di aggiungerla anche lì. Se se ne dimentica, quella pagina non
// dà errore da nessuna parte — né in build, né nel lint, né nei tipi:
// diventa semplicemente **pubblica**, con i movimenti di qualcuno dentro.
//
// Questi due test leggono le cartelle vere e tolgono il "ricordarsi" dal
// percorso: la dimenticanza diventa una corsa rossa in CI.
describe("l'elenco delle pagine riservate resta allineato alle cartelle", () => {
  const radice = process.cwd();

  // "app/(app)/contacts/[id]/page.tsx" -> "/contacts/[id]"
  // I segmenti fra parentesi tonde sono gruppi di layout e non compaiono
  // nell'indirizzo, quindi vanno tolti.
  function rottaDa(file: string): string {
    const segmenti = path
      .dirname(path.relative(path.join(radice, "app"), file))
      .split(path.sep)
      .filter((s) => s && s !== "." && !/^\(.*\)$/.test(s));
    return "/" + segmenti.join("/");
  }

  function paginePrivate(): string[] {
    const base = path.join(radice, "app", "(app)");
    const trovate: string[] = [];
    const scendi = (dir: string) => {
      for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
        const completo = path.join(dir, voce.name);
        if (voce.isDirectory()) scendi(completo);
        else if (voce.name === "page.tsx") trovate.push(completo);
      }
    };
    scendi(base);
    return trovate.map(rottaDa).sort();
  }

  it("ogni pagina sotto app/(app) è dichiarata riservata", () => {
    const pagine = paginePrivate();

    // Se questo scatta, la cartella app/(app) è stata svuotata o rinominata e
    // il test non sta più guardando niente: sarebbe passato per finta.
    expect(pagine.length).toBeGreaterThan(5);

    for (const rotta of pagine) {
      const dinamica = rotta.includes("[");
      // Per una rotta dinamica conta il tratto fisso davanti: "/contacts/[id]"
      // è coperta dal prefisso "/contacts/".
      const coperta = dinamica
        ? PROTECTED_PREFIXES.some((p) => `${rotta}/`.startsWith(p))
        : PROTECTED_EXACT.includes(rotta);

      expect(
        coperta,
        `${rotta} esiste sotto app/(app) ma non è in lib/routes.ts: è raggiungibile senza accesso`
      ).toBe(true);
    }
  });

  it("non resta in elenco una pagina che non esiste più", () => {
    // Il difetto opposto: una voce rimasta lì dopo che la pagina è stata
    // tolta o rinominata. Non è pericolosa, ma sporca anche robots.txt.
    for (const rotta of PROTECTED_EXACT) {
      const candidati = [
        path.join(radice, "app", "(app)", rotta, "page.tsx"),
        path.join(radice, "app", rotta, "page.tsx"),
        path.join(radice, "app", rotta, "route.ts"),
      ];
      expect(
        candidati.some((f) => fs.existsSync(f)),
        `${rotta} è in PROTECTED_EXACT ma non ha né una pagina né una route`
      ).toBe(true);
    }
  });
});
