import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { getLocale } from "@/lib/i18n/get-locale";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";

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
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
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
