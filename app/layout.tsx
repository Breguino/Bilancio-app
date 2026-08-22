import type { Metadata } from "next";
import { Fraunces, Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";

// I tre caratteri del sito pubblico. Fino a ieri il sito girava sullo stack di
// sistema: nessuna identità, e le cifre — che sono tutto il prodotto — erano
// rese dallo stesso carattere del testo corrente.
//
// Fraunces per i titoli: gli assi SOFT e WONK la tengono calda e un po' storta,
// da cosa tenuta a mano, invece della serif ad alto contrasto che finisce su
// qualsiasi landing. Archivo per il testo: grottesca utilitaria, ottima sugli
// accenti italiani. Plex Mono per ogni importo ed etichetta: le colonne di
// numeri si allineano come su un registro.
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-display",
});

const body = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export function generateMetadata(): Metadata {
  const locale = getLocale();
  const { metaTitle: title, metaDescription: description } = dictionaryFor(locale).home;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title,
    description,
    alternates: {
      canonical: "/",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const t = dictionaryFor(locale);
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <AnalyticsConsent
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
