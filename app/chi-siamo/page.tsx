import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Chi siamo — Bilancino";
const description =
  "Bilancino è un progetto indipendente nato per colmare il vuoto tra le app di budget personale e i gestionali per la partita IVA. Ecco perché esiste e per chi è pensato.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/chi-siamo",
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

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Chi siamo</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Un progetto indipendente, pensato per un problema preciso.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Bilancino non è una startup con un team, degli investitori o un ufficio marketing.
            È un'applicazione sviluppata in autonomia, con un obiettivo circoscritto: mettere
            insieme il budget personale e i contatti con cui hai un rapporto economico, senza
            costringerti a scegliere tra un'app troppo semplice e un gestionale troppo complesso.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                Il vuoto che Bilancino prova a colmare
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Le app di budget personale sono ottime per tracciare entrate e uscite, ma non
                sanno chi sono i tuoi clienti: se qualcuno ti paga per un lavoro, per loro è solo
                una voce "entrata", senza contesto, senza storico, senza promemoria.
              </p>
              <p>
                I gestionali per la partita IVA vanno nella direzione opposta: fatturazione
                elettronica, scadenze fiscali, preventivi, magazzino. Fanno bene il loro lavoro,
                ma sono pensati per chi ha bisogno di tutto questo — non per chi vuole solo capire
                quanto ha risparmiato questo mese e cosa deve ancora incassare da un cliente.
              </p>
              <p>
                Bilancino sta nel mezzo: budget personale con categorie e limiti di spesa, più un
                CRM leggero per i contatti — note, promemoria, entrate collegate, ricevute — senza
                fatture, senza partita IVA, senza la complessità che non ti serve.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                Per chi è pensato
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Per chi segue le proprie finanze personali ma ha anche qualche cliente o rapporto
                economico ricorrente da tenere d'occhio — un secondo lavoro, qualche consulenza,
                lavori saltuari — senza volersi aprire la partita IVA né gestire un vero e proprio
                lato aziendale.
              </p>
              <p>
                Per chi oggi usa un foglio di calcolo per i conti e un altro (o niente) per i
                clienti, e vorrebbe un solo posto, con un vero account e i dati al sicuro invece di
                un file che si può perdere o corrompere.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                Perché rimane piccolo di proposito
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Lo sviluppo da solo, senza un team né un piano di crescita a tutti i costi. Questo
                significa che Bilancino non cerca di diventare un gestionale completo: preferisco
                fare bene due cose — budget e contatti — piuttosto che fare male dieci.
              </p>
              <p>
                Se una funzione non aiuta a rispondere a "quanto ho risparmiato" o "cosa mi deve
                questo cliente", probabilmente non la troverai qui. È una scelta, non una
                mancanza.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 flex flex-col items-center text-center gap-5 border-t border-border dark:border-neutral-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
            Vuoi vedere come funziona nel dettaglio?
          </h2>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/cosa-offriamo"
              className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
            >
              Scopri cosa offriamo
            </Link>
            <Link
              href="/signup"
              className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
            >
              Crea un account gratis →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
