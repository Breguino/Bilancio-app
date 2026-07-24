import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Il servizio — Bilancino";
const description =
  "Come funziona Bilancino dal primo accesso, quanto costa oggi, come sono protetti i tuoi dati (account reale e Row Level Security) e cosa puoi fare se un giorno vuoi andartene.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/il-servizio",
  },
  openGraph: {
    title,
    description,
    images: ["/og-image.jpg"],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

const steps = [
  {
    n: "01",
    title: "Crei un account",
    body: "Bastano un'email e una password. Nessuna carta di credito, nessun periodo di prova a tempo: appena confermi l'email sei dentro.",
  },
  {
    n: "02",
    title: "Aggiungi i tuoi dati man mano",
    body: "Non c'è un'importazione obbligatoria all'inizio: registri un movimento quando succede, aggiungi un contatto quando serve, imposti un budget o un obiettivo quando ha senso per te. Bilancino cresce insieme ai tuoi dati, non li richiede tutti subito.",
  },
  {
    n: "03",
    title: "Una settimana tipo",
    body: "Segni le spese man mano che le fai, controlli la Panoramica per vedere se sei dentro budget, e se hai incassato da un cliente registri l'entrata collegata al contatto e, se serve, generi la ricevuta. I movimenti ricorrenti (affitto, stipendio, abbonamenti) si aggiungono da soli, anche nei giorni in cui non apri l'app.",
  },
  {
    n: "04",
    title: "A fine mese",
    body: "Dai un'occhiata al confronto con il mese precedente e alle statistiche — trend, media e spese anomale — per capire se qualcosa è cambiato nelle tue abitudini.",
  },
];

export default function IlServizioPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Il servizio</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Come funziona, quanto costa, come sono protetti i tuoi dati.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Tutto quello che vorresti sapere prima di creare un account, in una pagina sola.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="max-w-[60ch] mb-10">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Come funziona</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Dal primo accesso alla routine settimanale
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((step) => (
              <div
                key={step.n}
                className="border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900"
              >
                <span className="num text-xs font-bold text-accent">{step.n}</span>
                <h3 className="font-bold mt-2 mb-1.5">{step.title}</h3>
                <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">Prezzo</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[18ch]">
                Gratuito, senza carta di credito
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Crei un account e usi Bilancino senza pagare nulla e senza inserire una carta:
                niente periodo di prova a tempo, niente upgrade nascosto dopo pochi giorni.
              </p>
              <p>
                È un progetto indipendente in sviluppo continuo, quindi non posso prometterti che
                resterà gratuito per sempre — ma qualunque cosa cambi, non troverai mai i tuoi dati
                in ostaggio: puoi esportare in qualsiasi momento l'intero storico dei movimenti in
                CSV, senza dover chiedere permesso a nessuno.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">Sicurezza e privacy</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                Un vero account, dati isolati per riga
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                L'accesso avviene con email e password reali, non con un semplice codice locale:
                i tuoi dati sono legati al tuo account e sincronizzati su ogni dispositivo da cui
                fai login.
              </p>
              <p>
                A livello di database, Bilancino applica Row Level Security di Postgres: ogni
                riga di dati è vincolata al proprio utente, e nessun altro account può leggerla o
                modificarla — anche in caso di un errore nel codice dell'applicazione, la
                protezione resta a livello di database, non solo nell'interfaccia.
              </p>
              <p>
                I dati di utenti diversi non vengono mai condivisi, aggregati o mostrati tra loro:
                ogni account vede solo ed esclusivamente i propri movimenti, contatti e obiettivi.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">I tuoi dati</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                Puoi sempre portarli via
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Dalla Panoramica puoi esportare in qualunque momento l'intero storico dei
                movimenti in formato CSV, apribile in Excel o Fogli Google. Non è un'opzione
                nascosta in fondo a un menu: è pensata per essere usata quando vuoi, senza dover
                chiedere niente.
              </p>
              <p>
                Prima di eliminare qualcosa — un movimento, un contatto, un obiettivo — ti viene
                sempre chiesta una conferma esplicita, per evitare cancellazioni per errore.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 flex flex-col items-center text-center gap-5 border-t border-border dark:border-neutral-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
            Pronto a mettere ordine nei tuoi conti?
          </h2>
          <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
            Crea un account in meno di un minuto — bastano un'email e una password.
          </p>
          <Link
            href="/signup"
            className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
          >
            Crea un account →
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
