import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/mobile-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function SiteHeader() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { locale, t } = getDictionary();

  const marketingNavLinks = [
    { href: "/chi-siamo", label: t.nav.chiSiamo },
    { href: "/cosa-offriamo", label: t.nav.cosaOffriamo },
    { href: "/il-servizio", label: t.nav.ilServizio },
    { href: "/#faq", label: t.nav.faq },
  ];

  const mobileItems = user
    ? [...marketingNavLinks, { href: "/dashboard", label: t.nav.dashboard }]
    : [...marketingNavLinks, { href: "/login", label: t.nav.accedi }];

  return (
    <nav className="sticky top-0 z-20 relative border-b border-transparent backdrop-blur bg-white/90 dark:bg-neutral-950/90">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 -ml-2 px-2 py-2 rounded-full hover:bg-surface-alt dark:hover:bg-neutral-800 transition-colors"
          aria-label="Bilancino"
        >
          <Logo size={30} />
        </Link>
        <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-ink-secondary dark:text-neutral-400">
          {marketingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 hover:bg-surface-alt dark:hover:bg-neutral-800 hover:text-ink dark:hover:text-neutral-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t.common.langSwitchLabel} />
          <ThemeToggle ariaLabel={t.shared.themeToggle.ariaLabel} title={t.shared.themeToggle.title} />
          {!user ? (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center h-9 text-sm font-semibold text-ink-secondary dark:text-neutral-400 border border-border dark:border-neutral-700 rounded-full px-4 hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
            >
              {t.nav.accedi}
            </Link>
          ) : null}
          <div className="sm:hidden">
            <MobileMenu items={mobileItems} />
          </div>
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center h-9 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">{user ? t.nav.vaiDashboardShort : t.nav.creaAccountShort}</span>
            <span className="hidden sm:inline">{user ? t.nav.vaiDashboard : t.nav.creaAccount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
