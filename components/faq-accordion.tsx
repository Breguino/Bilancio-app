"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-border dark:border-neutral-800">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-border dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 text-left py-5 font-semibold hover:text-accent transition-colors"
            >
              <span>{item.q}</span>
              <span
                className={`shrink-0 w-5 h-5 flex items-center justify-center text-ink-muted dark:text-neutral-500 transition-transform ${
                  open ? "rotate-45 text-accent" : ""
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
                <p className="text-ink-secondary dark:text-neutral-400 text-sm leading-relaxed pb-5 max-w-[60ch]">
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
