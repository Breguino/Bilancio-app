"use client";

import { useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";

// L'intestazione di ogni pagina dell'app: a sinistra il titolo, a destra i
// comandi (il mese su cui stai guardando) e il pulsante che apre il modulo.
//
// Il modulo prima era una scheda sempre aperta fra il titolo e i dati: sei
// campi in panoramica, otto sulle ricorrenti. Chi apriva l'app per guardare i
// movimenti doveva scorrere oltre il modulo per arrivarci. Adesso il modulo
// sta dietro il pulsante e il posto migliore ce l'hanno i dati.
//
// Il pannello e il pulsante devono condividere lo stato "aperto", ma sulla
// pagina stanno in due punti diversi: per questo il componente li rende
// entrambi, con il pannello subito sotto la riga del titolo.
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  controls,
  actionLabel,
  panelTitle,
  closeLabel,
  panel,
  defaultOpen = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  controls?: ReactNode;
  actionLabel?: string;
  panelTitle?: string;
  closeLabel?: string;
  panel?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {controls}
          {panel ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 sm:px-5 py-2.5 transition-colors"
            >
              <Plus size={15} strokeWidth={2.2} />
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>

      {panel && open ? (
        <div className="border border-accent rounded-xl p-5 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-bold">{panelTitle}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 border border-border dark:border-neutral-700 rounded-full px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              <X size={13} strokeWidth={2.2} />
              {closeLabel}
            </button>
          </div>
          {panel}
        </div>
      ) : null}
    </>
  );
}
