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
        accent: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
          soft: "#ecebfc",
        },
        surface: "#ffffff",
        "surface-alt": "#f2f2ee",
        bg: "#fbfbf8",
        border: "rgba(20,21,26,0.10)",
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
