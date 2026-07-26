import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MARKETING_FOOTER_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/cosa-offriamo", label: "Cosa offriamo" },
  { href: "/il-servizio", label: "Il servizio" },
  { href: "/novita", label: "Novità" },
  { href: "/privacy", label: "Privacy" },
  { href: "/termini", label: "Termini" },
];

export async function SiteFooter() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const footerLinks = [
    ...MARKETING_FOOTER_LINKS,
    user ? { href: "/dashboard", label: "Dashboard" } : { href: "/login", label: "Accedi" },
  ];

  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-muted dark:text-neutral-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p>Bilancino — budget personale, non un gestionale.</p>
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
