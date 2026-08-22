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
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Guida</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Mettere da parte per le tasse senza impazzire
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Il problema di chi lavora in proprio non è calcolare le tasse — per quello c&apos;è il
            commercialista. È che i soldi per pagarle arrivano mesi prima della scadenza, e nel
            frattempo sono lì sul conto a sembrare tuoi.
          </p>
        </header>

        <section className="py-8 border-t border-border dark:border-neutral-800">
          <Reveal>
            <p className="text-sm text-ink-muted dark:text-neutral-500 leading-relaxed max-w-[62ch] border-l-2 border-border dark:border-neutral-700 pl-4">
              Una premessa onesta: qui non trovi né aliquote né percentuali da applicare. Quanto
              devi accantonare dipende dal tuo regime fiscale, dai contributi e dalla tua
              situazione, e chi te lo può dire con certezza è il tuo commercialista. Questa guida
              parla dell&apos;<strong>abitudine</strong>: come far sì che quei soldi ci siano quando
              servono, qualunque sia la cifra.
            </p>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Perché il saldo del conto ti inganna
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
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

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="max-w-[62ch] mb-8">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Il metodo</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
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
                className="border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900"
              >
                <span className="num text-xs font-bold text-accent">{s.n}</span>
                <h3 className="font-bold mt-2 mb-1.5">{s.title}</h3>
                <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                L&apos;errore più comune: accantonare quello che avanza
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
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

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              Un obiettivo di risparmio, per non perderlo di vista
            </h2>
            <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
              In Bilancino puoi creare un obiettivo &quot;accantonamento tasse&quot; e aggiungere un
              contributo ogni volta che incassi, così vedi sempre a che punto sei. Bilancino non
              calcola le tasse e non è un gestionale fiscale — quello resta lavoro del tuo
              commercialista.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/guide/conti-personali-e-lavoro"
                className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
              >
                Leggi anche: separare i conti
              </Link>
              <AuthGate
                loggedIn={
                  <Link
                    href="/goals"
                    className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
                  >
                    Vai ai tuoi obiettivi →
                  </Link>
                }
                loggedOut={
                  <Link
                    href="/signup"
                    className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
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
