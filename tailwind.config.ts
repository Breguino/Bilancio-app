import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

// I colori del testo di supporto erano sotto la soglia di leggibilità: il
// grigio dava 2,98–3,35:1 su sfondo chiaro e 3,19 su scuro, dove ne servono
// 4,5. Verde, ambra e rosso usati per gli importi stavano fra 3,18 e 3,77.
// Qui restano la stessa tinta, abbassata solo in luminosità quanto basta.
//
// Le tinte di Tailwind si sovrascrivono una tonalità alla volta, ma bisogna
// riportare tutte le altre: assegnare solo la 600 cancellerebbe il resto
// della scala, che serve alle varianti scure.
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14151a",
        "ink-secondary": "#55565f",
        // 2,98–3,35:1 prima, ora 4,65–5,22 sui tre sfondi chiari.
        "ink-muted": "#6b6c74",
        // Usato solo come text-neutral-500, 129 volte, per il testo di
        // supporto in tema scuro: 3,19 sul grigio delle schede, ora 4,68.
        neutral: { ...colors.neutral, 500: "#8f8f8f" },
        // Importi in entrata (3,77 → 5,48).
        emerald: { ...colors.emerald, 600: "#047857" },
        // Avviso "vicino al limite" sui budget (3,19 → 6,01).
        amber: { ...colors.amber, 600: "#a2490a" },
        // La riga delle uscite nel grafico della home (3,67 → 6,29).
        rose: { ...colors.rose, 500: "#be123c" },
        // Le pastiglie di variazione in "Confronta" sono rosse su fondo rosso
        // chiaro: 4,41, cioè sotto per un soffio. Con la 700 diventa 5,91.
        red: { ...colors.red, 600: "#b91c1c" },
        // Petrolio. Prima qui c'era #4f46e5, che è esattamente l'indigo-600
        // del tema predefinito di Tailwind: il colore che resta quando nessuno
        // ne sceglie uno, e che si riconosce in ogni progetto generato.
        accent: {
          DEFAULT: "#0e6e80",
          hover: "#0b5766",
          soft: "#e1eff2",
        },
        surface: "#ffffff",
        "surface-alt": "#f2f2ee",
        bg: "#fbfbf8",
        border: "rgba(20,21,26,0.10)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
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
