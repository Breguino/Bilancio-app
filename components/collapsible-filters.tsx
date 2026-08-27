"use client";

import { useState, type ReactNode } from "react";

// I filtri sopra l'elenco dei movimenti. Prima erano sei controlli sempre
// aperti (cerca, categoria, contatto, da, a, pulsante) fra il titolo della
// scheda e i movimenti: un modulo da compilare prima di poter leggere.
//
// Adesso in vista restano solo le tre voci che si usano davvero — tutti,
// entrate, uscite — e il resto sta dietro "Altri filtri". Se un filtro
// avanzato e' attivo il pannello si apre da solo, altrimenti l'elenco
// sembrerebbe filtrato senza che si veda da cosa.
export function CollapsibleFilters({
  chips,
  moreLabel,
  lessLabel,
  defaultOpen = false,
  children,
}: {
  chips: ReactNode;
  moreLabel: string;
  lessLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3.5">
        {chips}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="sm:ml-auto border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-secondary dark:text-neutral-400 hover:border-accent hover:text-accent transition-colors"
        >
          {open ? lessLabel : moreLabel}
        </button>
      </div>
      {open ? <div className="px-5 pb-4">{children}</div> : null}
    </>
  );
}
