import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chiusura } from "@/components/chiusura";
import { Reveal } from "@/components/reveal";
import { Sezione, Discorso } from "@/components/sezione";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.chiSiamo;
  return {
    title,
    description,
    alternates: { canonical: "/chi-siamo" },
    openGraph: {
      title,
      description,
      images: ["/chi-siamo-photo.jpg"],
      locale: getLocale() === "it" ? "it_IT" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/chi-siamo-photo.jpg"],
    },
  };
}

export default function ChiSiamoPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        {/* Via la foto d'archivio della scrivania con il caffè: questa pagina
            dice "non c'è un ufficio marketing", e apriva con l'immagine che
            mette un ufficio marketing. Restano le parole, che sono buone. */}
        <header className="pt-16 pb-16 sm:pt-24 sm:pb-20 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-y-6 gap-x-10">
          <p className="tacca lg:pt-3">{t.chiSiamo.eyebrow}</p>
          <div>
            <h1 className="display text-[2.5rem] sm:text-[3.5rem] max-w-[18ch] mb-7">
              {t.chiSiamo.heroTitle}
            </h1>
            <p className="text-inchiostro-soft text-lg leading-relaxed max-w-[58ch]">
              {t.chiSiamo.heroBody}
            </p>
          </div>
        </header>

        <Sezione etichetta={t.chiSiamo.gapLabel}>
          <Reveal>
            <Discorso titolo={t.chiSiamo.gapTitle} paragrafi={t.chiSiamo.gapParagraphs} />
          </Reveal>
        </Sezione>

        <Sezione etichetta={t.chiSiamo.forWhomLabel}>
          <Reveal>
            <Discorso titolo={t.chiSiamo.forWhomTitle} paragrafi={t.chiSiamo.forWhomParagraphs} />
          </Reveal>
        </Sezione>

        <Sezione etichetta={t.chiSiamo.smallByDesignLabel}>
          <Reveal>
            <Discorso
              titolo={t.chiSiamo.smallByDesignTitle}
              paragrafi={t.chiSiamo.smallByDesignParagraphs}
            />
          </Reveal>
        </Sezione>

        <Chiusura
          titolo={t.chiSiamo.ctaTitle}
          secondario={{ href: "/cosa-offriamo", label: t.chiSiamo.ctaSeeOffer }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
