import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

// Le guide sono scritte solo in italiano: servono a farsi trovare su ricerche
// italiane, e tradurle non avrebbe senso finché il pubblico di riferimento è
// quello. Per questo il testo sta qui e non nei dizionari i18n — l'intestazione
// e il footer restano invece tradotti come nel resto del sito.
const title = "Separare conti personali e di lavoro da freelance — Bilancino";
const description =
  "Perché mescolare spese personali e di lavoro rende impossibile capire quanto guadagni davvero, e tre modi concreti per tenerli separati senza aprire una seconda banca.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide/conti-personali-e-lavoro" },
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
  headline: "Separare conti personali e di lavoro quando sei freelance",
  description,
  inLanguage: "it-IT",
  datePublished: "2026-08-05",
  dateModified: "2026-08-22",
  author: { "@type": "Person", name: "Angelo Bregu" },
  publisher: { "@type": "Organization", name: "Bilancino" },
};

export default function ContiPersonaliELavoroPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Guida</span>
          <p className="text-sm text-ink-muted dark:text-neutral-500 mt-3">
            di <span className="font-semibold text-ink-secondary dark:text-neutral-400">Angelo Bregu</span> · <time dateTime="2026-08-05">5 agosto 2026</time>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-4 mb-6">
            Separare conti personali e di lavoro quando sei freelance
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Se incassi da clienti sullo stesso conto con cui fai la spesa, prima o poi arrivi a
            fine mese senza sapere se è stato un buon mese. Non è un problema di disciplina: è che
            i numeri, mescolati, non dicono niente.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Il problema non è l&apos;ordine, è la domanda a cui non sai rispondere
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Chi lavora in proprio ha due contabilità che si sovrappongono: quella personale
                (affitto, spesa, abbonamenti) e quella professionale (incassi dai clienti, spese
                deducibili, tasse da accantonare). Se vivono nello stesso posto, tre domande
                restano senza risposta.
              </p>
              <p>
                <strong>Quanto ho guadagnato davvero questo mese?</strong> Non è il saldo del conto:
                dentro c&apos;è anche quello che devi ancora allo Stato, e fuori manca quello che un
                cliente non ti ha ancora pagato.
              </p>
              <p>
                <strong>Questo cliente mi conviene?</strong> Se gli incassi non sono collegati a chi
                li ha generati, non lo sai. Sospetti che quel cliente paghi poco e chieda tanto, ma
                non hai un numero da guardare.
              </p>
              <p>
                <strong>Posso permettermi questa spesa?</strong> Domanda diversa se è personale o se
                è un investimento sul lavoro che si ripaga in due mesi.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="max-w-[62ch] mb-8">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Le tre strade</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Separare non significa per forza aprire un altro conto
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "Due conti bancari veri",
                body: "La separazione più netta: uno per il lavoro, uno personale, e un giroconto mensile che è il tuo \"stipendio\". Funziona bene, ma costa (spesso un canone) e richiede disciplina nel non sconfinare. Ha senso se fatturi con continuità.",
              },
              {
                n: "02",
                title: "Un conto solo, due etichette",
                body: "Tieni un conto, ma ogni movimento viene marcato come personale o di lavoro nel momento in cui lo registri. Zero costi, zero burocrazia. Richiede che l'etichettatura diventi un'abitudine di dieci secondi, non un lavoro di fine mese.",
              },
              {
                n: "03",
                title: "Separazione solo contabile",
                body: "I soldi stanno insieme, ma esiste un posto dove leggi separatamente le due contabilità: quanto è entrato dai clienti, quanto è uscito per spese personali, quanto resta davvero. È il compromesso più comune tra chi comincia.",
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
                Il pezzo che quasi tutti si dimenticano: chi ti ha pagato
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Le app di budget ti fanno etichettare le spese per categoria. Ma su un&apos;entrata
                mettono &quot;stipendio&quot; o &quot;lavoro&quot; e finisce lì. Per un dipendente va
                benissimo: la fonte è sempre la stessa. Per un freelance è il dato più importante che
                si perde.
              </p>
              <p>
                Collegare ogni incasso al cliente che l&apos;ha generato cambia il tipo di domande a
                cui puoi rispondere: quanto vale davvero quel cliente sull&apos;anno, chi paga in
                ritardo con costanza, su chi conviene puntare quando devi scegliere a chi dire di
                no.
              </p>
              <p>
                È il motivo per cui in Bilancino le entrate si possono collegare a un contatto, e per
                ogni cliente resta una scheda con lo storico e le note. Non è un CRM aziendale — è
                giusto il minimo per non perdere il legame tra i soldi e chi li ha portati.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Da dove partire, concretamente
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                <strong>Inizia da un mese solo.</strong> Non recuperare l&apos;anno passato: serve solo
                a farti mollare dopo tre giorni. Registra i movimenti del mese corrente man mano che
                succedono.
              </p>
              <p>
                <strong>Etichetta al momento, non a fine mese.</strong> Dieci secondi quando la spesa
                è fresca valgono più di un&apos;ora a ricostruire a fine mese, quando di metà
                movimenti non ricordi più il contesto.
              </p>
              <p>
                <strong>Metti in automatico quello che si ripete.</strong> Affitto, abbonamenti,
                compensi ricorrenti: se si ripetono uguali, non ha senso registrarli a mano ogni
                volta. Quello che resta da inserire a mano diventa poco, e l&apos;abitudine regge.
              </p>
              <p>
                <strong>Guarda i numeri una volta al mese, non ogni giorno.</strong> L&apos;obiettivo
                non è controllare: è accorgersi per tempo se qualcosa sta cambiando.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              Bilancino fa esattamente questo
            </h2>
            <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
              Budget personale e clienti nello stesso posto, movimenti ricorrenti in automatico,
              gratis e senza carta di credito. I dati li inserisci tu — nessun collegamento al conto
              bancario — e puoi esportarli in CSV quando vuoi.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/cosa-offriamo"
                className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
              >
                Guarda cosa fa
              </Link>
              <AuthGate
                loggedIn={
                  <Link
                    href="/dashboard"
                    className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
                  >
                    {t.home.ctaDashboard}
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
