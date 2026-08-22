import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
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
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="tacca">{t.novita.eyebrow}</span>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] mt-5 mb-7">
            {t.novita.heroTitle}
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed">
            {t.novita.heroBody}
          </p>
          <p className="text-inchiostro-muted text-sm mt-4">{t.novita.lastUpdatedPrefix} {t.novita.lastUpdated}</p>
        </header>

        <section className="py-12 sm:py-14 border-t border-riga">
          <div className="flex flex-col gap-10">
            {t.novita.entries.map((entry, i) => (
              <Reveal
                key={entry.date}
                delay={i * 80}
                className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-4 sm:gap-8"
              >
                <p className="cifra text-sm text-ottone sm:pt-0.5">{entry.date}</p>
                <ul className="flex flex-col gap-3">
                  {entry.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-inchiostro-soft leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-inchiostro-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="tacca">{t.novita.ideasEyebrow}</span>
              <h2 className="display text-2xl sm:text-3xl mt-4 mb-5 max-w-[20ch]">
                {t.novita.ideasTitle}
              </h2>
              <p className="text-inchiostro-soft leading-relaxed">
                {t.novita.ideasBody}
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {t.novita.ideas.map((idea) => (
                <li
                  key={idea}
                  className="foglio p-4 text-sm text-inchiostro-soft leading-relaxed"
                >
                  {idea}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="py-14 sm:py-20 border-t border-riga">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <AuthGate
              loggedIn={
                <>
                  <h2 className="display text-3xl sm:text-[2.5rem] max-w-[22ch]">
                    {t.home.ctaTitleReturning}
                  </h2>
                  <p className="text-inchiostro-soft max-w-[46ch]">{t.home.ctaBodyReturning}</p>
                  <Link
                    href="/dashboard"
                    className="bottone mt-2"
                  >
                    {t.home.ctaDashboard}
                  </Link>
                </>
              }
              loggedOut={
                <>
                  <h2 className="display text-3xl sm:text-[2.5rem] max-w-[22ch]">
                    {t.home.ctaTitleNew}
                  </h2>
                  <p className="text-inchiostro-soft max-w-[46ch]">{t.home.ctaBodyNew}</p>
                  <Link
                    href="/signup"
                    className="bottone mt-2"
                  >
                    {t.home.ctaSignupFree}
                  </Link>
                </>
              }
            />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
