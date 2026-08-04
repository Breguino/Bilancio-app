import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthActions } from "@/components/auth-actions";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";

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
          <AuthActions />
        </div>
      </div>
    </nav>
  );
}
