import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Chiusura } from "@/components/chiusura";
import { Reveal } from "@/components/reveal";
import { Sezione } from "@/components/sezione";
import { AppMockup } from "@/components/app-mockup";
import { ContactsMockup } from "@/components/contacts-mockup";
import { StatisticsMockup } from "@/components/statistics-mockup";
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
  Upload,
  TrendingUp,
  Sigma,
  TriangleAlert,
  Calculator,
  Download,
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
    <div className="sito min-h-screen">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6">
        <header className="pt-16 pb-16 sm:pt-24 sm:pb-20 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,22rem)] gap-y-10 gap-x-16 items-center">
          <div>
            <p className="tacca">{t.cosaOffriamo.eyebrow}</p>
            <h1 className="display text-[2.5rem] sm:text-[3.5rem] max-w-[16ch] mt-5 mb-7">
              {t.cosaOffriamo.heroTitle}
            </h1>
            <p className="text-inchiostro-soft text-lg leading-relaxed max-w-[54ch]">
              {t.cosaOffriamo.heroBody}
            </p>
          </div>
          <AppMockup />
        </header>

        {/* Ogni gruppo è un conto del registro, e le sue voci sono le righe.
            Prima erano schede: dodici rettangoli con l'ombra, tutti uguali, in
            cui nessuna voce contava più di un'altra. */}
        {groups.map((group, gi) => {
          const mockup = gi === 1 ? <ContactsMockup /> : gi === 2 ? <StatisticsMockup /> : null;

          const voci = (
            <ul className="border-t border-riga">
              {group.items.map((item, ii) => (
                <li key={item.title} className="border-b border-riga">
                  <Reveal delay={ii * 50}>
                    <div className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_1fr_1.3fr] gap-x-5 gap-y-2 py-6 items-baseline">
                      <span className="cifra text-xs text-inchiostro-muted" aria-hidden="true">
                        {String(ii + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-semibold flex items-center gap-2.5">
                        <item.icon
                          size={16}
                          strokeWidth={1.75}
                          className="text-ottone shrink-0"
                          aria-hidden="true"
                        />
                        {item.title}
                      </h3>
                      <p className="text-sm text-inchiostro-soft leading-relaxed col-start-2 sm:col-start-3 max-w-[48ch]">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          );

          return (
            <Sezione key={group.title} etichetta={group.tag}>
              <Reveal className="mb-9">
                <h2 className="display text-2xl sm:text-3xl max-w-[24ch]">{group.title}</h2>
                {"intro" in group ? (
                  <p className="text-inchiostro-muted text-sm leading-relaxed mt-4 max-w-[60ch]">
                    {group.intro}
                  </p>
                ) : null}
              </Reveal>
              {mockup ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">
                  {voci}
                  <Reveal className="lg:sticky lg:top-24">{mockup}</Reveal>
                </div>
              ) : (
                voci
              )}
            </Sezione>
          );
        })}

        <Chiusura
          titolo={t.cosaOffriamo.ctaTitle}
          secondario={{ href: "/il-servizio", label: t.cosaOffriamo.ctaSeeService }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
