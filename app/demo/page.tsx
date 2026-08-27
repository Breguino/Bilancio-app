import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { DemoTour } from "@/components/demo-tour";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const locale = getLocale();
  const { metaTitle: title, metaDescription: description } = dictionaryFor(locale).demo;
  return {
    title,
    description,
    alternates: { canonical: "/demo" },
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      locale: locale === "it" ? "it_IT" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}

export default function DemoPage() {
  const locale = getLocale();
  const t = dictionaryFor(locale);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main id="contenuto" className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-10 sm:pt-20 sm:pb-12 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.demo.eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            {t.demo.heroTitle}
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">{t.demo.heroBody}</p>
        </header>

        <section className="pb-12 sm:pb-14">
          <DemoTour screens={t.demo.screens} locale={locale} caption={t.demo.caption} />
          <p className="text-sm text-ink-muted dark:text-neutral-500 leading-relaxed max-w-[62ch] mt-10 pt-6 border-t border-border dark:border-neutral-800">
            {t.demo.note}
          </p>
        </section>

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              {t.demo.ctaTitle}
            </h2>
            <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">{t.demo.ctaBody}</p>
            <AuthGate
              loggedIn={
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-1"
                >
                  {t.home.ctaDashboard}
                </Link>
              }
              loggedOut={
                <Link
                  href="/signup"
                  className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-1"
                >
                  {t.home.ctaSignupFree}
                </Link>
              }
            />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
