import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

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
    { href: "/contacts", label: "Contatti" },
  ];

  return (
    <div className="min-h-screen">
      <header className="print:hidden border-b border-border dark:border-neutral-800">
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
            <ThemeToggle />
            <details className="md:hidden">
              <summary
                aria-label="Menu"
                className="list-none cursor-pointer w-9 h-9 rounded-full border border-border dark:border-neutral-700 flex items-center justify-center [&::-webkit-details-marker]:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="fixed inset-x-4 top-[76px] z-30 rounded-2xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-3 flex flex-col gap-1 text-base font-semibold">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </details>
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
