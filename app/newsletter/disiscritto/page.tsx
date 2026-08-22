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
    <div className="sito min-h-screen">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-20 pb-20 max-w-[52ch] text-center mx-auto">
          <h1 className="display text-3xl mb-4">{t.newsletterUnsub.title}</h1>
          <p className="text-inchiostro-soft mb-8">
            {t.newsletterUnsub.body}
          </p>
          <Link
            href="/"
            className="bottone"
          >
            {t.newsletterUnsub.backToHome}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
