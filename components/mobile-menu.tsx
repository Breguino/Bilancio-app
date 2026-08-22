"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MenuItem = { href: string; label: string };

// Come ThemeToggle e LanguageSwitcher: stesso componente, due identità. La
// variante "app" è quella di prima e resta il default.
type Variant = "app" | "sito";

const stile: Record<Variant, { bottone: string; pannello: string; voce: string; attiva: string }> = {
  app: {
    bottone: "rounded-full border-border dark:border-neutral-800",
    pannello:
      "rounded-2xl bg-white/90 dark:bg-neutral-950/90 border-border dark:border-neutral-800 shadow-xl",
    voce: "rounded-xl hover:bg-black/5 dark:hover:bg-white/5",
    attiva: "rounded-xl bg-accent-soft dark:bg-accent/20 text-accent",
  },
  sito: {
    bottone: "rounded-sm border-riga text-inchiostro-soft",
    pannello: "rounded-sm bg-carta/95 border-riga shadow-lg",
    voce: "rounded-sm text-inchiostro-soft hover:text-inchiostro hover:bg-verde-soft",
    attiva: "rounded-sm bg-verde-soft text-verde",
  },
};

export function MobileMenu({ items, variant = "app" }: { items: MenuItem[]; variant?: Variant }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const s = stile[variant];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className={`w-9 h-9 border flex items-center justify-center shrink-0 ${s.bottone}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      {/* Niente più trucchi di altezza animata (grid-template-rows 0fr→1fr,
          poi max-height): in entrambi i casi il pannello restava alto ~0px
          nonostante aria-expanded="true" e la classe giusta applicata —
          confermato anche su telefono reale, non solo negli strumenti di
          test. Qui l'elemento ha sempre la sua altezza naturale (nessun
          max-height/grid da indovinare): si anima solo opacità e scala,
          proprietà che non toccano il layout e quindi non possono collassare
          il contenuto a zero. */}
      <div
        className={`absolute inset-x-3 top-full mt-2 z-30 origin-top backdrop-blur-md border transition duration-200 ease-out ${s.pannello} ${
          open
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-95 invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1 p-3 text-base font-semibold">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`px-4 py-3.5 transition-colors ${active ? s.attiva : s.voce}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
