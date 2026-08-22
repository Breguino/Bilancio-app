import Link from "next/link";
import { FaqAccordion } from "@/components/faq-accordion";
import { StatsDemo } from "@/components/stats-demo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { Sezione } from "@/components/sezione";
import { Chiusura } from "@/components/chiusura";
import { Bilancia, type MeseBilancia } from "@/components/bilancia";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { BarChart3, RefreshCw, Users, Target, Receipt, Upload } from "lucide-react";

// Gli stessi sei mesi di esempio di prima, ora pesati dalla bilancia invece che
// disegnati come spezzata.
const ENTRATE = [2400, 2550, 2500, 2800, 3100, 3250];
const USCITE = [1750, 1900, 1680, 2050, 2200, 1900];

function ultimiSeiMesi(numberLocale: string): MeseBilancia[] {
  const oggi = new Date();
  const nomeMese = new Intl.DateTimeFormat(numberLocale, { month: "short" });
  return ENTRATE.map((entrate, i) => {
    const data = new Date(oggi.getFullYear(), oggi.getMonth() - (ENTRATE.length - 1 - i), 1);
    return {
      label: nomeMese.format(data).replace(".", ""),
      entrate,
      uscite: USCITE[i],
    };
  });
}

const featureIcons = [BarChart3, RefreshCw, Users, Target, Receipt];

export default function HomePage() {
  const { locale, t } = getDictionary();
  const numberLocale = locale === "it" ? "it-IT" : "en-IE";
  const mesi = ultimiSeiMesi(numberLocale);

  const features = t.home.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));
  const faqItems = t.home.faqItems;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Bilancino",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: t.home.jsonLdDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="sito min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* ─── L'eroe ───────────────────────────────────────────────────────────
          La tesi della pagina è lo strumento, non una fotografia d'archivio di
          qualcuno al portatile: il mese pende da una parte, e si vede da quale. */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-20 sm:pt-24 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,26rem)] gap-14 lg:gap-20 items-center">
        <div>
          <p className="tacca">{t.home.heroEyebrow}</p>
          <h1 className="display text-[2.75rem] sm:text-6xl mt-5 mb-6">
            {t.home.heroTitlePre}{" "}
            <em className="not-italic text-verde">{t.home.heroTitleAccent}</em>.
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed max-w-[48ch] mb-9">
            {t.home.heroBody}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <AuthGate
              loggedIn={
                <Link href="/dashboard" className="bottone">
                  {t.home.ctaDashboard}
                </Link>
              }
              loggedOut={
                <Link href="/signup" className="bottone">
                  {t.home.ctaSignupFree}
                </Link>
              }
            />
            <a href="#funzionalita" className="bottone-quieto">
              {t.home.ctaHowItWorks}
            </a>
          </div>

          {/* L'obiezione all'inserimento manuale si forma qui, davanti al
              bottone: la risposta va data qui, non in fondo a "cosa offriamo". */}
          <p className="flex items-start gap-2.5 mt-8 pt-6 border-t border-riga text-sm text-inchiostro-soft max-w-[48ch] leading-relaxed">
            <Upload size={15} strokeWidth={1.75} className="shrink-0 mt-1 text-ottone" aria-hidden="true" />
            <span>{t.home.heroImportNote}</span>
          </p>
        </div>

        <div className="foglio p-6 sm:p-7">
          {/* Un'etichetta sola. "Ultimi 6 mesi" stava accanto a una fila di
              mesi che li elenca per nome: diceva due volte la stessa cosa. */}
          <p className="tacca mb-2">{t.home.chartExample}</p>
          <Bilancia
            mesi={mesi}
            numberLocale={numberLocale}
            etichette={{
              entrate: t.home.entrate,
              uscite: t.home.uscite,
              netto: t.home.netto,
              scegliMese: t.home.bilanciaScegliMese,
              descrizione: t.home.bilanciaDescrizione,
            }}
          />
          <p className="text-xs text-inchiostro-muted leading-relaxed mt-5 pt-5 border-t border-riga">
            {t.home.bilanciaNota}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* ─── Funzionalità ─────────────────────────────────────────────────
            Non sei schede con l'ombra: un registro di voci, ciascuna con il suo
            numero di riga. È una lista di conti, e si legge come tale. */}
        <Sezione id="funzionalita" etichetta={t.home.featuresEyebrow}>
          <div>
            <h2 className="display text-3xl sm:text-[2.5rem] max-w-[18ch] mb-12">
              {t.home.featuresTitle}
            </h2>

            {/* La Panoramica è la voce capofila: è la schermata che si apre per
                prima, e qui apre l'elenco. */}
            <Reveal className="foglio p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[1.25fr_1fr] gap-8 items-center mb-2">
              <div>
                <p className="tacca text-ottone">{t.home.heroFeature.tag}</p>
                <h3 className="display text-2xl mt-2 mb-3">{t.home.heroFeature.title}</h3>
                <p className="text-sm text-inchiostro-soft leading-relaxed max-w-[46ch]">
                  {t.home.heroFeature.body}
                </p>
              </div>
              <div className="border border-riga rounded-sm bg-carta p-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm">{t.home.demoCategory}</span>
                  <span className="cifra text-xs text-inchiostro-muted">210 € / 250 €</span>
                </div>
                <div className="h-1.5 bg-riga overflow-hidden mb-5">
                  <div className="h-full bg-ottone" style={{ width: "84%" }} />
                </div>
                <div className="flex items-baseline justify-between pt-4 border-t border-riga">
                  <span className="tacca">{t.home.demoDueSoon}</span>
                  <span className="cifra text-sm">2</span>
                </div>
              </div>
            </Reveal>

            <ul className="border-t border-riga mt-10">
              {features.map((f, i) => (
                <li key={f.title} className="border-b border-riga">
                  <Reveal delay={i * 60}>
                    <div className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_1fr_1.1fr] gap-x-5 gap-y-2 py-7 items-baseline">
                      <span className="cifra text-xs text-inchiostro-muted" aria-hidden="true">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2.5">
                          <f.icon
                            size={17}
                            strokeWidth={1.75}
                            className="text-ottone shrink-0"
                            aria-hidden="true"
                          />
                          {f.title}
                        </h3>
                        <p className="tacca mt-1.5">{f.tag}</p>
                      </div>
                      <p className="text-sm text-inchiostro-soft leading-relaxed col-start-2 sm:col-start-3 max-w-[46ch]">
                        {f.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Sezione>

        {/* ─── Statistiche ─────────────────────────────────────────────────── */}
        <Sezione id="statistiche" etichetta={t.home.statsEyebrow}>
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="display text-3xl sm:text-[2.5rem] max-w-[20ch] mb-6">
                {t.home.statsTitle}
              </h2>
              <p className="text-inchiostro-soft leading-relaxed max-w-[54ch] mb-5">
                {t.home.statsBody}
              </p>
              <p className="text-inchiostro-muted text-sm leading-relaxed max-w-[54ch]">
                {t.home.statsNote}
              </p>
            </div>
            <StatsDemo labels={t.shared.statsDemo} numberLocale={numberLocale} />
          </Reveal>
        </Sezione>

        {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
        <Sezione id="faq" etichetta={t.home.faqEyebrow}>
          <Reveal>
            <h2 className="display text-3xl sm:text-[2.5rem] mb-10">{t.home.faqTitle}</h2>
            <FaqAccordion items={faqItems} />
          </Reveal>
        </Sezione>

        {/* Niente foto d'archivio con il velo scuro sopra: la lastra e una riga
            d'ottone bastano, e non fingono una scena che non c'è. */}
        <Chiusura />
      </main>

      <SiteFooter />
    </div>
  );
}
