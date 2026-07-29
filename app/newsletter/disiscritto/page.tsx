import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Disiscritto — Bilancino",
  robots: { index: false, follow: false },
};

export default function NewsletterUnsubscribedPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-20 pb-20 max-w-[52ch] text-center mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">Fatto, sei disiscritto</h1>
          <p className="text-ink-secondary dark:text-neutral-400 mb-8">
            Non riceverai più la newsletter di Bilancino. Se hai cambiato idea, puoi iscriverti di
            nuovo in qualsiasi momento dal fondo del sito.
          </p>
          <Link
            href="/"
            className="inline-flex bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
