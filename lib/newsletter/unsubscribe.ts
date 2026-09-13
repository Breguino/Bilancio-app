// L'indirizzo di disiscrizione e le intestazioni che lo annunciano ai
// programmi di posta, in un posto solo: prima l'indirizzo si costruiva a
// mano dentro send.ts, e la route che lo riceve stava da un'altra parte. Due
// posti che devono dire la stessa cosa e nessuno che li tenga insieme.
export function buildUnsubscribeUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

// Gmail e Yahoo chiedono a chi manda email a una lista di dichiarare la
// disiscrizione in due modi:
//
// - `List-Unsubscribe` (RFC 2369) è l'indirizzo. È quello che fa comparire
//   "Annulla iscrizione" accanto al mittente, invece di lasciare a chi legge
//   solo il pulsante "Segnala come spam" — che è la cosa che fa davvero male
//   alla consegna di tutte le email successive, comprese quelle di servizio.
// - `List-Unsubscribe-Post` (RFC 8058) dice che la disiscrizione si può fare
//   con un solo colpo, senza far aprire una pagina: il programma di posta
//   manda una POST all'indirizzo qui sopra. Il valore è una costante esatta,
//   non un testo libero.
//
// Perché funzioni, quell'indirizzo deve accettare anche POST senza chiedere
// conferma — vedi app/api/newsletter/unsubscribe/route.ts.
export function unsubscribeHeaders(url: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
