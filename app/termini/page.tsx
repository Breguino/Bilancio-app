import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.termini;
  return {
    title,
    description,
    alternates: { canonical: "/termini" },
    robots: { index: true, follow: true },
  };
}

export default function TerminiPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="tacca">{t.termini.eyebrow}</span>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] mt-5 mb-7">
            {t.termini.heroTitle}
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed">
            {t.termini.heroBody}
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.termini.whatItIsTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.termini.whatItIsParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.termini.whatItIsNotTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.termini.whatItIsNotParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.termini.yourResponsibilityTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.termini.yourResponsibilityParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.termini.ifSomethingGoesWrongTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.termini.ifSomethingGoesWrongParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                {t.termini.continuityTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              {t.termini.continuityParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-16 border-t border-riga">
          <Reveal>
            <p className="text-sm text-inchiostro-muted max-w-[62ch]">
              {t.termini.footerNotePre}{" "}
              <Link href="/novita" className="text-verde underline underline-offset-4">{t.termini.footerNoteLink}</Link>
              {t.termini.footerNoteMid}{" "}
              <a href="mailto:a2n0g004@gmail.com" className="text-verde underline underline-offset-4">
                a2n0g004@gmail.com
              </a>
              .
            </p>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
