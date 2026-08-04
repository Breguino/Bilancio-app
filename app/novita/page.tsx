import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.novita;
  return {
    title,
    description,
    alternates: { canonical: "/novita" },
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

export default function NovitaPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.novita.eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            {t.novita.heroTitle}
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            {t.novita.heroBody}
          </p>
          <p className="text-ink-muted dark:text-neutral-500 text-sm mt-4">{t.novita.lastUpdatedPrefix} {t.novita.lastUpdated}</p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="flex flex-col gap-10">
            {t.novita.entries.map((entry) => (
              <div key={entry.date} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-4 sm:gap-8">
                <p className="num text-sm font-bold text-accent sm:pt-0.5">{entry.date}</p>
                <ul className="flex flex-col gap-3">
                  {entry.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-ink-muted dark:before:text-neutral-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.novita.ideasEyebrow}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.novita.ideasTitle}
              </h2>
              <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed">
                {t.novita.ideasBody}
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {t.novita.ideas.map((idea) => (
                <li
                  key={idea}
                  className="border border-border dark:border-neutral-800 rounded-xl p-4 text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed"
                >
                  {idea}
                </li>
              ))}
            </ul>
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
