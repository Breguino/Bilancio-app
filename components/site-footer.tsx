import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form";

const MARKETING_FOOTER_LINKS = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/cosa-offriamo", label: "Cosa offriamo" },
  { href: "/il-servizio", label: "Il servizio" },
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
    <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-muted dark:text-neutral-500 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <p>Bilancino — budget personale, non un gestionale.</p>
          <Link
            href="/novita"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-3 py-1 hover:bg-accent hover:text-white dark:hover:text-white transition-colors shrink-0"
          >
            ✨ Novità
          </Link>
        </div>
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border dark:border-neutral-800 pt-6 text-center sm:text-left">
        <p className="text-xs">Aggiornamenti su Bilancino via email, una volta al mese, niente spam.</p>
        <NewsletterSubscribeForm />
      </div>
    </footer>
  );
}
