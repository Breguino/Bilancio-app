const HTML_TAG_RE = /<\/?[a-z][\s\S]*?>/i;
const LIST_ITEM_RE = /^[-*]\s+(.*)/;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyInline(s: string) {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

// Il campo del testo della newsletter accetta HTML vero (per chi lo scrive)
// ma la maggior parte delle bozze è testo semplice — senza tag, restava
// piatto: niente paragrafi, niente grassetto, niente elenchi puntati. Se il
// testo contiene già almeno un tag HTML lo rispettiamo com'è (l'admin sa
// cosa sta facendo); altrimenti converte una sintassi minima in stile
// markdown (**grassetto**, righe che iniziano con "-" per gli elenchi —
// anche senza una riga vuota prima, il caso più comune quando si scrive
// "cose:" seguito subito dall'elenco — righe vuote per separare i paragrafi).
export function formatNewsletterBody(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (HTML_TAG_RE.test(trimmed)) return trimmed;

  const parts: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      parts.push(`<p>${paragraphLines.map(applyInline).join("<br>")}</p>`);
      paragraphLines = [];
    }
  };
  const flushList = () => {
    if (listItems.length) {
      parts.push(`<ul>${listItems.map((item) => `<li>${applyInline(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
  };

  for (const rawLine of trimmed.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    const listMatch = line.match(LIST_ITEM_RE);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
    } else {
      flushList();
      paragraphLines.push(line);
    }
  }
  flushParagraph();
  flushList();

  return parts.join("\n");
}
