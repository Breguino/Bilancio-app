import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.chiSiamo;
  return {
    title,
    description,
    alternates: { canonical: "/chi-siamo" },
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      locale: getLocale() === "it" ? "it_IT" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function ChiSiamoPage() {
  const t = dictionaryFor(getLocale());

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Person",
              name: "Angelo Bregu",
              email: "a2n0g004@gmail.com",
              jobTitle: "Sviluppatore",
              worksFor: { "@type": "Organization", name: "Bilancino" },
            },
          }),
        }}
      />
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 max-w-[62ch]">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.chiSiamo.eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
            {t.chiSiamo.heroTitle}
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
            {t.chiSiamo.heroBody}
          </p>
        </header>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.chiSiamo.gapTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              {t.chiSiamo.gapParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.chiSiamo.forWhomTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              {t.chiSiamo.forWhomParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.chiSiamo.smallByDesignTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              {t.chiSiamo.smallByDesignParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* La pagina diceva "lo sviluppo da solo" senza dire chi. Il nome
            compariva solo nella privacy, perche' lo impone il GDPR. */}
        <section className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance] max-w-[20ch]">
                {t.chiSiamo.signatureTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-3 text-ink-secondary dark:text-neutral-400 leading-relaxed">
              <p className="text-ink dark:text-neutral-100 text-lg font-bold">{t.chiSiamo.signatureName}</p>
              <p>{t.chiSiamo.signatureRole}</p>
              <p>{t.chiSiamo.signatureBody}</p>
              <a
                href="mailto:a2n0g004@gmail.com"
                className="text-accent font-semibold hover:underline underline-offset-4 w-fit"
              >
                {t.chiSiamo.signatureContact} →
              </a>
            </div>
          </Reveal>
        </section>

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              {t.chiSiamo.ctaTitle}
            </h2>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/cosa-offriamo"
                className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
              >
                {t.chiSiamo.ctaSeeOffer}
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
