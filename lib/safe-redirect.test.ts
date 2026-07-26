import { describe, it, expect } from "vitest";
import { safeNext } from "@/lib/safe-redirect";

describe("safeNext", () => {
  it("allows a plain in-app path", () => {
    expect(safeNext("/imposta-password")).toBe("/imposta-password");
    expect(safeNext("/dashboard")).toBe("/dashboard");
  });

  it("falls back to /dashboard for an absolute external URL", () => {
    // Senza questo controllo, un link creato ad arte
    // (?code=...&next=https://evil.com) rimanderebbe fuori dall'app subito
    // dopo uno scambio di codice legittimo.
    expect(safeNext("https://evil.com")).toBe("/dashboard");
    expect(safeNext("http://evil.com")).toBe("/dashboard");
  });

  it("falls back to /dashboard for a protocol-relative URL", () => {
    // "//evil.com" non inizia per "http", ma il browser lo risolve comunque
    // come un dominio esterno usando lo schema della pagina corrente.
    expect(safeNext("//evil.com")).toBe("/dashboard");
  });

  it("falls back to /dashboard for a path with no leading slash", () => {
    expect(safeNext("evil.com")).toBe("/dashboard");
  });
});
