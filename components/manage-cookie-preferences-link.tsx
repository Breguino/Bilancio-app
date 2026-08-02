"use client";

import { resetCookieConsent } from "@/components/analytics-consent";

export function ManageCookiePreferencesLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={resetCookieConsent} className="hover:text-accent">
      {label}
    </button>
  );
}
