import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form";
import { ManageCookiePreferencesLink } from "@/components/manage-cookie-preferences-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function SiteFooter() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = getDictionary();

  const marketingFooterLinks = [
    { href: "/chi-siamo", label: t.nav.chiSiamo },
    { href: "/cosa-offriamo", label: t.nav.cosaOffriamo },
    { href: "/il-servizio", label: t.nav.ilServizio },
    { href: "/privacy", label: t.siteFooter.privacy },
    { href: "/termini", label: t.siteFooter.termini },
  ];

  const footerLinks = [
    ...marketingFooterLinks,
    user ? { href: "/dashboard", label: t.nav.dashboard } : { href: "/login", label: t.nav.accedi },
  ];

  const hasAnalyticsConsent = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink-muted dark:text-neutral-500 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <p>{t.siteFooter.tagline}</p>
          <Link
            href="/novita"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-3 py-1 hover:bg-accent hover:text-white dark:hover:text-white transition-colors shrink-0"
          >
            {t.siteFooter.novita}
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
        <p className="text-xs">{t.siteFooter.newsletterBlurb}</p>
        <NewsletterSubscribeForm
          emailPlaceholder={t.shared.newsletterForm.emailPlaceholder}
          subscribeLabel={t.shared.newsletterForm.subscribe}
        />
      </div>
      {hasAnalyticsConsent ? (
        <div className="text-center sm:text-left text-xs">
          <ManageCookiePreferencesLink label={t.cookieConsent.managePreferences} />
        </div>
      ) : null}
    </footer>
  );
}
