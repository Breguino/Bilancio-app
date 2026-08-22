"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-riga">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-riga">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-baseline gap-5 text-left py-5 group"
            >
              {/* Il numero di riga, non un ornamento: le domande sono una lista
                  numerata come le voci di un registro. */}
              <span
                className={`cifra text-xs shrink-0 tabular-nums transition-colors ${
                  open ? "text-ottone" : "text-inchiostro-muted"
                }`}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`flex-1 font-medium transition-colors ${
                  open ? "text-verde" : "text-inchiostro group-hover:text-verde"
                }`}
              >
                {item.q}
              </span>
              <span
                className={`shrink-0 w-4 h-4 flex items-center justify-center text-inchiostro-muted transition-transform duration-200 ${
                  open ? "rotate-45 text-ottone" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              aria-hidden={!open}
            >
              <div className="overflow-hidden">
                <p className="text-inchiostro-soft leading-relaxed pb-6 pl-10 max-w-[64ch]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
