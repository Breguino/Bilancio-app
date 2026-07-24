"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type MenuItem = { href: string; label: string };

export function MobileMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  function onDragStart(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  }
  function onDragMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setPos({
      x: drag.current.origX + (e.clientX - drag.current.startX),
      y: drag.current.origY + (e.clientY - drag.current.startY),
    });
  }
  function onDragEnd() {
    drag.current = null;
  }

  function close() {
    setOpen(false);
    setPos({ x: 0, y: 0 });
  }

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
        className={`fixed z-30 top-[76px] right-4 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-border dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xl transition-[opacity,transform] duration-200 ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)${open ? "" : " scale(0.95)"}` }}
        aria-hidden={!open}
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="flex items-center justify-center py-2 cursor-grab active:cursor-grabbing touch-none"
        >
          <span className="w-10 h-1.5 rounded-full bg-border dark:bg-neutral-700" />
        </div>
        <nav className="flex flex-col gap-1 p-3 pt-0 text-base font-semibold">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
