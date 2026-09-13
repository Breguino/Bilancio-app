import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { verifyResendSignature } from "@/lib/webhooks/resend-signature";

const SEGRETO = "whsec_" + Buffer.from("una-chiave-di-prova-lunga-abbastanza").toString("base64");
const ID = "msg_2abc";
const CORPO = '{"type":"email.bounced","data":{"email_id":"x"}}';
const ADESSO = 1_770_000_000_000; // millisecondi
const TS = String(Math.floor(ADESSO / 1000));

function firma(corpo = CORPO, id = ID, ts = TS, segreto = SEGRETO): string {
  const chiave = Buffer.from(segreto.replace(/^whsec_/, ""), "base64");
  return "v1," + createHmac("sha256", chiave).update(`${id}.${ts}.${corpo}`).digest("base64");
}

const intestazioni = (over: Partial<{ id: string | null; timestamp: string | null; signature: string | null }> = {}) => ({
  id: ID,
  timestamp: TS,
  signature: firma(),
  ...over,
});

describe("verifyResendSignature: accetta quello che arriva davvero da Resend", () => {
  it("accetta una consegna firmata correttamente", () => {
    expect(verifyResendSignature(CORPO, intestazioni(), SEGRETO, ADESSO)).toEqual({ valido: true });
  });

  it("accetta se una sola delle firme presenti è valida", () => {
    // Durante una rotazione della chiave Resend ne manda due.
    const doppia = `v1,firmaVecchiaNonValida ${firma()}`;
    expect(verifyResendSignature(CORPO, intestazioni({ signature: doppia }), SEGRETO, ADESSO).valido).toBe(true);
  });

  it("accetta entro la finestra di tolleranza", () => {
    const quattroMinutiDopo = ADESSO + 4 * 60 * 1000;
    expect(verifyResendSignature(CORPO, intestazioni(), SEGRETO, quattroMinutiDopo).valido).toBe(true);
  });
});

describe("verifyResendSignature: rifiuta tutto il resto", () => {
  it("rifiuta un corpo cambiato dopo la firma", () => {
    // Il caso che conta: qualcuno intercetta una consegna vera e ne altera il
    // contenuto. La firma non torna più.
    const alterato = CORPO.replace("email.bounced", "email.delivered");
    expect(verifyResendSignature(alterato, intestazioni(), SEGRETO, ADESSO)).toEqual({
      valido: false,
      motivo: "firma-non-valida",
    });
  });

  it("rifiuta una firma prodotta con un'altra chiave", () => {
    const altraChiave = "whsec_" + Buffer.from("chiave-di-qualcun-altro-abbastanza").toString("base64");
    const intrusa = intestazioni({ signature: firma(CORPO, ID, TS, altraChiave) });
    expect(verifyResendSignature(CORPO, intrusa, SEGRETO, ADESSO).valido).toBe(false);
  });

  it("rifiuta una consegna rigiocata a distanza di tempo", () => {
    // Senza il controllo sul timestamp, una consegna valida intercettata si
    // potrebbe rimandare identica per sempre.
    const unOraDopo = ADESSO + 60 * 60 * 1000;
    expect(verifyResendSignature(CORPO, intestazioni(), SEGRETO, unOraDopo)).toEqual({
      valido: false,
      motivo: "troppo-vecchio",
    });
  });

  it("rifiuta se il timestamp è stato manomesso", () => {
    // Cambiare il timestamp per aggirare il controllo di freschezza invalida
    // la firma, perché il timestamp fa parte del testo firmato.
    const spostato = intestazioni({ timestamp: String(Number(TS) + 10) });
    expect(verifyResendSignature(CORPO, spostato, SEGRETO, ADESSO + 10_000)).toEqual({
      valido: false,
      motivo: "firma-non-valida",
    });
  });

  it("rifiuta un timestamp che non è un numero", () => {
    expect(verifyResendSignature(CORPO, intestazioni({ timestamp: "ieri" }), SEGRETO, ADESSO)).toEqual({
      valido: false,
      motivo: "timestamp-non-valido",
    });
  });

  it("rifiuta se manca una delle intestazioni", () => {
    const mancante = { valido: false, motivo: "intestazioni-mancanti" };
    expect(verifyResendSignature(CORPO, intestazioni({ id: null }), SEGRETO, ADESSO)).toEqual(mancante);
    expect(verifyResendSignature(CORPO, intestazioni({ signature: null }), SEGRETO, ADESSO)).toEqual(mancante);
  });

  it("rifiuta una versione di firma che non conosciamo", () => {
    const futura = intestazioni({ signature: firma().replace("v1,", "v2,") });
    expect(verifyResendSignature(CORPO, futura, SEGRETO, ADESSO)).toEqual({
      valido: false,
      motivo: "firma-non-valida",
    });
  });

  it("si chiude quando la chiave non è configurata, invece di aprirsi", () => {
    // Stessa regola di lib/cron-auth.ts: una variabile dimenticata in un
    // ambiente nuovo non deve trasformare il controllo in un lasciapassare.
    expect(verifyResendSignature(CORPO, intestazioni(), undefined, ADESSO)).toEqual({
      valido: false,
      motivo: "chiave-mancante",
    });
    expect(verifyResendSignature(CORPO, intestazioni(), "", ADESSO)).toEqual({
      valido: false,
      motivo: "chiave-mancante",
    });
  });
});
