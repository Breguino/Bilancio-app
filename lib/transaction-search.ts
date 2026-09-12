// Il filtro che cerca una parola fra i movimenti.
//
// PostgREST vuole le condizioni in "or" come una stringa sola, separate da
// virgole: `description.ilike.%caffè%,category.ilike.%caffè%`. Il testo lo
// scrive l'utente, e una virgola o una parentesi dentro la sua ricerca
// spezzerebbe quella sintassi: cercare "bar, ristorante" diventerebbe due
// condizioni invece di una, e il filtro cambierebbe significato senza che
// nessuno se ne accorga. I valori vanno quindi racchiusi fra virgolette
// doppie, sfuggendo le virgolette e le barre rovesce che contengono.
function fraVirgolette(valore: string): string {
  return `"${valore.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// Gli identificativi dei contatti arrivano dal database e sono uuid: non
// serve trattarli come testo dell'utente.
export function transactionSearchFilter(query: string, contactIds: string[] = []): string {
  const pattern = fraVirgolette(`%${query}%`);
  const condizioni = [`description.ilike.${pattern}`, `category.ilike.${pattern}`];
  if (contactIds.length > 0) {
    condizioni.push(`contact_id.in.(${contactIds.join(",")})`);
  }
  return condizioni.join(",");
}
