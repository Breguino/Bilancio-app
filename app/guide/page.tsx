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
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-12 sm:pt-20 sm:pb-14 max-w-[62ch]">
          <span className="tacca">Guide</span>
          <h1 className="display text-[2.5rem] sm:text-[3.5rem] mt-5 mb-7">
            Tenere i conti quando lavori in proprio
          </h1>
          <p className="text-inchiostro-soft text-lg leading-relaxed">
            Guide pratiche sui problemi che incontra chi ha entrate irregolari e clienti da seguire.
            Si leggono anche senza usare Bilancino.
          </p>
        </header>

        <section className="pb-14 sm:pb-20 border-t border-riga pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {guides.map((g, i) => (
              <Reveal key={g.href} delay={i * 80}>
                <Link
                  href={g.href}
                  className="group flex flex-col h-full foglio p-6 hover:border-verde transition-colors"
                >
                  <h2 className="font-semibold mb-2 [text-wrap:balance] group-hover:text-verde transition-colors">
                    {g.title}
                  </h2>
                  <p className="text-sm text-inchiostro-soft leading-relaxed">{g.body}</p>
                  <span className="tacca text-verde mt-5">Leggi →</span>
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
