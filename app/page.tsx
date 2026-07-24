import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { FaqAccordion } from "@/components/faq-accordion";

const eur0 = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function buildHeroChart() {
  const income = [2400, 2550, 2500, 2800, 3100, 3250];
  const expense = [1750, 1900, 1680, 2050, 2200, 1900];
  const net = income.map((v, i) => v - expense[i]);

  const w = 400;
  const h = 160;
  const padX = 6;
  const padY = 14;
  const months = income.length;
  const xAt = (i: number) => padX + (i / (months - 1)) * (w - padX * 2);
  const all = [...income, ...expense, ...net];
  const max = Math.max(...all);
  const min = Math.min(0, ...all);
  const yAt = (v: number) => padY + (h - padY * 2) - ((v - min) / (max - min || 1)) * (h - padY * 2);

  const toPath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");

  const length = (vals: number[]) => {
    let total = 0;
    for (let i = 1; i < vals.length; i++) {
      const dx = xAt(i) - xAt(i - 1);
      const dy = yAt(vals[i]) - yAt(vals[i - 1]);
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  return {
    w,
    h,
    series: [
      { d: toPath(income), len: length(income), className: "stroke-accent", delay: "0s" },
      { d: toPath(expense), len: length(expense), className: "stroke-rose-400 dark:stroke-rose-500", delay: "0.15s" },
      { d: toPath(net), len: length(net), className: "stroke-emerald-600 dark:stroke-emerald-400", delay: "0.3s" },
    ],
    lastIncome: income[income.length - 1],
    lastExpense: expense[expense.length - 1],
    lastNet: net[net.length - 1],
  };
}

const features = [
  {
    title: "Panoramica",
    tag: "Un colpo d'occhio ogni mese",
    body: "Entrate, uscite, risparmio netto e andamento degli ultimi 6 mesi — con budget a rischio e promemoria in scadenza già in vista appena apri l'app.",
    icon: "◐",
    wide: true,
  },
  {
    title: "Budget per categoria",
    tag: "Sai sempre quanto ti resta",
    body: "Imposta un limite per categoria: le barre passano da verde ad ambra a rosso via via che ti avvicini o superi la soglia.",
    icon: "▤",
    wide: true,
  },
  {
    title: "Movimenti ricorrenti",
    tag: "Le spese fisse si registrano da sole",
    body: "Affitto, stipendio, abbonamenti: imposta la frequenza e Bilancino crea il movimento in automatico alla scadenza.",
    icon: "↻",
  },
  {
    title: "Contatti e CRM",
    tag: "I tuoi clienti, con la loro storia",
    body: "Ogni contatto mostra le entrate collegate, con note e promemoria — utile se oltre ai conti personali segui anche dei clienti.",
    icon: "◎",
  },
  {
    title: "Obiettivi di risparmio",
    tag: "Un traguardo alla volta",
    body: "Crea un obiettivo con un importo target e aggiungi un contributo quando vuoi, senza vincoli.",
    icon: "◆",
  },
  {
    title: "Ricevute ed export",
    tag: "Tutto documentato",
    body: "Genera una ricevuta PDF per un pagamento cliente, o esporta l'intero storico in CSV in un clic.",
    icon: "▣",
  },
];

const faqItems = [
  {
    q: "I miei dati sono al sicuro?",
    a: "Sì. Ogni account ha un login reale con email e password, e il database applica Row Level Security: nessun utente può leggere o modificare i dati di un altro, nemmeno in caso di errori nel codice dell'app.",
  },
  {
    q: "Posso usarlo da più dispositivi?",
    a: "Sì: i dati sono legati al tuo account, non al browser che usi, quindi sono sincronizzati e disponibili ovunque fai login.",
  },
  {
    q: "È gratuito?",
    a: "Sì, al momento Bilancino è liberamente utilizzabile.",
  },
  {
    q: "Come funzionano i movimenti ricorrenti?",
    a: "Imposti descrizione, importo, frequenza (settimanale, mensile o annuale) e una data di inizio: Bilancino genera da solo il movimento ogni volta che scade, recuperando anche le occorrenze mancate se non apri l'app per un po'.",
  },
  {
    q: "Posso recuperare un movimento cancellato per errore?",
    a: "Prima di eliminare qualsiasi cosa ti viene sempre chiesta una conferma, ma una volta confermato non c'è un cestino: va reinserito a mano.",
  },
  {
    q: "Posso esportare i miei dati?",
    a: "Sì: dalla Panoramica puoi scaricare un CSV con tutto lo storico dei movimenti, apribile in Excel o Fogli Google.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Bilancino",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Budget personale e contesto clienti in un unico posto, con account reale e dati isolati per utente.",
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

export default function HomePage() {
  const chart = buildHeroChart();

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="sticky top-0 z-20 border-b border-transparent backdrop-blur bg-white/90 dark:bg-neutral-950/90">
        <div className="max-w-6xl mx-auto px-6 py-4 relative flex items-center justify-between gap-6">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Bilancino">
            <Logo size={30} />
          </Link>
          <div className="hidden sm:flex items-center gap-7 text-sm font-medium text-ink-secondary dark:text-neutral-400">
            <a href="#funzionalita" className="hover:text-ink dark:hover:text-neutral-100">
              Funzionalità
            </a>
            <a href="#perche" className="hover:text-ink dark:hover:text-neutral-100">
              Perché Bilancino
            </a>
            <a href="#faq" className="hover:text-ink dark:hover:text-neutral-100">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-semibold text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
            >
              Accedi
            </Link>
            <details className="sm:hidden">
              <summary
                aria-label="Menu"
                className="list-none cursor-pointer w-9 h-9 rounded-full border border-border dark:border-neutral-800 flex items-center justify-center [&::-webkit-details-marker]:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-6 top-full mt-2 w-56 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg p-2 flex flex-col text-sm font-medium text-ink-secondary dark:text-neutral-400">
                <a href="#funzionalita" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                  Funzionalità
                </a>
                <a href="#perche" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                  Perché Bilancino
                </a>
                <a href="#faq" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                  FAQ
                </a>
                <div className="h-px bg-border dark:bg-neutral-800 my-1" />
                <Link href="/login" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                  Accedi
                </Link>
              </div>
            </details>
            <Link
              href="/signup"
              className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 py-2 transition-colors whitespace-nowrap"
            >
              Crea un account
            </Link>
          </div>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-16 pb-20 sm:pt-20 sm:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide text-accent bg-accent-soft dark:bg-accent/20 rounded-full px-3 py-1.5 mb-6">
            Budget personale + CRM, con un vero account
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mb-5">
            Le tue finanze, finalmente <span className="text-accent">in ordine</span>.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed max-w-[46ch] mb-8">
            Le app di budget non sanno chi sono i tuoi clienti. I gestionali per freelance non
            sanno quanto hai risparmiato. Bilancino fa entrambe le cose, senza la complessità di
            un gestionale — con un vero account che protegge i tuoi dati.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/signup"
              className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
            >
              Crea un account gratis →
            </Link>
            <a
              href="#funzionalita"
              className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
            >
              Scopri come funziona
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5">
        <div className="relative rounded-2xl overflow-hidden border border-border dark:border-neutral-800 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none aspect-[16/10]">
          <Image
            src="/og-image.jpg"
            alt="Persona che controlla le proprie finanze da laptop"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              Andamento · esempio
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              Ultimi 6 mesi
            </span>
          </div>
          <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="w-full h-auto overflow-visible" aria-hidden="true">
            {chart.series.map((s) => (
              <path
                key={s.className}
                d={s.d}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`hero-chart-line ${s.className}`}
                style={{
                  strokeDasharray: s.len,
                  strokeDashoffset: s.len,
                  animationDelay: s.delay,
                }}
              />
            ))}
          </svg>
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                Entrate
              </p>
              <p className="num font-bold text-accent mt-0.5">{eur0.format(chart.lastIncome)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                Uscite
              </p>
              <p className="num font-bold text-rose-500 dark:text-rose-400 mt-0.5">{eur0.format(chart.lastExpense)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                Netto
              </p>
              <p className="num font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {eur0.format(chart.lastNet)}
              </p>
            </div>
          </div>
        </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section id="funzionalita" className="py-16 sm:py-20 scroll-mt-20">
          <div className="max-w-[60ch] mb-10">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Funzionalità</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Sei aree, ciascuna con uno scopo preciso
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-lg transition-all ${
                  f.wide ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center text-lg mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold mb-1.5">{f.title}</h3>
                <p className="text-xs font-semibold text-ink-muted dark:text-neutral-500 mb-2">{f.tag}</p>
                <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="perche" className="py-16 sm:py-20 scroll-mt-20">
          <div className="border border-border dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-accent">Perché Bilancino</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-6 [text-wrap:balance] max-w-[24ch]">
                  Un solo posto per i conti e per i clienti
                </h2>
                <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[62ch] mb-4">
                  Bilancino nasce per chi vuole tenere insieme le finanze personali e i rapporti con
                  i clienti, senza fogli di calcolo sparsi e senza rinunciare alla sicurezza di un
                  vero account.
                </p>
                <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[62ch] mb-4">
                  Non è un gestionale per la partita IVA: se ti servono fatture ricorrenti, progetti e
                  appuntamenti, esistono già strumenti pensati per quello. Se ti serve sapere quanto hai
                  risparmiato questo mese e quanto ti deve un cliente, senza altro carico intorno, è per te.
                </p>
                <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[62ch]">
                  Ogni account è isolato a livello di database: le policy di sicurezza (Row Level
                  Security di Postgres) impediscono che i tuoi dati siano mai visibili a un altro
                  utente, anche in caso di bug nel codice dell'app.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-border dark:border-neutral-800 aspect-[4/3]">
                <Image
                  src="/perche-photo.jpg"
                  alt="Persona che scrive appunti accanto al laptop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-border dark:border-neutral-800">
              <div>
                <div className="w-9 h-9 rounded-lg bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center text-base mb-2">
                  ◍
                </div>
                <h4 className="font-bold mb-1">Account reale</h4>
                <p className="text-sm text-ink-muted dark:text-neutral-500">
                  Email e password, dati sincronizzati e accessibili da qualunque dispositivo.
                </p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center text-base mb-2">
                  ▦
                </div>
                <h4 className="font-bold mb-1">Isolamento per riga</h4>
                <p className="text-sm text-ink-muted dark:text-neutral-500">
                  Row Level Security lato database: nessun dato è mai condiviso tra utenti diversi.
                </p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center text-base mb-2">
                  ◫
                </div>
                <h4 className="font-bold mb-1">Pensato per freelance</h4>
                <p className="text-sm text-ink-muted dark:text-neutral-500">
                  Budget personale e CRM clienti nello stesso posto, con ricevute pronte da inviare.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 sm:py-20 scroll-mt-20">
          <div className="max-w-[60ch] mb-8">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Domande frequenti
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="relative rounded-2xl overflow-hidden">
            <Image src="/cta-bg.jpg" alt="" fill className="object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-ink/75" />
            <div className="relative z-10 text-white px-8 py-14 sm:px-16 sm:py-16 flex flex-col items-center text-center gap-5">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                Pronto a mettere ordine nei tuoi conti?
              </h2>
              <p className="text-white/70 max-w-[46ch]">
                Crea un account in meno di un minuto — bastano un'email e una password.
              </p>
              <Link
                href="/signup"
                className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
              >
                Crea un account →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-center text-sm text-ink-muted dark:text-neutral-500">
        Bilancino — budget personale, non un gestionale. ·{" "}
        <Link href="/login" className="underline hover:text-accent">
          Accedi
        </Link>
      </footer>
    </div>
  );
}
