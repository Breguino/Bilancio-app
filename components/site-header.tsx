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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Bilancino">
          <Logo size={30} />
        </Link>
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium text-ink-secondary dark:text-neutral-400">
          {marketingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink dark:hover:text-neutral-100">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={t.common.langSwitchLabel} />
          <ThemeToggle ariaLabel={t.shared.themeToggle.ariaLabel} title={t.shared.themeToggle.title} />
          {!user ? (
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-semibold text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
            >
              {t.nav.accedi}
            </Link>
          ) : null}
          <div className="sm:hidden">
            <MobileMenu items={mobileItems} />
          </div>
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 py-2 transition-colors whitespace-nowrap"
          >
            {user ? t.nav.vaiDashboard : t.nav.creaAccount}
          </Link>
        </div>
      </div>
    </nav>
  );
}
