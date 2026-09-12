"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle({
  ariaLabel = "Cambia tema chiaro/scuro",
  title = "Cambia tema",
}: {
  ariaLabel?: string;
  title?: string;
} = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // il tema vero lo sa solo il browser: al primo render il server non può
  // indovinarlo e disegnare il bottone sbagliato farebbe lampeggiare l'icona.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="w-9 h-9 rounded-full border border-border inline-block" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={ariaLabel}
      title={title}
      className="w-9 h-9 rounded-full border border-border bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
