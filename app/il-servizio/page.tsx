import Link from "next/link";
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
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-16 sm:pt-24 sm:pb-20 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-y-6 gap-x-10">
          <p className="tacca lg:pt-3">{t.ilServizio.eyebrow}</p>
          <div>
            <h1 className="display text-[2.5rem] sm:text-[3.5rem] max-w-[20ch] mb-7">
              {t.ilServizio.heroTitle}
            </h1>
            <p className="text-inchiostro-soft text-lg leading-relaxed max-w-[58ch]">
              {t.ilServizio.heroBody}
            </p>
          </div>
        </header>

        {/* Qui i numeri ci vogliono davvero: creare l'account, aggiungere i
            dati, la settimana tipo, la fine del mese sono passaggi in ordine, e
            l'ordine è l'informazione. Sono impaginati come le righe di un
            registro, non come quattro schede uguali. */}
        <Sezione etichetta={t.ilServizio.howItWorksEyebrow}>
          <h2 className="display text-2xl sm:text-3xl max-w-[22ch] mb-10">
            {t.ilServizio.howItWorksTitle}
          </h2>
          <ol className="border-t border-riga">
            {t.ilServizio.steps.map((step, i) => (
              <li key={step.n} className="border-b border-riga">
                <Reveal delay={i * 70}>
                  <div className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_1fr_1.4fr] gap-x-5 gap-y-2 py-7 items-baseline">
                    <span className="cifra text-xs text-ottone">{step.n}</span>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-inchiostro-soft leading-relaxed col-start-2 sm:col-start-3 max-w-[50ch]">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Sezione>

        <Sezione etichetta={t.ilServizio.priceEyebrow}>
          <Reveal>
            <Discorso titolo={t.ilServizio.priceTitle}>
              <p>{t.ilServizio.pricePara1}</p>
              <p>
                {t.ilServizio.pricePara2Pre}{" "}
                <Link href="/novita" className="text-verde font-medium underline underline-offset-4">
                  {t.ilServizio.pricePara2Link}
                </Link>
                {t.ilServizio.pricePara2Post}
              </p>
            </Discorso>
          </Reveal>
        </Sezione>

        {/* La scelta di non collegarsi alla banca è il punto in cui questo
            prodotto si distingue davvero dagli altri: è l'unica sezione con il
            fondo pieno, così non si legge come una nota a piè di pagina. */}
        <Sezione etichetta={t.ilServizio.manualEyebrow}>
          <Reveal className="foglio p-7 sm:p-10">
            <Discorso
              titolo={t.ilServizio.manualTitle}
              paragrafi={t.ilServizio.manualParagraphs}
            />
          </Reveal>
        </Sezione>

        <Sezione etichetta={t.ilServizio.securityEyebrow}>
          <Reveal>
            <Discorso
              titolo={t.ilServizio.securityTitle}
              paragrafi={t.ilServizio.securityParagraphs}
            />
          </Reveal>
        </Sezione>

        <Sezione etichetta={t.ilServizio.dataEyebrow}>
          <Reveal>
            <Discorso titolo={t.ilServizio.dataTitle} paragrafi={t.ilServizio.dataParagraphs}>
              <p>
                {t.ilServizio.dataLeavePre}{" "}
                <a
                  href={`mailto:${t.ilServizio.dataLeaveEmail}`}
                  className="text-verde font-medium underline underline-offset-4"
                >
                  {t.ilServizio.dataLeaveEmail}
                </a>{" "}
                {t.ilServizio.dataLeavePost}
              </p>
            </Discorso>
          </Reveal>
        </Sezione>

        <Chiusura />
      </main>

      <SiteFooter />
    </div>
  );
}
