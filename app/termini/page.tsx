import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Termini — Bilancino";
const description =
  "Cos'è Bilancino, cosa non è, e cosa succede se qualcosa va storto. Termini scritti in italiano semplice per un progetto indipendente, non da un ufficio legale.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/termini",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Termini</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Cosa puoi aspettarti da Bilancino.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Anche questa pagina è scritta in italiano semplice, non da un ufficio legale: se hai
            dubbi specifici, scrivimi.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Cos'è, e cos'è gratis
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Bilancino è un'applicazione di budget personale e CRM leggero, sviluppata e gestita
                da una persona sola. Non è una società: non ci sono un servizio clienti in senso
                tradizionale né uno SLA garantito su tempi di risposta o uptime.
              </p>
              <p>
                Oggi è gratuita e senza carta di credito. Essendo un progetto indipendente non posso
                garantirlo per sempre, ma qualunque cosa cambi potrai sempre esportare il tuo
                storico in CSV.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Cosa non è
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Non è un gestionale per la partita IVA: non emette fatture elettroniche e le
                ricevute PDF generate per un movimento sono un promemoria per te e il tuo cliente,
                non un documento con valore fiscale.
              </p>
              <p>
                Le statistiche e le previsioni (trend, media, intervallo di confidenza) sono stime
                calcolate sui dati che inserisci: non sono consulenza finanziaria o fiscale.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Di cosa sei responsabile tu
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Sei tu responsabile dell'accuratezza dei dati che inserisci e delle credenziali del
                tuo account. Prima di eliminare qualsiasi cosa ti viene sempre chiesta una conferma
                esplicita, ma una volta confermato non c'è un cestino: va reinserito a mano.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Se qualcosa va storto
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Bilancino è fornito così com'è, senza garanzie. Faccio il possibile perché
                funzioni correttamente — Row Level Security sui dati, conferma prima di ogni
                eliminazione, test automatici sui percorsi più delicati — ma nella misura massima
                consentita dalla legge non rispondo di eventuali perdite o danni derivanti dall'uso
                dell'app.
              </p>
              <p>
                Puoi smettere di usare il servizio quando vuoi. Posso sospendere un account in caso
                di abuso, ad esempio tentativi di accesso non autorizzato o uso illecito del
                servizio.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 border-t border-border dark:border-neutral-800">
          <p className="text-sm text-ink-muted dark:text-neutral-500 max-w-[62ch]">
            Se questi termini cambiano, aggiorno questa pagina — la cronologia reale delle
            modifiche al progetto è su{" "}
            <Link href="/novita" className="text-accent hover:underline">Novità</Link>. Per
            qualsiasi domanda, scrivimi a{" "}
            <a href="mailto:a2n0g004@gmail.com" className="text-accent hover:underline">
              a2n0g004@gmail.com
            </a>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
