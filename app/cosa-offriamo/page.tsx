import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppScreenshot } from "@/components/app-screenshot";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  Tags,
  BarChart3,
  RefreshCw,
  Target,
  ArrowLeftRight,
  CalendarDays,
  Users,
  StickyNote,
  Receipt,
  TrendingUp,
  Sigma,
  TriangleAlert,
  Calculator,
  Download,
  Upload,
} from "lucide-react";

export function generateMetadata(): Metadata {
  const t = dictionaryFor(getLocale());
  const { metaTitle: title, metaDescription: description } = t.cosaOffriamo;
  return {
    title,
    description,
    alternates: { canonical: "/cosa-offriamo" },
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      locale: getLocale() === "it" ? "it_IT" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}

const groupIcons = [
  [Tags, BarChart3, RefreshCw, Target, ArrowLeftRight, CalendarDays],
  [Users, StickyNote, Receipt, Upload],
  [TrendingUp, Sigma, TriangleAlert, Calculator],
  [Download, Upload],
];

export default function CosaOffriamoPage() {
  const t = dictionaryFor(getLocale());

  const groups = t.cosaOffriamo.groups.map((group, gi) => ({
    ...group,
    items: group.items.map((item, ii) => ({ ...item, icon: groupIcons[gi][ii] })),
  }));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-14 sm:pt-20 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.cosaOffriamo.eyebrow}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-6">
              {t.cosaOffriamo.heroTitle}
            </h1>
            <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed">
              {t.cosaOffriamo.heroBody}
            </p>
          </div>
          <AppScreenshot
            src="/schermata-panoramica.png"
            srcDark="/schermata-panoramica-dark.png"
            width={1600}
            height={820}
            alt={t.shared.screenshots.panoramicaAlt}
            caption={t.shared.screenshots.caption}
          />
        </header>

        {groups.map((group, gi) => {
          const mockup =
            gi === 1 ? (
              <AppScreenshot
                src="/schermata-cliente.png"
            srcDark="/schermata-cliente-dark.png"
                width={1600}
                height={700}
                alt={t.shared.screenshots.clienteAlt}
                caption={t.shared.screenshots.caption}
              />
            ) : gi === 2 ? (
              <AppScreenshot
                src="/schermata-statistiche.png"
            srcDark="/schermata-statistiche-dark.png"
                width={1600}
                height={820}
                alt={t.shared.screenshots.statisticheAlt}
                caption={t.shared.screenshots.caption}
              />
            ) : null;
          const cardGrid = (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {group.items.map((item, ii) => (
                <Reveal
                  key={item.title}
                  delay={ii * 80}
                  className="border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{item.body}</p>
                </Reveal>
              ))}
            </div>
          );

          return (
            <section key={group.title} className="py-12 sm:py-14 border-t border-border dark:border-neutral-800">
              <Reveal className="max-w-[62ch] mb-8">
                <span className="text-xs font-bold uppercase tracking-wide text-accent">{group.tag}</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
                  {group.title}
                </h2>
                {"intro" in group ? (
                  <p className="text-ink-muted dark:text-neutral-500 text-sm leading-relaxed mt-3">{group.intro}</p>
                ) : null}
              </Reveal>
              {mockup ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                  {cardGrid}
                  <Reveal className="lg:sticky lg:top-24">{mockup}</Reveal>
                </div>
              ) : (
                cardGrid
              )}
            </section>
          );
        })}

        <section className="py-14 sm:py-20 border-t border-border dark:border-neutral-800">
          <Reveal className="flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
              {t.cosaOffriamo.ctaTitle}
            </h2>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/il-servizio"
                className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
              >
                {t.cosaOffriamo.ctaSeeService}
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
