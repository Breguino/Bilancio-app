import { createHash, timingSafeEqual } from "crypto";

// Il controllo delle rotte cron era scritto per esteso in entrambe le route:
//
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return 401
//
// Con la variabile impostata funziona. Senza, l'interpolazione di `undefined`
// produce la stringa "Bearer undefined", e chiunque mandi esattamente quella
// passa il controllo — cioè un cron che manda newsletter a tutti gli iscritti
// si apre al mondo per una variabile dimenticata in un ambiente nuovo.
// Un controllo di sicurezza deve chiudersi quando gli manca qualcosa, non
// aprirsi: senza chiave, qui non entra nessuno.
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  return equalsInConstantTime(request.headers.get("authorization") ?? "", `Bearer ${secret}`);
}

// Confronto a tempo costante. Il rischio pratico su una chiamata HTTP è
// remoto, ma costa tre righe. Si confrontano gli hash e non le stringhe
// perché timingSafeEqual pretende due buffer della stessa lunghezza — e
// passargli direttamente le stringhe rivelerebbe comunque quanto è lunga la
// chiave.
function equalsInConstantTime(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
