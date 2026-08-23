"use client";

import { useState } from "react";
import Image from "next/image";

export type DemoScreen = {
  key: string;
  tab: string;
  title: string;
  body: string;
  alt: string;
};

// Il giro guidato: si sceglie una funzione a sinistra e si vede la schermata
// corrispondente. Sono immagini vere dell'app, catturate su un account
// dimostrativo con dati inventati, non ricostruzioni dell'interfaccia.
export function DemoTour({
  screens,
  locale,
  caption,
}: {
  screens: DemoScreen[];
  locale: string;
  caption: string;
}) {
  const [active, setActive] = useState(screens[0].key);
  const current = screens.find((s) => s.key === active) ?? screens[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
      {/* Su schermi stretti diventa una fila che scorre: una colonna di sette
          voci sopra l'immagine spingerebbe la schermata fuori dalla prima
          videata, che è proprio quello che si è venuti a vedere. */}
      <div
        role="tablist"
        aria-label={caption}
        className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 pb-1 lg:pb-0"
      >
        {screens.map((s) => {
          const selected = s.key === current.key;
          return (
            <button
              key={s.key}
              role="tab"
              aria-selected={selected}
              aria-controls="demo-schermata"
              onClick={() => setActive(s.key)}
              className={`shrink-0 lg:shrink text-left text-sm font-semibold rounded-full lg:rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap lg:whitespace-normal ${
                selected
                  ? "bg-accent text-white"
                  : "border border-border dark:border-neutral-800 text-ink-secondary dark:text-neutral-400 hover:border-accent hover:text-accent"
              }`}
            >
              {s.tab}
            </button>
          );
        })}
      </div>

      <div id="demo-schermata" role="tabpanel" className="min-w-0">
        <figure className="rounded-2xl overflow-hidden border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
          {/* Su telefono la schermata rimpicciolita diventa illeggibile, ed è
              proprio quello che si è venuti a vedere: qui si trascina di lato
              a una dimensione in cui i numeri si leggono. Da tablet in su ci
              sta tutta e lo scorrimento non serve. */}
          <div className="overflow-x-auto lg:overflow-visible">
          <Image
            src={`/demo/${current.key}-${locale}.png`}
            alt={current.alt}
            width={1500}
            height={860}
            className="w-full h-auto min-w-[680px] lg:min-w-0"
            sizes="(max-width: 1024px) 760px, 760px"
            priority
          />
          </div>
          <figcaption className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 px-4 py-2.5 border-t border-border dark:border-neutral-800">
            {caption}
          </figcaption>
        </figure>

        <div className="mt-5 max-w-[62ch]">
          <h3 className="text-xl font-bold mb-2">{current.title}</h3>
          <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed">{current.body}</p>
        </div>
      </div>
    </div>
  );
}
