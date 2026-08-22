import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  return {
    title: t.newsletterUnsub.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default function NewsletterUnsubscribedPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[56ch] text-center mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">{t.newsletterUnsub.title}</h1>
          <p className="text-ink-secondary dark:text-neutral-400 mb-8">
            {t.newsletterUnsub.body}
          </p>
          <Link
            href="/"
            className="inline-flex bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            {t.newsletterUnsub.backToHome}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
