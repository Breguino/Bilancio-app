import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthActions } from "@/components/auth-actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLoggedIn } from "@/lib/auth/session";

export function SiteHeader() {
  const { locale, t } = getDictionary();
  const loggedIn = isLoggedIn();

  const marketingNavLinks = [
    { href: "/chi-siamo", label: t.nav.chiSiamo },
    { href: "/cosa-offriamo", label: t.nav.cosaOffriamo },
    { href: "/demo", label: t.nav.demo },
    { href: "/il-servizio", label: t.nav.ilServizio },
    { href: "/#faq", label: t.nav.faq },
  ];

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
          <AuthActions loggedIn={loggedIn} nav={t.nav} marketingNavLinks={marketingNavLinks} />
        </div>
      </div>
    </nav>
  );
}
