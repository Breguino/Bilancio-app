import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Privacy — Bilancino";
const description =
  "Che dati raccoglie Bilancino, dove sono ospitati e come puoi esportarli o chiederne la cancellazione. Scritto in italiano semplice, non da un ufficio legale.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Privacy</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Come tratto i tuoi dati.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Bilancino è un progetto indipendente sviluppato e gestito da una persona sola, non da
            un'azienda con un ufficio legale. Quello che segue è scritto in italiano semplice, non
            da un avvocato: se hai dubbi specifici, scrivimi.
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Che dati raccolgo
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Email e password per il tuo account, gestite da Supabase Auth: la password non è
                mai visibile in chiaro, nemmeno a me.
              </p>
              <p>
                I dati finanziari che inserisci tu: movimenti, categorie, budget, obiettivi di
                risparmio, contatti e note, movimenti ricorrenti. Nient'altro — non chiedo
                indirizzo, telefono, né dati di pagamento, perché non mi servono per far
                funzionare l'app.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Dove sono ospitati
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Il database (Supabase, Postgres) è ospitato in Europa, a Francoforte. L'applicazione
                gira su Vercel, che può elaborare le richieste anche da server negli Stati Uniti — è
                così che funziona un'app web moderna, e te lo dico invece di lasciartelo scoprire.
              </p>
              <p>
                Supabase e Vercel sono fornitori tecnici: trattano i tuoi dati solo per far
                funzionare l'app, non li usano per scopi propri.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Isolamento e sicurezza
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Ogni riga di dati nel database è vincolata al tuo account tramite Row Level Security
                di Postgres: nessun altro utente può leggerla o modificarla, anche in caso di bug
                nel codice dell'app — è una regola imposta dal database stesso, non solo
                dall'interfaccia.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                Cookie
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Solo il cookie strettamente necessario per mantenere la sessione di accesso, gestito
                da Supabase Auth. Nessun cookie di marketing o di profilazione.
              </p>
              <p>
                Per capire quante persone usano l'app uso Vercel Analytics, che non usa cookie e non
                traccia i singoli utenti: raccoglie solo dati aggregati e anonimi, come le pagine
                più visitate.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance] max-w-[20ch]">
                I tuoi dati restano tuoi
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p>
                Dalla Panoramica puoi esportare in qualsiasi momento l'intero storico dei movimenti
                in CSV, senza chiedere permesso a nessuno.
              </p>
              <p>
                Per correggere o cancellare i tuoi dati, incluso l'account: oggi non c'è ancora una
                funzione automatica nell'app per farlo da solo. Scrivimi a{" "}
                <a href="mailto:a2n0g004@gmail.com" className="text-accent font-medium">
                  a2n0g004@gmail.com
                </a>{" "}
                e me ne occupo a mano.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 border-t border-border dark:border-neutral-800">
          <p className="text-sm text-ink-muted dark:text-neutral-500 max-w-[62ch]">
            Se cambia qualcosa nel modo in cui tratto i dati, aggiorno questa pagina. Non c'è una
            newsletter né una notifica automatica: la cronologia reale delle modifiche al progetto
            è su <Link href="/novita" className="text-accent hover:underline">Novità</Link>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
