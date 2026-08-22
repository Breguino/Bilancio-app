import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

// Guida solo in italiano, come le altre: vedi il commento in
// app/guide/conti-personali-e-lavoro/page.tsx.
const title = "Mettere da parte per le tasse senza impazzire — Bilancino";
const description =
  "Come trasformare l'accantonamento per le tasse in un'abitudine automatica invece di una sorpresa annuale, senza fogli di calcolo complicati.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide/mettere-da-parte-per-le-tasse" },
  openGraph: {
    title,
    description,
    images: ["/og-image.jpg"],
    locale: "it_IT",
    type: "article",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Mettere da parte per le tasse senza impazzire",
  description,
  inLanguage: "it-IT",
  datePublished: "2026-08-05",
  author: { "@type": "Organization", name: "Bilancino" },
  publisher: { "@type": "Organization", name: "Bilancino" },
};

export default function TassePage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="sito min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-10 sm:pt-20 sm:pb-12 max-w-[62ch]">
          <span className="tacca">Guida</span>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] mt-5 mb-7">
            Mettere da parte per le tasse senza impazzire
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed">
            Il problema di chi lavora in proprio non è calcolare le tasse — per quello c&apos;è il
            commercialista. È che i soldi per pagarle arrivano mesi prima della scadenza, e nel
            frattempo sono lì sul conto a sembrare tuoi.
          </p>
        </header>

        <section className="py-8 border-t border-riga">
          <Reveal>
            <p className="text-sm text-inchiostro-muted leading-relaxed max-w-[62ch] border-l-2 border-riga pl-4">
              Una premessa onesta: qui non trovi né aliquote né percentuali da applicare. Quanto
              devi accantonare dipende dal tuo regime fiscale, dai contributi e dalla tua
              situazione, e chi te lo può dire con certezza è il tuo commercialista. Questa guida
              parla dell&apos;<strong>abitudine</strong>: come far sì che quei soldi ci siano quando
              servono, qualunque sia la cifra.
            </p>
          </Reveal>
        </section>

        <section className="py-10 sm:py-12 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                Perché il saldo del conto ti inganna
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              <p>
                Un dipendente vede lo stipendio già al netto: quello che arriva sul conto è
                davvero suo. Chi lavora in proprio incassa al lordo, e una parte di quei soldi è
                già impegnata — semplicemente non è ancora stata chiesta indietro.
              </p>
              <p>
                Il risultato è un errore di valutazione che si ripete ogni mese: guardi il saldo,
                lo leggi come disponibilità, e prendi decisioni su un numero che è più grande del
                vero. Poi arriva la scadenza e la cifra sembra enorme — non perché sia cambiata
                qualcosa, ma perché fino a quel momento non l&apos;avevi mai sottratta.
              </p>
              <p>
                Non è un problema di quanto guadagni. Chi fattura bene e non accantona si trova
                nella stessa difficoltà di chi fattura poco: la scadenza arriva comunque, e i
                soldi nel frattempo sono stati usati per altro.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-10 sm:py-12 border-t border-riga">
          <Reveal className="max-w-[60ch] mb-8">
            <span className="tacca">Il metodo</span>
            <h2 className="display text-2xl sm:text-3xl mt-4">
              Accantonare a ogni incasso, non a fine anno
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                n: "01",
                title: "Chiedi la percentuale una volta sola",
                body: "Al commercialista, all'inizio dell'anno: \"di ogni euro che incasso, quanto dovrei mettere via?\". È una domanda da cinque minuti che ti dà un numero da usare per dodici mesi, invece di rifare i conti ogni volta.",
              },
              {
                n: "02",
                title: "Sposta i soldi quando incassi",
                body: "Nel momento in cui un cliente paga, non dopo. Se aspetti la fine del mese, quei soldi hanno già cambiato forma. È la stessa logica del risparmio automatico: funziona perché toglie la decisione dal momento in cui è più difficile prenderla.",
              },
              {
                n: "03",
                title: "Tienili dove non li vedi come disponibili",
                body: "Un conto deposito, un secondo conto, o anche solo un obiettivo di risparmio segnato da qualche parte. Non serve un prodotto finanziario: serve che quel numero non compaia quando ti chiedi se puoi permetterti qualcosa.",
              },
              {
                n: "04",
                title: "Controlla una volta al trimestre",
                body: "Non ogni giorno. Un controllo ogni tre mesi basta ad accorgersi se stai accantonando troppo poco, con ancora il tempo per correggere prima della scadenza.",
              },
            ].map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 80}
                className="foglio p-6"
              >
                <span className="cifra text-xs text-ottone">{s.n}</span>
                <h3 className="font-semibold mt-2 mb-1.5">{s.title}</h3>
                <p className="text-sm text-inchiostro-soft leading-relaxed">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-12 border-t border-riga">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">
                L&apos;errore più comune: accantonare quello che avanza
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
              <p>
                &quot;A fine mese metto via quello che resta&quot; è la strategia che fallisce più
                spesso, per un motivo semplice: quello che resta dipende da come è andato il mese,
                mentre la tassa dipende da quanto hai incassato. Sono due numeri scollegati, e nei
                mesi difficili il primo è zero proprio quando il secondo è alto.
              </p>
              <p>
                L&apos;ordine giusto è il contrario: prima togli la quota che non è tua, poi vivi
                con quello che resta. È meno comodo nell&apos;immediato, ma sposta la difficoltà in
                un momento in cui è gestibile invece che in uno in cui non lo è.
              </p>
              <p>
                Il secondo errore è considerare l&apos;accantonamento un risparmio. Non lo è: è una
                spesa già avvenuta, che semplicemente pagherai dopo. Trattarlo come un
                &quot;tesoretto&quot; è il modo più veloce per ritrovarsi a intaccarlo.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-20 border-t border-riga">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="display text-3xl sm:text-[2.5rem] max-w-[24ch]">
              Un obiettivo di risparmio, per non perderlo di vista
            </h2>
            <p className="text-inchiostro-soft max-w-[54ch]">
              In Bilancino puoi creare un obiettivo &quot;accantonamento tasse&quot; e aggiungere un
              contributo ogni volta che incassi, così vedi sempre a che punto sei. Bilancino non
              calcola le tasse e non è un gestionale fiscale — quello resta lavoro del tuo
              commercialista.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/guide/conti-personali-e-lavoro"
                className="bottone-quieto"
              >
                Leggi anche: separare i conti
              </Link>
              <AuthGate
                loggedIn={
                  <Link
                    href="/goals"
                    className="bottone"
                  >
                    Vai ai tuoi obiettivi →
                  </Link>
                }
                loggedOut={
                  <Link
                    href="/signup"
                    className="bottone"
                  >
                    {t.home.ctaSignupFree}
                  </Link>
                }
              />
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
