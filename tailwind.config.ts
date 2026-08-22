import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14151a",
        "ink-secondary": "#55565f",
        "ink-muted": "#8b8c94",
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
