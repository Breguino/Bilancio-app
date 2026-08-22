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
const title = "Excel o un'app per il budget? Quando conviene passare — Bilancino";
const description =
  "Il foglio di calcolo funziona benissimo finché non smette di funzionare. I quattro segnali che è arrivato il momento di cambiare, e quando invece Excel resta la scelta giusta.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide/excel-o-app-per-il-budget" },
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
  headline: "Excel o un'app per il budget? Quando conviene passare",
  description,
  inLanguage: "it-IT",
  datePublished: "2026-08-05",
  dateModified: "2026-08-22",
  author: { "@type": "Person", name: "Angelo Bregu" },
  publisher: { "@type": "Organization", name: "Bilancino" },
};

export default function ExcelOAppPage() {
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
            Excel o un&apos;app per il budget? Quando conviene passare
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Il foglio di calcolo è lo strumento più sottovalutato che esista: gratuito, flessibile,
            tuo. Per molti è la scelta giusta e lo resta per anni. Il problema non è Excel in sé —
            è capire quando ha smesso di aiutarti.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Quando il foglio di calcolo è la scelta migliore
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Vale la pena dirlo prima, visto da dove arriva questa pagina: se il tuo foglio
                funziona, non c&apos;è nessun motivo di cambiarlo.
              </p>
              <p>
                Excel vince quando <strong>hai bisogno di calcoli tuoi</strong> che nessuna app
                prevede, quando <strong>i movimenti sono pochi</strong> e aggiornarli è questione di
                minuti al mese, e quando <strong>vuoi il controllo totale</strong> sul formato senza
                adattarti alle scelte di qualcun altro.
              </p>
              <p>
                È anche l&apos;unico strumento che non può chiudere, cambiare prezzo o essere
                venduto a un&apos;altra azienda. Per chi tiene molto a questo, è un argomento serio,
                non un dettaglio.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="max-w-[62ch] mb-8">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">I segnali</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              Quattro segnali che il foglio ti sta rallentando
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                n: "01",
                title: "Lo aggiorni a blocchi, non man mano",
                body: "Se ti ritrovi a ricostruire due settimane di spese guardando l'estratto conto, il foglio ha già smesso di darti una fotografia aggiornata. E ricostruire a posteriori è il momento in cui si sbaglia di più, perché di metà movimenti non ricordi il contesto.",
              },
              {
                n: "02",
                title: "Da telefono non lo apri",
                body: "Le spese si fanno fuori casa, il foglio si aggiorna al computer. Quel divario è la ragione principale per cui i fogli di calcolo vengono abbandonati: non per un difetto dello strumento, ma perché non è dove sei tu nel momento in cui serve.",
              },
              {
                n: "03",
                title: "Le cose che si ripetono le riscrivi ogni volta",
                body: "Affitto, abbonamenti, compensi fissi: se ogni mese ricopi le stesse righe, stai facendo a mano un lavoro che dovrebbe essere automatico. È anche il tipo di lavoro noioso che fa saltare l'abitudine.",
              },
              {
                n: "04",
                title: "Hai smesso di fidarti dei totali",
                body: "Una formula trascinata male, una riga inserita fuori dall'intervallo, una somma che non torna. Quando controlli il totale due volte perché non sei sicuro, il foglio non ti sta più facendo risparmiare tempo.",
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
                La domanda giusta da farsi prima di cambiare
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Non è &quot;quale app ha più funzioni&quot;, ma <strong>cosa mi impedisce oggi di
                tenere i conti aggiornati</strong>. Se la risposta è &quot;lo apro poco&quot;, serve
                qualcosa che stia nel telefono. Se è &quot;ci metto troppo&quot;, serve qualcosa che
                automatizzi le ripetizioni. Se è &quot;non capisco cosa mi dicono i numeri&quot;,
                serve qualcosa che li presenti già interpretati.
              </p>
              <p>
                E una verifica pratica prima di scegliere: <strong>i dati riesci a riprenderteli?</strong>{" "}
                Uno strumento che ti fa entrare i dati ma non uscire ti mette nella posizione di
                non poter più cambiare idea. Prima di spostare un anno di storico da qualche parte,
                controlla che esista un export in un formato leggibile altrove.
              </p>
              <p>
                Se poi decidi di provare, non serve migrare tutto. Un mese in parallelo — foglio e
                app insieme — basta per capire se lo strumento nuovo regge l&apos;uso reale, e non
                rischi niente.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              Se vuoi provare, il tuo foglio non va buttato
            </h2>
            <p className="text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
              Bilancino importa i movimenti da un CSV — quello che esporti da Excel o Fogli Google —
              e li riesporta quando vuoi, nello stesso formato. Le spese che si ripetono si
              registrano da sole, e i dati restano tuoi in un formato che apri anche altrove.
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
