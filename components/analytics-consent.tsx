"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "cookie-consent";
type Consent = "accepted" | "rejected";

// Il banner riappare solo se non c'è ancora una scelta salvata, o se l'utente
// la revoca da "Gestisci preferenze cookie" nel footer (vedi resetCookieConsent).
export function resetCookieConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new Event("cookie-consent-changed"));
}

export function AnalyticsConsent({
  gaId,
  message,
  accept,
  reject,
  privacyLinkText,
  privacyHref,
}: {
  gaId?: string;
  message: string;
  accept: string;
  reject: string;
  privacyLinkText: string;
  privacyHref: string;
}) {
  const GA_ID = gaId;
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      setConsent(stored === "accepted" || stored === "rejected" ? stored : null);
    };
    read();
    setReady(true);
    window.addEventListener("cookie-consent-changed", read);
    return () => window.removeEventListener("cookie-consent-changed", read);
  }, []);

  function choose(value: Consent) {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {GA_ID && consent === "accepted" ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}

      {ready && GA_ID && consent === null ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur px-6 py-4 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
          <p className="text-sm text-ink-secondary dark:text-neutral-400 max-w-2xl">
            {message}{" "}
            <a href={privacyHref} className="text-accent underline hover:no-underline">
              {privacyLinkText}
            </a>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="border border-border dark:border-neutral-700 rounded-full px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              {reject}
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="bg-accent hover:bg-accent-hover text-white rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              {accept}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
