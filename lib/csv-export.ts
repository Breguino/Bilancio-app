// Antepone un apice ai campi che iniziano per =, +, - o @ per evitare che
// Excel/Google Sheets li interpretino come formule (CSV injection). Va
// invertito in fase di import — vedi unescapeCsvField in lib/csv-import.ts.
export function csvField(v: unknown) {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) {
    s = `'${s}`;
  }
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Le intestazioni del file esportato, con il codice della valuta sull'ultima
// colonna — quella degli importi.
//
// Il file usciva con cifre nude: "120,50" e basta. Chi lo riapre sei mesi dopo,
// o lo manda a qualcun altro, non ha modo di sapere se sono euro o franchi — e
// da quando la valuta si sceglie per account non è una domanda retorica.
//
// Perché nell'intestazione e non in ogni riga: la valuta è una proprietà del
// conto, non del singolo movimento. Ma soprattutto la colonna degli importi
// resta numerica — un simbolo dentro le celle la trasformerebbe in testo, e in
// Excel non si sommerebbe più.
//
// Chi rilegge questi file è parseImportCsv, che sa togliere la parentesi:
// senza, la colonna non verrebbe riconosciuta e ogni riga finirebbe scartata.
export function csvHeaders(headers: readonly string[], currency: string): string[] {
  return headers.map((h, i) => (i === headers.length - 1 ? `${h} (${currency})` : h));
}
