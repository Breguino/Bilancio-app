import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/mobile-menu";

export const MARKETING_NAV_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/cosa-offriamo", label: "Cosa offriamo" },
  { href: "/il-servizio", label: "Il servizio" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-20 relative border-b border-transparent backdrop-blur bg-white/90 dark:bg-neutral-950/90">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Bilancino">
          <Logo size={30} />
        </Link>
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium text-ink-secondary dark:text-neutral-400">
          {MARKETING_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink dark:hover:text-neutral-100">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline text-sm font-semibold text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
          >
            Accedi
          </Link>
          <div className="sm:hidden">
            <MobileMenu items={[...MARKETING_NAV_LINKS, { href: "/login", label: "Accedi" }]} />
          </div>
          <Link
            href="/signup"
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 py-2 transition-colors whitespace-nowrap"
          >
            Crea un account
          </Link>
        </div>
      </div>
    </nav>
  );
}
