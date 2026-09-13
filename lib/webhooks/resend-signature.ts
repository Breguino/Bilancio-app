import { createHmac, timingSafeEqual } from "crypto";

// Resend firma ogni webhook con lo schema Svix. Senza questo controllo
// l'indirizzo sarebbe una porta aperta: chiunque potrebbe mandarci righe
// inventate — rimbalzi che non sono mai successi, o indirizzi email di altri
// — e le troveremmo scritte nel database come se fossero vere.
//
// Lo schema in tre righe:
//   testo firmato = "<id>.<timestamp>.<corpo grezzo>"
//   chiave        = la parte dopo "whsec_", decodificata da base64
//   firma         = HMAC-SHA256 di quel testo, in base64
//
// L'intestazione può contenere più firme separate da spazi ("v1,aaa v1,bbb"):
// durante una rotazione della chiave ne arrivano due, e ne basta una valida.
//
// Il timestamp non è decorativo: senza il controllo di freschezza, chi
// intercettasse una consegna valida potrebbe rimandarla identica all'infinito.

const TOLLERANZA_SECONDI = 5 * 60;

export type EsitoFirma =
  | { valido: true }
  | { valido: false; motivo: "chiave-mancante" | "intestazioni-mancanti" | "timestamp-non-valido" | "troppo-vecchio" | "firma-non-valida" };

export function verifyResendSignature(
  corpoGrezzo: string,
  intestazioni: {
    id: string | null;
    timestamp: string | null;
    signature: string | null;
  },
  secret: string | undefined,
  adesso: number = Date.now()
): EsitoFirma {
  // Come per le rotte cron: senza chiave si chiude, non si apre.
  if (!secret) return { valido: false, motivo: "chiave-mancante" };

  const { id, timestamp, signature } = intestazioni;
  if (!id || !timestamp || !signature) return { valido: false, motivo: "intestazioni-mancanti" };

  const inviatoA = Number(timestamp);
  if (!Number.isFinite(inviatoA)) return { valido: false, motivo: "timestamp-non-valido" };

  const scarto = Math.abs(adesso / 1000 - inviatoA);
  if (scarto > TOLLERANZA_SECONDI) return { valido: false, motivo: "troppo-vecchio" };

  const chiave = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const attesa = createHmac("sha256", chiave)
    .update(`${id}.${timestamp}.${corpoGrezzo}`)
    .digest("base64");

  const arrivate = signature
    .split(" ")
    .map((p) => p.split(",", 2))
    .filter(([versione]) => versione === "v1")
    .map(([, firma]) => firma ?? "");

  const combacia = arrivate.some((firma) => uguagliATempoCostante(firma, attesa));
  return combacia ? { valido: true } : { valido: false, motivo: "firma-non-valida" };
}

// Stesso motivo di lib/cron-auth.ts: timingSafeEqual pretende due buffer
// della stessa lunghezza, quindi si confrontano lunghezze uguali.
function uguagliATempoCostante(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
