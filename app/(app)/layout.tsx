import Link from "next/link";
import { Home } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navLinks = [
    { href: "/dashboard", label: "Panoramica" },
    { href: "/recurring", label: "Ricorrenti" },
    { href: "/budget", label: "Budget" },
    { href: "/goals", label: "Obiettivi" },
    { href: "/compare", label: "Confronta" },
    { href: "/yearly", label: "Annuale" },
    { href: "/statistics", label: "Statistiche" },
    { href: "/contacts", label: "Contatti" },
  ];

  return (
    <div className="min-h-screen">
      <header className="print:hidden sticky top-0 z-20 relative border-b border-border dark:border-neutral-800 backdrop-blur bg-white/90 dark:bg-neutral-950/90">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 font-extrabold" aria-label="Bilancino">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100 whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-ink-muted dark:text-neutral-500 text-sm hidden lg:inline">
              {user?.email}
            </span>
            <Link
              href="/"
              aria-label="Torna al sito pubblico"
              title="Torna al sito"
              className="w-9 h-9 rounded-full border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <Home size={16} strokeWidth={1.75} />
            </Link>
            <ThemeToggle />
            <div className="md:hidden">
              <MobileMenu items={navLinks} />
            </div>
            <form action="/logout" method="post">
              <button
                type="submit"
                className="border border-border dark:border-neutral-700 rounded-full px-4 py-1.5 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                Esci
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
