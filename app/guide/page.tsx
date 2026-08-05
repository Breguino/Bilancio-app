import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { guides } from "@/lib/guides";

// Guide solo in italiano, come le singole pagine: vedi il commento in
// app/guide/conti-personali-e-lavoro/page.tsx.
const title = "Guide per chi lavora in proprio — Bilancino";
const description =
  "Guide pratiche su come tenere i conti quando lavori in proprio: separare personale e lavoro, accantonare per le tasse, capire quando lasciare il foglio di calcolo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide" },
  openGraph: { title, description, images: ["/og-image.jpg"], locale: "it_IT", type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-12 sm:pt-20 sm:pb-14 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Guide</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            Tenere i conti quando lavori in proprio
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            Guide pratiche sui problemi che incontra chi ha entrate irregolari e clienti da seguire.
            Si leggono anche senza usare Bilancino.
          </p>
        </header>

        <section className="pb-14 sm:pb-20 border-t border-border dark:border-neutral-800 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {guides.map((g, i) => (
              <Reveal key={g.href} delay={i * 80}>
                <Link
                  href={g.href}
                  className="group flex flex-col h-full border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  <h2 className="font-bold mb-2 [text-wrap:balance] group-hover:text-accent transition-colors">
                    {g.title}
                  </h2>
                  <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{g.body}</p>
                  <span className="text-sm font-semibold text-accent mt-4">Leggi →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
