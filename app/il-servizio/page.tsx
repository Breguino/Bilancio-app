import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.ilServizio;
  return {
    title,
    description,
    alternates: { canonical: "/il-servizio" },
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      locale: getLocale() === "it" ? "it_IT" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}

export default function IlServizioPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.ilServizio.eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            {t.ilServizio.heroTitle}
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            {t.ilServizio.heroBody}
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="max-w-[60ch] mb-10">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.ilServizio.howItWorksEyebrow}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              {t.ilServizio.howItWorksTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.ilServizio.steps.map((step) => (
              <div
                key={step.n}
                className="border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900"
              >
                <span className="num text-xs font-bold text-accent">{step.n}</span>
                <h3 className="font-bold mt-2 mb-1.5">{step.title}</h3>
                <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.ilServizio.priceEyebrow}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[18ch]">
                {t.ilServizio.priceTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>{t.ilServizio.pricePara1}</p>
              <p>
                {t.ilServizio.pricePara2Pre}{" "}
                <Link href="/novita" className="text-accent font-medium hover:underline">
                  {t.ilServizio.pricePara2Link}
                </Link>
                {t.ilServizio.pricePara2Post}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.ilServizio.securityEyebrow}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.ilServizio.securityTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              {t.ilServizio.securityParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.ilServizio.dataEyebrow}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.ilServizio.dataTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              {t.ilServizio.dataParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {t.ilServizio.dataLeavePre}{" "}
                <a href={`mailto:${t.ilServizio.dataLeaveEmail}`} className="text-accent font-medium hover:underline">
                  {t.ilServizio.dataLeaveEmail}
                </a>{" "}
                {t.ilServizio.dataLeavePost}
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 flex flex-col items-center text-center gap-5 border-t border-border dark:border-neutral-800">
          <AuthGate
            loggedIn={
              <>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                  {t.home.ctaTitleReturning}
                </h2>
                <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">{t.home.ctaBodyReturning}</p>
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
                >
                  {t.home.ctaDashboard}
                </Link>
              </>
            }
            loggedOut={
              <>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                  {t.home.ctaTitleNew}
                </h2>
                <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">{t.home.ctaBodyNew}</p>
                <Link
                  href="/signup"
                  className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
                >
                  {t.home.ctaSignupFree}
                </Link>
              </>
            }
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
