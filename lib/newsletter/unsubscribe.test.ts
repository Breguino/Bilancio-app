import { describe, it, expect } from "vitest";
import { buildUnsubscribeUrl, unsubscribeHeaders } from "@/lib/newsletter/unsubscribe";

describe("buildUnsubscribeUrl", () => {
  it("costruisce l'indirizzo che la route si aspetta", () => {
    expect(buildUnsubscribeUrl("https://bilancino.it.com", "abc-123")).toBe(
      "https://bilancino.it.com/api/newsletter/unsubscribe?token=abc-123"
    );
  });

  it("non raddoppia la barra se l'indirizzo del sito finisce con una", () => {
    expect(buildUnsubscribeUrl("https://bilancino.it.com/", "abc")).toBe(
      "https://bilancino.it.com/api/newsletter/unsubscribe?token=abc"
    );
  });

  it("codifica il token invece di infilarlo grezzo nell'indirizzo", () => {
    // I token oggi sono UUID e non contengono niente di speciale. Vale lo
    // stesso: un token con "&" dentro spezzerebbe la query e la disiscrizione
    // fallirebbe in silenzio, cioè nel modo peggiore.
    expect(buildUnsubscribeUrl("https://x.it", "a&b=c")).toContain("token=a%26b%3Dc");
  });
});

describe("unsubscribeHeaders", () => {
  const h = unsubscribeHeaders("https://bilancino.it.com/api/newsletter/unsubscribe?token=abc");

  it("mette l'indirizzo fra parentesi angolari, come vuole RFC 2369", () => {
    // Senza le parentesi l'intestazione è malformata e i programmi di posta
    // la ignorano: il pulsante "Annulla iscrizione" non compare, e nessuno
    // avvisa che è successo.
    expect(h["List-Unsubscribe"]).toBe(
      "<https://bilancino.it.com/api/newsletter/unsubscribe?token=abc>"
    );
  });

  it("dichiara la disiscrizione con un colpo solo con il valore esatto", () => {
    // RFC 8058: questa stringa è una costante. Scritta diversamente — anche
    // solo con una maiuscola fuori posto — la riga viene scartata.
    expect(h["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });

  it("non aggiunge altro: sono due intestazioni, non un elenco aperto", () => {
    expect(Object.keys(h).sort()).toEqual(["List-Unsubscribe", "List-Unsubscribe-Post"]);
  });
});
