// Da Next 16 il comando `next lint` non esiste più: ESLint si invoca da solo
// (`npm run lint`) e `next build` non controlla più niente per conto suo.
// Cambia anche il formato: questa è la "flat config", quella che ESLint 10
// renderà l'unica possibile. Prima era `.eslintrc.json`.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "public/**"],
  },
  ...nextCoreWebVitals,
  {
    // La regola sta in un blocco a parte perché il plugin `@typescript-eslint`
    // lo registra già la config di Next: ridichiararlo qui farebbe abortire
    // ESLint ("plugin definito due volte"). Serve solo aggiungere la regola.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
