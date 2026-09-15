import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { ServiceWorker } from "@/components/service-worker";
import { getLocale } from "@/lib/i18n/get-locale";
import { gaMeasurementId } from "@/lib/analytics";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site-url";

// Il sito non sceglieva un carattere: si affidava allo stack di sistema, che
// rende diverso su ogni computer. Inter per il testo, Fraunces per i titoli.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

// Il colore della barra di sistema quando l'app è installata. Il manifesto ne
// dichiara uno solo; qui se ne danno due, uno per tema, così la barra segue la
// pagina invece di restare chiara sopra uno sfondo quasi nero.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b10" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { metaTitle: title, metaDescription: description } = dictionaryFor(locale).home;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    // iOS non ricava tutto dal manifesto: l'icona sulla schermata Home la
    // prende da qui, e senza "capable" l'app aggiunta si aprirebbe dentro
    // Safari con la barra degli indirizzi, cioè non come un'app.
    appleWebApp: {
      capable: true,
      title: "Bilancino",
      statusBarStyle: "default",
    },
    icons: {
      icon: "/icon.svg",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: true,
      follow: true,
    },
    // Codice di verifica di Google Search Console: se scegli il metodo "Tag
    // HTML" invece di quello DNS, Google ti dà solo il valore del content, non
    // il meta tag intero — è quello che va qui. Senza la variabile d'ambiente
    // impostata, Next.js non stampa il tag: nessun rischio di lasciarlo vuoto
    // in produzione per errore.
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      locale: locale === "it" ? "it_IT" : "en_US",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = dictionaryFor(locale);
  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        {/* I blocchi animati (`.reveal` in globals.css) partono a opacità zero e
            li accende JavaScript quando entrano nello schermo. Senza
            JavaScript non li accende nessuno: il testo resta nell'HTML — i
            motori di ricerca lo vedono — ma la persona davanti allo schermo
            vede l'apertura e poi una parete bianca. Le sei aree, le
            statistiche, le domande frequenti e l'invito finale: tutto
            invisibile, per sempre.

            Tre righe rimettono le cose a posto. `<noscript>` lo capiscono
            tutti i browser: `@media (scripting: none)` sarebbe più elegante ma
            Safari 16.4 non lo conosce, ed è fra quelli che l'app dichiara di
            supportare.

            Se un giorno questo blocco sembra inutile e viene tolto, il modo di
            accorgersene è aprire la home con JavaScript disattivato. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }`}</style>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <ServiceWorker />
        <AnalyticsConsent
          gaId={gaMeasurementId()}
          message={t.cookieConsent.message}
          accept={t.cookieConsent.accept}
          reject={t.cookieConsent.reject}
          privacyLinkText={t.cookieConsent.privacyLinkText}
          privacyHref="/privacy"
        />
      </body>
    </html>
  );
}
