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
