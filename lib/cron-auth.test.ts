import { describe, it, expect, afterEach } from "vitest";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

const originale = process.env.CRON_SECRET;

afterEach(() => {
  if (originale === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = originale;
});

function richiesta(authorization?: string) {
  return new Request("https://esempio.test/api/cron/send-newsletter", {
    headers: authorization === undefined ? {} : { authorization },
  });
}

describe("isAuthorizedCronRequest", () => {
  it("accepts the exact bearer token", () => {
    process.env.CRON_SECRET = "chiave-lunga-e-casuale";
    expect(isAuthorizedCronRequest(richiesta("Bearer chiave-lunga-e-casuale"))).toBe(true);
  });

  it("rejects a wrong token, a missing header and a token without the Bearer prefix", () => {
    process.env.CRON_SECRET = "chiave-lunga-e-casuale";
    expect(isAuthorizedCronRequest(richiesta("Bearer sbagliata"))).toBe(false);
    expect(isAuthorizedCronRequest(richiesta())).toBe(false);
    expect(isAuthorizedCronRequest(richiesta("chiave-lunga-e-casuale"))).toBe(false);
  });

  // Il motivo per cui questo file esiste: senza la variabile, il vecchio
  // confronto costruiva la stringa "Bearer undefined" e la accettava.
  it("refuses everything when CRON_SECRET is not set, including the literal 'Bearer undefined'", () => {
    delete process.env.CRON_SECRET;
    expect(isAuthorizedCronRequest(richiesta("Bearer undefined"))).toBe(false);
    expect(isAuthorizedCronRequest(richiesta("Bearer "))).toBe(false);
    expect(isAuthorizedCronRequest(richiesta())).toBe(false);
  });

  it("refuses everything when CRON_SECRET is set but empty", () => {
    process.env.CRON_SECRET = "";
    expect(isAuthorizedCronRequest(richiesta("Bearer "))).toBe(false);
    expect(isAuthorizedCronRequest(richiesta(""))).toBe(false);
  });
});
