import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthActions } from "@/components/auth-actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function SiteHeader() {
  const { locale, t } = getDictionary();

  const marketingNavLinks = [
    { href: "/chi-siamo", label: t.nav.chiSiamo },
    { href: "/cosa-offriamo", label: t.nav.cosaOffriamo },
    { href: "/il-servizio", label: t.nav.ilServizio },
    { href: "/#faq", label: t.nav.faq },
  ];

  return (
    <nav className="sticky top-0 z-20 relative border-b border-riga bg-carta/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 -ml-1 px-1 py-1.5 group"
          aria-label="Bilancino"
        >
          <Logo size={28} />
          <span className="display text-lg text-inchiostro hidden sm:inline">Bilancino</span>
        </Link>
        <div className="hidden sm:flex items-center gap-0.5 text-sm text-inchiostro-soft">
          {marketingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 hover:text-verde transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t.common.langSwitchLabel} variant="sito" />
          <ThemeToggle
            ariaLabel={t.shared.themeToggle.ariaLabel}
            title={t.shared.themeToggle.title}
            variant="sito"
          />
          <AuthActions nav={t.nav} marketingNavLinks={marketingNavLinks} />
        </div>
      </div>
    </nav>
  );
}
