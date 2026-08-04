import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";

const title = "Novità — Bilancino";
const description =
  "Cosa è cambiato in Bilancino, aggiornamento dopo aggiornamento, e a cosa sto pensando per il futuro. Nessuna promessa, solo quello che è successo davvero.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/novita",
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

const LAST_UPDATED = "29 luglio 2026";

const entries = [
  {
    date: "29 luglio 2026",
    items: [
      "Nuova newsletter mensile, facoltativa: iscriviti con la tua email dal fondo del sito, un'email al mese, niente spam, disiscrizione con un clic da ogni email.",
      "Importare un CSV ora è un solo passaggio: scegli il file e l'importazione parte subito, senza dover cercare un secondo pulsante \"Importa\".",
      "I nuovi account vedono un messaggio di benvenuto la prima volta che aprono la Panoramica, invece delle card vuote a 0,00 €.",
      "L'app gira più vicino al database (stessa regione europea di Supabase), quindi le pagine rispondono più in fretta.",
      "Sistemato il menu mobile del sito pubblico, e aggiornate le pagine Cosa offriamo e le FAQ per parlare anche dell'importazione CSV, non solo dell'esportazione.",
      "Ora si possono importare anche i contatti da CSV, non solo i movimenti: stesso file con Nome, Email, Telefono e Note, con i doppioni riconosciuti in automatico.",
    ],
  },
  {
    date: "25 luglio 2026",
    items: [
      "Importazione ed esportazione dei movimenti in CSV, compatibile con Excel e Fogli Google — utile per portare dati da un'altra app o da un foglio di calcolo, o semplicemente per farsi un backup.",
      "L'app ora riconosce se sei già loggato: niente più pulsanti \"Crea un account\" quando sei già dentro, né nell'header né nella home.",
      "Aggiunto un modo per tornare al sito pubblico dall'interno dell'app, e la possibilità di vedere la password mentre la digiti in fase di accesso.",
      "Sistemate diverse incongruenze nei numeri (virgola decimale italiana ovunque, non solo in alcune pagine).",
      "Icone vere al posto dei simboli testuali sulla home e su \"Cosa offriamo\", più una foto per \"Chi siamo\".",
    ],
  },
  {
    date: "24 luglio 2026",
    items: [
      "Aggiunte le pagine Chi siamo, Cosa offriamo e Il servizio, per rispondere alle domande più comuni prima di iscriversi.",
      "Nuova pagina Statistiche: trend con regressione lineare, intervallo di confidenza al 95% e rilevamento delle spese anomale per categoria.",
      "I movimenti ricorrenti (affitto, stipendio, abbonamenti) ora si generano da soli ogni notte, anche se non apri l'app per giorni.",
      "Rifatto il menu per mobile, sia sul sito pubblico che dentro l'app.",
      "Rafforzate sicurezza e prestazioni del database (policy di isolamento dati, indici).",
    ],
  },
];

const ideas = [
  "Un promemoria via email per le scadenze, oggi visibili solo dentro l'app.",
  "Valutare una versione installabile (PWA) per un uso più comodo da mobile.",
];

export default function NovitaPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Novità</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Cosa è cambiato, aggiornamento dopo aggiornamento.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Sviluppo Bilancino da solo, quindi qui trovi esattamente cosa ho fatto e quando —
            niente numeri di versione gonfiati, solo le cose che sono cambiate davvero.
          </p>
          <p className="text-ink-muted dark:text-neutral-500 text-sm mt-4">Ultimo aggiornamento: {LAST_UPDATED}</p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="flex flex-col gap-10">
            {entries.map((entry) => (
              <div key={entry.date} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-4 sm:gap-8">
                <p className="num text-sm font-bold text-accent sm:pt-0.5">{entry.date}</p>
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
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">A cosa sto pensando</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-4 [text-wrap:balance] max-w-[20ch]">
                Idee, non promesse
              </h2>
              <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed">
                Come per il resto di Bilancino, preferisco non prometterti date o funzioni prima di
                averle davvero costruite. Questa è solo la lista di cose a cui sto pensando in questo
                momento — potrebbero cambiare, essere ridimensionate o non arrivare mai.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {ideas.map((idea) => (
                <li
                  key={idea}
                  className="border border-border dark:border-neutral-800 rounded-xl p-4 text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed"
                >
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 sm:py-20 flex flex-col items-center text-center gap-5 border-t border-border dark:border-neutral-800">
          <AuthGate
            loggedIn={
              <>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                  Bentornato: riprendi da dove hai lasciato.
                </h2>
                <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
                  I tuoi movimenti, budget e contatti ti aspettano in Panoramica.
                </p>
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
                >
                  Vai alla Dashboard →
                </Link>
              </>
            }
            loggedOut={
              <>
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
                  Crea un account gratis →
                </Link>
              </>
            }
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
