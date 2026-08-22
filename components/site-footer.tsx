import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form";
import { ManageCookiePreferencesLink } from "@/components/manage-cookie-preferences-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function SiteFooter() {
  const { locale, t } = getDictionary();

  const marketingFooterLinks = [
    { href: "/chi-siamo", label: t.nav.chiSiamo },
    { href: "/cosa-offriamo", label: t.nav.cosaOffriamo },
    { href: "/il-servizio", label: t.nav.ilServizio },
    // Le guide esistono solo in italiano: il link compare solo in quella lingua,
    // invece di portare chi naviga in inglese su una pagina che non può leggere.
    ...(locale === "it" ? [{ href: "/guide", label: t.siteFooter.guide }] : []),
    { href: "/privacy", label: t.siteFooter.privacy },
    { href: "/termini", label: t.siteFooter.termini },
  ];

  const hasAnalyticsConsent = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <footer className="border-t border-riga mt-4">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <p className="display text-xl text-inchiostro max-w-[24ch]">{t.siteFooter.tagline}</p>
            <Link
              href="/novita"
              className="tacca inline-flex items-center gap-2 mt-4 text-ottone hover:text-inchiostro transition-colors"
            >
              <span aria-hidden="true">→</span>
              {t.siteFooter.novita}
            </Link>
          </div>
          <nav className="flex flex-col gap-2.5 text-sm text-inchiostro-soft sm:text-right">
            {marketingFooterLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-verde transition-colors">
                {link.label}
              </Link>
            ))}
            <AuthGate
              loggedIn={
                <Link href="/dashboard" className="hover:text-verde transition-colors">
                  {t.nav.dashboard}
                </Link>
              }
              loggedOut={
                <Link href="/login" className="hover:text-verde transition-colors">
                  {t.nav.accedi}
                </Link>
              }
            />
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-t border-riga pt-8">
          <p className="text-sm text-inchiostro-muted max-w-[44ch] leading-relaxed">
            {t.siteFooter.newsletterBlurb}
          </p>
          <NewsletterSubscribeForm
            emailPlaceholder={t.shared.newsletterForm.emailPlaceholder}
            subscribeLabel={t.shared.newsletterForm.subscribe}
          />
        </div>

        {hasAnalyticsConsent ? (
          <div className="tacca">
            <ManageCookiePreferencesLink label={t.cookieConsent.managePreferences} />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
