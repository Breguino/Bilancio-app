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
  const locale = getLocale();
  const t = dictionaryFor(locale);

  // Le date del diario sono scritte in ISO nel dizionario e formattate qui.
  // Prima erano frasi battute a mano, diverse per lingua ("27 agosto 2026" e
  // "August 27, 2026"): ventisei stringhe da comporre a mano, che nessuno
  // poteva confrontare fra loro e che per una macchina non erano date. In ISO
  // le due lingue si controllano l'una con l'altra (c'è un test che lo fa) e
  // il <time> qui sotto le rende leggibili anche a un motore di ricerca.
  const dataEstesa = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const scrivi = (iso: string) => dataEstesa.format(new Date(`${iso}T12:00:00Z`));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main id="contenuto" className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.novita.eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            {t.novita.heroTitle}
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            {t.novita.heroBody}
          </p>
          {/* La data viene dalla prima voce del diario, non da un campo a parte.
              Prima erano due valori da tenere allineati a mano, e infatti non lo
              erano: la pagina dichiarava "ultimo aggiornamento 22 agosto" mentre
              sotto c'erano voci più recenti. Un dato solo non può divergere. */}
          <p className="text-ink-muted dark:text-neutral-500 text-sm mt-4">
            {t.novita.lastUpdatedPrefix}{" "}
            <time dateTime={t.novita.entries[0].date}>{scrivi(t.novita.entries[0].date)}</time>
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="flex flex-col gap-10">
            {t.novita.entries.map((entry, i) => (
              // L'id sta sull'<article> e non dentro Reveal: Reveal parte
              // trasparente e si mostra quando entra nello schermo, e un
              // bersaglio invisibile è un bersaglio che il browser fatica a
              // raggiungere. Così l'ancora punta sempre a un elemento vero.
              <article key={entry.date} id={entry.date} className="scroll-mt-24">
                <Reveal
                  delay={i * 80}
                  className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-4 sm:gap-8"
                >
                  {/* Ogni aggiornamento ha un indirizzo suo: /novita#2026-08-27.
                      Prima l'unico modo di indicarne uno era dire "scorri fino a
                      fine agosto". La data fa anche da titolo della voce, così
                      chi usa un lettore di schermo salta da un aggiornamento
                      all'altro invece di attraversarli tutti. */}
                  <h2 className="sm:pt-0.5">
                    <a
                      href={`#${entry.date}`}
                      className="num text-sm font-bold text-accent hover:underline underline-offset-4"
                    >
                      <time dateTime={entry.date}>{scrivi(entry.date)}</time>
                    </a>
                  </h2>
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
                </Reveal>
              </article>
            ))}
          </div>
        </section>

        {/* Quando non c'è niente in cantiere la sezione non si mostra affatto.
            Una pagina "A cosa sto pensando" con sotto un riquadro vuoto sembra
            rotta; con dentro cose già fatte è peggio, perché mente. */}
        {t.novita.ideas.length > 0 ? (
        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
          </Reveal>
        </section>
        ) : null}

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
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
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
