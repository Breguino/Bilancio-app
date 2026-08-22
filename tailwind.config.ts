import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ─── Tema dell'app riservata (invariato) ────────────────────────────
        // Le pagine dentro app/(app) usano ancora questi nomi: cambiarli
        // ridisegnerebbe la dashboard, che qui non è in discussione.
        ink: "#14151a",
        "ink-secondary": "#55565f",
        "ink-muted": "#8b8c94",
        accent: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
          soft: "#ecebfc",
        },
        surface: "#ffffff",
        "surface-alt": "#f2f2ee",
        bg: "#fbfbf8",
        border: "rgba(20,21,26,0.10)",

        // ─── Identità del sito pubblico ─────────────────────────────────────
        // Un bilancino è una bilancia di precisione a due piatti: la tavolozza
        // viene da quell'oggetto e dalla carta su cui si tenevano i registri,
        // non da una palette generica per fintech. I valori veri stanno in
        // globals.css come variabili CSS, così chiaro e scuro cambiano da soli
        // senza dover scrivere `dark:` su ogni singola classe.
        inchiostro: {
          DEFAULT: "rgb(var(--inchiostro) / <alpha-value>)",
          soft: "rgb(var(--inchiostro-soft) / <alpha-value>)",
          muted: "rgb(var(--inchiostro-muted) / <alpha-value>)",
        },
        // Verderame: la patina che prende l'ottone. Azione primaria ed entrate.
        verde: {
          DEFAULT: "rgb(var(--verde) / <alpha-value>)",
          hover: "rgb(var(--verde-hover) / <alpha-value>)",
          soft: "rgb(var(--verde-soft) / <alpha-value>)",
        },
        // Ottone: il metallo della bilancia. Solo per la firma visiva.
        ottone: {
          DEFAULT: "rgb(var(--ottone) / <alpha-value>)",
          soft: "rgb(var(--ottone-soft) / <alpha-value>)",
        },
        // Minio: il pigmento con cui si rigavano i registri in rosso. Uscite.
        minio: {
          DEFAULT: "rgb(var(--minio) / <alpha-value>)",
          soft: "rgb(var(--minio-soft) / <alpha-value>)",
        },
        // Il blocco pieno di chiusura: scuro in entrambi i temi, con i suoi
        // colori di testo dedicati.
        pieno: "rgb(var(--pieno) / <alpha-value>)",
        "su-pieno": "rgb(var(--su-pieno) / <alpha-value>)",
        "su-ottone": "rgb(var(--su-ottone) / <alpha-value>)",
        carta: "rgb(var(--carta) / <alpha-value>)",
        foglio: "rgb(var(--foglio) / <alpha-value>)",
        riga: "rgb(var(--riga) / <alpha-value>)",
      },
      fontFamily: {
        // Il display è tenuto con parsimonia: titoli e cifre della bilancia.
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        // Ogni numero del sito passa da qui: il prodotto è fatto di importi,
        // meritano un carattere proprio invece del ripiego tabular-nums.
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
