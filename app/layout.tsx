import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";

// Il sito non sceglieva un carattere: si affidava allo stack di sistema, che
// rende diverso su ogni computer. Inter per il testo, Fraunces per i titoli.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

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
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
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
