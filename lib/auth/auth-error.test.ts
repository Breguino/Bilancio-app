import { describe, expect, it } from "vitest";
import { AUTH_ERROR_CODES, authErrorCode, authErrorText, type AuthErrorMessages } from "./auth-error";

const messages = Object.fromEntries(
  AUTH_ERROR_CODES.map((c) => [c, `testo:${c}`])
) as AuthErrorMessages;

describe("authErrorCode", () => {
  it("riconosce il codice restituito da Supabase", () => {
    expect(authErrorCode({ code: "invalid_credentials" })).toBe("invalid_credentials");
    expect(authErrorCode({ code: "user_already_exists" })).toBe("email_exists");
    expect(authErrorCode({ code: "over_email_send_rate_limit" })).toBe("rate_limited");
  });

  it("ripiega sul testo del messaggio quando il codice manca", () => {
    expect(authErrorCode({ message: "Invalid login credentials" })).toBe("invalid_credentials");
    expect(authErrorCode({ message: "Email not confirmed" })).toBe("email_not_confirmed");
    expect(authErrorCode({ message: "User already registered" })).toBe("email_exists");
  });

  // Il caso che ha fatto nascere questo file: la libreria non riesce a leggere
  // il corpo della risposta e il messaggio diventa la stringa "{}".
  it("non lascia passare un messaggio vuoto o serializzato", () => {
    expect(authErrorCode({ message: "{}", status: 500, name: "AuthRetryableFetchError" })).toBe("generic");
    expect(authErrorCode({ message: '{"foo":1}' })).toBe("generic");
    expect(authErrorCode({ message: "   " })).toBe("generic");
    expect(authErrorCode({})).toBe("generic");
    expect(authErrorCode(null)).toBe("generic");
  });

  it("usa lo stato HTTP quando è l'unico indizio", () => {
    expect(authErrorCode({ message: "boom", status: 429 })).toBe("rate_limited");
  });

  it("non inventa un codice per un messaggio che non riconosce", () => {
    expect(authErrorCode({ message: "qualcosa di mai visto" })).toBe("generic");
  });
});

describe("authErrorText", () => {
  it("traduce i codici noti", () => {
    expect(authErrorText("invalid_credentials", messages)).toBe("testo:invalid_credentials");
  });

  it("non mostra niente se non c'è errore", () => {
    expect(authErrorText(undefined, messages)).toBeUndefined();
    expect(authErrorText("", messages)).toBeUndefined();
  });

  // Il secondo motivo del cambio: il testo arrivava dall'URL e finiva a video
  // così com'era, quindi un link costruito ad arte poteva far comparire un
  // messaggio che sembrava nostro.
  it("riduce al messaggio generico qualunque valore estraneo", () => {
    expect(authErrorText("La tua sessione è scaduta, scrivi a assistenza@esempio.it", messages)).toBe(
      "testo:generic"
    );
    expect(authErrorText("{}", messages)).toBe("testo:generic");
    expect(authErrorText("<script>", messages)).toBe("testo:generic");
  });
});
