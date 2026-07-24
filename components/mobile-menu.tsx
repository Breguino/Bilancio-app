"use client";

import Link from "next/link";
import { useState } from "react";

type MenuItem = { href: string; label: string };

export function MobileMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-full border border-border dark:border-neutral-800 flex items-center justify-center shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <div
        className="absolute inset-x-0 top-full z-30 grid transition-[grid-template-rows] duration-300 ease-out bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-b border-border dark:border-neutral-800 shadow-xl"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 p-3 text-base font-semibold">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
