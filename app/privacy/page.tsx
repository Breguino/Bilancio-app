import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.privacy;
  return {
    title,
    description,
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="tacca">{t.privacy.eyebrow}</span>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] mt-5 mb-7">
            {t.privacy.heroTitle}
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed">
            {t.privacy.heroBody}
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.privacy.dataCollectedTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.privacy.dataCollectedParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.privacy.hostingTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.privacy.hostingParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.privacy.isolationTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.privacy.isolationParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.privacy.cookiesTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.privacy.cookiesParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.privacy.yourDataTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              <p>{t.privacy.yourDataPara1}</p>
              <p>
                {t.privacy.yourDataPara2Pre}{" "}
                <a href="mailto:a2n0g004@gmail.com" className="text-verde font-medium">
                  a2n0g004@gmail.com
                </a>{" "}
                {t.privacy.yourDataPara2Post}
              </p>
              <p>{t.privacy.yourDataPara3}</p>
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-16 border-t border-riga">
          <Reveal>
            <p className="text-sm text-inchiostro-muted max-w-[62ch]">
              {t.privacy.footerNotePre}{" "}
              <Link href="/novita" className="text-verde underline underline-offset-4">{t.privacy.footerNoteLink}</Link>.
            </p>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
