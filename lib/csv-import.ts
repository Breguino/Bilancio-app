export type ImportedTransaction = {
  description: string;
  category: string | null;
  date: string;
  amount: number;
  contact_id: string | null;
};

export type ImportResult = {
  rows: ImportedTransaction[];
  imported: number;
  skipped: number;
  unmatchedContacts: number;
};

function parseCsvLines(text: string): string[][] {
  const clean = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const delimiter = (clean.split("\n")[0] || "").split(";").length >= (clean.split("\n")[0] || "").split(",").length
    ? ";"
    : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

// Il nostro stesso export (app/api/export/route.ts) antepone un apice ai campi
// che iniziano per =, +, - o @ per evitare che Excel/Google Sheets li legga
// come formule. Un valore negativo diventa quindi "'-30": va tolto qui, altrimenti
// reimportare il proprio export scarta ogni riga di spesa.
function unescapeCsvField(raw: string): string {
  return /^'[=+\-@]/.test(raw) ? raw.slice(1) : raw;
}

function parseDate(raw: string): string | null {
  const s = unescapeCsvField(raw).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const day = m[1].padStart(2, "0");
    const month = m[2].padStart(2, "0");
    return `${m[3]}-${month}-${day}`;
  }
  return null;
}

function parseAmount(raw: string): number | null {
  let s = unescapeCsvField(raw).trim().replace(/[€\s]/g, "");
  if (!s) return null;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) && n !== 0 ? n : null;
}

const HEADER_ALIASES: Record<string, string> = {
  data: "date",
  date: "date",
  descrizione: "description",
  description: "description",
  categoria: "category",
  category: "category",
  cliente: "contact",
  client: "contact",
  contatto: "contact",
  contact: "contact",
  importo: "amount",
  amount: "amount",
};

export function parseImportCsv(
  text: string,
  contacts: { id: string; name: string }[],
  maxRows = 2000
): ImportResult {
  const lines = parseCsvLines(text);
  if (lines.length === 0) return { rows: [], imported: 0, skipped: 0, unmatchedContacts: 0 };

  const headerRow = lines[0].map((h) => HEADER_ALIASES[h.trim().toLowerCase()] || "");
  const looksLikeHeader = headerRow.includes("date") && headerRow.includes("amount");
  const dataLines = looksLikeHeader ? lines.slice(1) : lines;
  const columns = looksLikeHeader ? headerRow : ["date", "description", "category", "contact", "amount"];

  const contactByName = new Map(contacts.map((c) => [c.name.trim().toLowerCase(), c.id]));

  const rows: ImportedTransaction[] = [];
  let skipped = 0;
  let unmatchedContacts = 0;

  for (const line of dataLines.slice(0, maxRows)) {
    const record: Record<string, string> = {};
    columns.forEach((col, i) => {
      if (col) record[col] = line[i] ?? "";
    });

    const description = unescapeCsvField((record.description || "").trim()).trim();
    const date = parseDate(record.date || "");
    const amount = parseAmount(record.amount || "");

    if (!description || !date || amount === null) {
      skipped++;
      continue;
    }

    const categoryRaw = unescapeCsvField((record.category || "").trim()).trim();
    const category = !categoryRaw || categoryRaw.toLowerCase() === "entrata" ? null : categoryRaw;

    const contactRaw = unescapeCsvField((record.contact || "").trim()).trim();
    let contact_id: string | null = null;
    if (contactRaw) {
      const match = contactByName.get(contactRaw.toLowerCase());
      if (match) contact_id = match;
      else unmatchedContacts++;
    }

    rows.push({ description, category, date, amount, contact_id });
  }

  return { rows, imported: rows.length, skipped, unmatchedContacts };
}
