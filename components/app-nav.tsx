"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string };

export function AppNav({ links, navLabel }: { links: NavLink[]; navLabel: string }) {
  const pathname = usePathname();

  // Da 1280px in su: sotto, otto voci più i comandi non entrano nella barra e
  // la facevano traboccare. Lì subentra il menu compatto.
  return (
    <nav aria-label={navLabel} className="hidden xl:flex items-center gap-1 text-sm font-medium">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-2.5 py-2 transition-colors whitespace-nowrap ${
              active
                ? "bg-accent-soft dark:bg-accent/20 text-accent"
                : "text-ink-secondary dark:text-neutral-400 hover:bg-surface-alt dark:hover:bg-neutral-800 hover:text-ink dark:hover:text-neutral-100"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
