"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Il pulsante vive sia nell'header del sito pubblico che in quello dell'app
// riservata, che hanno due identità diverse. Invece di ridisegnarlo per tutti
// e due — il tema dell'app qui non è in discussione — la variante è esplicita
// e "app" resta il comportamento di prima.
type Variant = "app" | "sito";

const guscio: Record<Variant, string> = {
  app: "w-9 h-9 rounded-full border border-border bg-white dark:bg-neutral-900 hover:border-accent hover:text-accent",
  sito: "w-9 h-9 rounded-sm border border-riga bg-foglio text-inchiostro-soft hover:border-verde hover:text-verde",
};

export function ThemeToggle({
  ariaLabel = "Cambia tema chiaro/scuro",
  title = "Cambia tema",
  variant = "app",
}: {
  ariaLabel?: string;
  title?: string;
  variant?: Variant;
} = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={`inline-block ${
          variant === "sito" ? "w-9 h-9 rounded-sm border border-riga" : "w-9 h-9 rounded-full border border-border"
        }`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={ariaLabel}
      title={title}
      className={`flex items-center justify-center shrink-0 transition-colors ${guscio[variant]}`}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
