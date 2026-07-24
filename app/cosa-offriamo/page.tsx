import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Tags,
  BarChart3,
  RefreshCw,
  Target,
  ArrowLeftRight,
  CalendarDays,
  Users,
  StickyNote,
  Receipt,
  TrendingUp,
  Sigma,
  TriangleAlert,
  Calculator,
  Download,
} from "lucide-react";

const title = "Cosa offriamo — Bilancino";
const description =
  "Un tour completo delle funzionalità di Bilancino: movimenti e categorie, budget, ricorrenze automatiche, obiettivi di risparmio, CRM clienti, ricevute, export e statistiche.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cosa-offriamo",
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

const groups = [
  {
    tag: "Le tue finanze",
    title: "Movimenti, categorie e budget",
    items: [
      {
        icon: Tags,
        title: "Movimenti con categorie",
        body: "Registra entrate e uscite assegnando una categoria: spesa, casa, trasporti, lavoro, e così via. La Panoramica riassume subito entrate, uscite e risparmio netto del mese, con l'andamento degli ultimi 6 mesi a colpo d'occhio.",
      },
      {
        icon: BarChart3,
        title: "Budget per categoria",
        body: "Imposta un tetto di spesa mensile per ogni categoria. Bilancino mostra una barra che passa da verde ad ambra a rosso man mano che ti avvicini o superi la soglia, così te ne accorgi prima di sforare, non dopo.",
      },
      {
        icon: RefreshCw,
        title: "Movimenti ricorrenti",
        body: "Affitto, stipendio, abbonamenti: imposta descrizione, importo e frequenza (settimanale, mensile o annuale) una sola volta. Un job automatico gira ogni notte e genera i movimenti alla scadenza — anche se non apri l'app per giorni, recuperando le occorrenze mancate al tuo prossimo accesso.",
      },
      {
        icon: Target,
        title: "Obiettivi di risparmio",
        body: "Crea un obiettivo con un importo target — un fondo emergenza, un viaggio, un acquisto — e aggiungi un contributo quando vuoi, senza vincoli di ricorrenza. Vedi sempre quanto manca al traguardo.",
      },
      {
        icon: ArrowLeftRight,
        title: "Confronto mese su mese",
        body: "Metti a confronto due mesi qualsiasi per capire dove sono cambiate le tue abitudini di spesa, categoria per categoria.",
      },
      {
        icon: CalendarDays,
        title: "Riepilogo annuale",
        body: "Una vista d'insieme sull'intero anno: totali di entrate, uscite e risparmio, utile per farsi un'idea a fine anno senza dover sommare mese per mese a mano.",
      },
    ],
  },
  {
    tag: "I tuoi clienti",
    title: "Contatti, note e ricevute",
    items: [
      {
        icon: Users,
        title: "Contatti e CRM leggero",
        body: "Ogni contatto ha una sua scheda con le entrate collegate: vedi subito quanto ti ha pagato nel tempo, senza dover cercare tra i movimenti. Utile se, oltre ai conti personali, segui anche qualche cliente o consulenza.",
      },
      {
        icon: StickyNote,
        title: "Note e promemoria",
        body: "Aggiungi note libere a un contatto (accordi presi, dettagli da ricordare) e imposta promemoria per non perdere scadenze o follow-up.",
      },
      {
        icon: Receipt,
        title: "Ricevute PDF",
        body: "Genera una ricevuta PDF per un pagamento ricevuto da un cliente, pronta da scaricare o inviare, senza dover aprire un altro programma.",
      },
    ],
  },
  {
    tag: "Statistica e analisi",
    title: "Non solo numeri",
    items: [
      {
        icon: TrendingUp,
        title: "Trend e previsioni",
        body: "Una regressione lineare sui tuoi movimenti calcola l'andamento di spesa o risparmio nel tempo e proietta una previsione per i mesi successivi, così vedi la direzione prima ancora che diventi evidente dai numeri grezzi.",
      },
      {
        icon: Sigma,
        title: "Media, deviazione standard e intervallo di confidenza",
        body: "Bilancino calcola media e deviazione standard del tuo risparmio, con un intervallo di confidenza al 95%: non solo quanto risparmi in media, ma quanto è affidabile quella media.",
      },
      {
        icon: TriangleAlert,
        title: "Rilevamento spese anomale",
        body: "Uno z-score confronta ogni spesa con le tue abitudini storiche per quella categoria e segnala quelle statisticamente fuori norma — utile per accorgersi di una spesa insolita prima che diventi un'abitudine.",
      },
      {
        icon: Calculator,
        title: "Calcolatore interattivo",
        body: "Nella pagina Statistiche della home trovi un calcolatore che usa le stesse formule dell'app: cambia i numeri e guarda i risultati aggiornarsi all'istante, prima ancora di creare un account.",
      },
    ],
  },
  {
    tag: "Portare fuori i dati",
    title: "Sempre esportabili, mai bloccati",
    items: [
      {
        icon: Download,
        title: "Export CSV",
        body: "Dalla Panoramica scarichi in un clic l'intero storico dei movimenti in formato CSV, apribile in Excel o Fogli Google: i tuoi dati restano sempre portabili, non solo consultabili dentro l'app.",
      },
    ],
  },
];

export default function CosaOffriamoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Cosa offriamo</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Ogni funzionalità, spiegata per intero.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            La pagina principale mostra le funzionalità in breve. Qui trovi il tour completo:
            cosa fa davvero ogni parte di Bilancino, e perché è fatta così.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.title} className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
            <div className="max-w-[60ch] mb-8">
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{group.tag}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
                {group.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {group.items.map((item) => (
                <div
                  key={item.title}
                  className="border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="py-14 sm:py-20 flex flex-col items-center text-center gap-5 border-t border-border dark:border-neutral-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[24ch]">
            Vuoi sapere come funziona iscriversi e i costi?
          </h2>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/il-servizio"
              className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
            >
              Scopri il servizio
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
