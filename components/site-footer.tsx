import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/cosa-offriamo", label: "Cosa offriamo" },
  { href: "/il-servizio", label: "Il servizio" },
  { href: "/login", label: "Accedi" },
];

export function SiteFooter() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-muted dark:text-neutral-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p>Bilancino — budget personale, non un gestionale.</p>
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
