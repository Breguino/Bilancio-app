import { describe, it, expect } from "vitest";
import { hasSessionCookie } from "@/lib/auth/session-cookie";

const c = (name: string, value = "token") => ({ name, value });

describe("hasSessionCookie", () => {
  it("riconosce il cookie di sessione di Supabase", () => {
    expect(hasSessionCookie([c("sb-abcdefgh-auth-token")])).toBe(true);
  });

  it("riconosce il token spezzato in più cookie", () => {
    expect(
      hasSessionCookie([c("sb-abcdefgh-auth-token.0"), c("sb-abcdefgh-auth-token.1")])
    ).toBe(true);
  });

  it("ignora gli altri cookie", () => {
    expect(hasSessionCookie([c("locale", "it"), c("analytics-consent", "yes")])).toBe(false);
  });

  it("non scambia il code verifier di Google per una sessione", () => {
    // Esiste durante il login OAuth, prima che l'utente sia autenticato:
    // contarlo mostrerebbe la CTA "Dashboard" a chi non è ancora entrato.
    expect(hasSessionCookie([c("sb-abcdefgh-auth-token-code-verifier")])).toBe(false);
  });

  it("considera sloggato chi ha il cookie svuotato dal logout", () => {
    expect(hasSessionCookie([c("sb-abcdefgh-auth-token", "")])).toBe(false);
  });

  it("regge un elenco di cookie vuoto", () => {
    expect(hasSessionCookie([])).toBe(false);
  });
});
