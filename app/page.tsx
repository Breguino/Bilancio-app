import Link from "next/link";
import Image from "next/image";
import { FaqAccordion } from "@/components/faq-accordion";
import { StatsDemo } from "@/components/stats-demo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { LineChart, BarChart3, RefreshCw, Users, Target, Receipt } from "lucide-react";

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

const heroFeature = {
  title: "Panoramica",
  tag: "Un colpo d'occhio ogni mese",
  body: "Entrate, uscite, risparmio netto e andamento degli ultimi 6 mesi — con budget a rischio e promemoria in scadenza già in vista appena apri l'app.",
  icon: LineChart,
};

const features = [
  {
    title: "Budget per categoria",
    tag: "Sai sempre quanto ti resta",
    body: "Imposta un limite per categoria: le barre passano da verde ad ambra a rosso via via che ti avvicini o superi la soglia.",
    icon: BarChart3,
  },
  {
    title: "Movimenti ricorrenti",
    tag: "Le spese fisse si registrano da sole",
    body: "Affitto, stipendio, abbonamenti: imposta la frequenza e Bilancino crea il movimento in automatico alla scadenza.",
    icon: RefreshCw,
  },
  {
    title: "Contatti e CRM",
    tag: "I tuoi clienti, con la loro storia",
    body: "Ogni contatto mostra le entrate collegate, con note e promemoria — utile se oltre ai conti personali segui anche dei clienti.",
    icon: Users,
  },
  {
    title: "Obiettivi di risparmio",
    tag: "Un traguardo alla volta",
    body: "Crea un obiettivo con un importo target e aggiungi un contributo quando vuoi, senza vincoli.",
    icon: Target,
  },
  {
    title: "Ricevute e dati portabili",
    tag: "Tutto documentato, mai bloccato",
    body: "Genera una ricevuta PDF per un pagamento cliente, esporta l'intero storico in CSV, o importa movimenti e contatti da un altro foglio in un clic.",
    icon: Receipt,
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
    a: "Sì, senza carta di credito: crei un account e lo usi liberamente. Essendo un progetto indipendente non posso garantirlo per sempre, ma potrai sempre esportare i tuoi dati in CSV.",
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
    q: "Posso esportare o importare i miei dati?",
    a: "Sì a entrambi: dalla Panoramica scarichi un CSV con tutto lo storico dei movimenti, apribile in Excel o Fogli Google. E se arrivi da un altro foglio o gestionale, puoi caricare un CSV con le stesse colonne per importare i tuoi movimenti esistenti in un colpo solo.",
  },
  {
    q: "C'è una newsletter?",
    a: "Sì, facoltativa: un'email al mese con le novità su Bilancino, niente spam. Ti iscrivi con un indirizzo email dal fondo di questa pagina, e ogni email ha un link di disiscrizione con un clic.",
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

export default async function HomePage() {
  const chart = buildHeroChart();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <header className="max-w-6xl mx-auto px-6 pt-16 pb-16 sm:pt-20 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-accent">
            Budget personale + CRM, con un vero account
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-5">
            Le tue finanze, finalmente <span className="text-accent">in ordine</span>.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed max-w-[46ch] mb-8">
            Le app di budget non sanno chi sono i tuoi clienti. I gestionali per freelance non
            sanno quanto hai risparmiato. Bilancino fa entrambe le cose, senza la complessità di
            un gestionale.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-6 py-3.5 transition-colors"
            >
              {user ? "Vai alla Dashboard →" : "Crea un account gratis →"}
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
        <section id="funzionalita" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <div className="max-w-[60ch] mb-10">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Funzionalità</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Sei aree, ciascuna con uno scopo preciso
            </h2>
          </div>
          <div className="rounded-2xl bg-accent-soft/60 dark:bg-accent/10 border border-accent/20 dark:border-accent/20 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-8 items-center mb-4">
            <div>
              <div className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center mb-4">
                <heroFeature.icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold mb-1.5">{heroFeature.title}</h3>
              <p className="text-xs font-semibold text-accent mb-2">{heroFeature.tag}</p>
              <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[46ch]">
                {heroFeature.body}
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border dark:border-neutral-800 p-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">Benzina</span>
                <span className="num text-ink-muted dark:text-neutral-500">210 € / 250 €</span>
              </div>
              <div className="h-2 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden mb-4">
                <div className="h-full rounded bg-amber-500" style={{ width: "84%" }} />
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-border dark:border-neutral-800">
                <span className="text-ink-muted dark:text-neutral-500">Promemoria in scadenza</span>
                <span className="num font-bold">2</span>
              </div>
            </div>
          </div>

          {/* 5 card su 6 colonne: le prime tre larghe 2, le ultime due larghe 3. Riempie
              entrambe le righe senza celle vuote, e ogni card è larga il doppio rispetto
              alle 5 colonne da 208px di prima, dove il testo risultava compresso. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-lg transition-all ${
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3"
                } ${i === features.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center mb-4">
                  <f.icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold mb-1.5">{f.title}</h3>
                <p className="text-xs font-semibold text-ink-muted dark:text-neutral-500 mb-2">{f.tag}</p>
                <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="statistiche" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">Statistiche</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-6 [text-wrap:balance] max-w-[22ch]">
                Sai già come andrà il mese prossimo?
              </h2>
              <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[56ch] mb-4">
                Bilancino ti dice se stai risparmiando più o meno del solito, con una previsione
                realistica per il mese che arriva e un avviso quando una spesa esce dai tuoi schemi
                abituali. Dietro le quinte c'è vera statistica (regressione lineare, deviazione
                standard, intervallo di confidenza al 95%) — ma a te arriva già spiegata in euro,
                non in formule.
              </p>
              <p className="text-ink-muted dark:text-neutral-500 text-sm leading-relaxed max-w-[56ch]">
                È una sezione a parte, non un passaggio obbligato: Bilancino funziona benissimo anche
                solo con movimenti e budget. Se invece ti incuriosisce, prova il calcolatore qui a
                fianco — è la stessa formula usata dentro l'app.
              </p>
            </div>
            <StatsDemo />
          </div>
        </section>

        <section id="faq" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <div className="max-w-[60ch] mb-8">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Domande frequenti
            </h2>
          </div>
          <FaqAccordion items={faqItems} />
        </section>

        <section className="pt-12 sm:pt-14 pb-20 sm:pb-28 border-t border-border dark:border-neutral-800">
          <div className="relative rounded-2xl overflow-hidden">
            <Image src="/cta-bg.jpg" alt="" fill className="object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-ink/75" />
            <div className="relative z-10 text-white px-8 py-14 sm:px-16 sm:py-16 flex flex-col items-center text-center gap-5">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                {user ? "Bentornato: riprendi da dove hai lasciato." : "Pronto a mettere ordine nei tuoi conti?"}
              </h2>
              <p className="text-white/70 max-w-[46ch]">
                {user
                  ? "I tuoi movimenti, budget e contatti ti aspettano in Panoramica."
                  : "Crea un account in meno di un minuto — bastano un'email e una password."}
              </p>
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
              >
                {user ? "Vai alla Dashboard →" : "Crea un account gratis →"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
