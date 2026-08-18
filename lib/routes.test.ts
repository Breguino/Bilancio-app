import { describe, it, expect } from "vitest";
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
