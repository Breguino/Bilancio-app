// Il carattere e i colori delle email, negli stessi valori del sito.
//
// Le email non possono leggere `tailwind.config.ts`: quel file diventa CSS al
// momento della build, e quando parte una newsletter non esiste più niente da
// consultare. I valori vanno quindi ricopiati a mano — ed è esattamente così
// che le email erano rimaste indietro: il sito è passato al petrolio, loro
// sono rimaste sull'indaco `#4f46e5`, cioè il colore predefinito di Tailwind
// che avevamo tolto proprio perché non diceva niente di nostro. Chi riceveva
// un promemoria vedeva un marchio diverso da quello che trovava aprendo il
// link.
//
// Adesso stanno in un posto solo: se il petrolio cambia, si cambia qui.
export const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const EMAIL_COLORS = {
  /** Il petrolio del marchio. Bianco sopra dà 5,9:1. */
  accent: "#0e6e80",
  ink: "#14151a",
  inkSecondary: "#55565f",
  /** Il grigio del piè di pagina, su bianco. */
  inkFaint: "#8b8c94",
  page: "#fbfbf8",
  card: "#ffffff",
  border: "rgba(20,21,26,0.10)",
  borderSoft: "rgba(20,21,26,0.08)",
} as const;
