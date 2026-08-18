import Link from "next/link";
import Image from "next/image";
import { FaqAccordion } from "@/components/faq-accordion";
import { StatsDemo } from "@/components/stats-demo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LineChart, BarChart3, RefreshCw, Users, Target, Receipt, Upload } from "lucide-react";

function buildHeroChart() {
  const income = [2400, 2550, 2500, 2800, 3100, 3250];
  const expense = [1750, 1900, 1680, 2050, 2200, 1900];
  const net = income.map((v, i) => v - expense[i]);

  const w = 400;
  const h = 160;
  const padX = 6;
  const padY = 14;
  const months = income.length;
  const xAt = (i: number) => padX + (i / (months - 1)) * (w - padX * 2);
  const all = [...income, ...expense, ...net];
  const max = Math.max(...all);
  const min = Math.min(0, ...all);
  const yAt = (v: number) => padY + (h - padY * 2) - ((v - min) / (max - min || 1)) * (h - padY * 2);

  const toPath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");

  const length = (vals: number[]) => {
    let total = 0;
    for (let i = 1; i < vals.length; i++) {
      const dx = xAt(i) - xAt(i - 1);
      const dy = yAt(vals[i]) - yAt(vals[i - 1]);
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  return {
    w,
    h,
    series: [
      { d: toPath(income), len: length(income), className: "stroke-accent", delay: "0s" },
      { d: toPath(expense), len: length(expense), className: "stroke-rose-400 dark:stroke-rose-500", delay: "0.15s" },
      { d: toPath(net), len: length(net), className: "stroke-emerald-600 dark:stroke-emerald-400", delay: "0.3s" },
    ],
    lastIncome: income[income.length - 1],
    lastExpense: expense[expense.length - 1],
    lastNet: net[net.length - 1],
  };
}

const featureIcons = [BarChart3, RefreshCw, Users, Target, Receipt];

export default function HomePage() {
  const chart = buildHeroChart();
  const { locale, t } = getDictionary();
  const eur0 = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const heroFeature = { ...t.home.heroFeature, icon: LineChart };
  const features = t.home.features.map((f, i) => ({ ...f, icon: featureIcons[i] }));
  const faqItems = t.home.faqItems;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Bilancino",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: t.home.jsonLdDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <header className="max-w-6xl mx-auto px-6 pt-16 pb-16 sm:pt-20 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-accent">
            {t.home.heroEyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] [text-wrap:balance] mt-3 mb-5">
            {t.home.heroTitlePre} <span className="text-accent">{t.home.heroTitleAccent}</span>.
          </h1>
          <p className="text-ink-secondary dark:text-neutral-400 text-lg leading-relaxed max-w-[46ch] mb-8">
            {t.home.heroBody}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
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
            <a
              href="#funzionalita"
              className="border border-border dark:border-neutral-800 font-bold text-sm rounded-full px-6 py-3.5 hover:border-accent hover:text-accent transition-colors"
            >
              {t.home.ctaHowItWorks}
            </a>
          </div>

          {/* L'obiezione all'inserimento manuale si forma qui, davanti al
              bottone: la risposta va data qui, non in fondo a "cosa offriamo". */}
          <p className="flex items-start gap-2 mt-6 text-sm text-ink-secondary dark:text-neutral-400 max-w-[46ch]">
            <Upload size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-accent" aria-hidden="true" />
            <span>{t.home.heroImportNote}</span>
          </p>
        </div>

        <div className="flex flex-col gap-5">
        <div className="relative rounded-2xl overflow-hidden border border-border dark:border-neutral-800 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none aspect-[16/10]">
          <Image
            src="/og-image.jpg"
            alt={t.home.heroImageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.home.chartExample}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
              {t.home.chartLast6Months}
            </span>
          </div>
          <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="w-full h-auto overflow-visible" aria-hidden="true">
            {chart.series.map((s) => (
              <path
                key={s.className}
                d={s.d}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`hero-chart-line ${s.className}`}
                style={{
                  strokeDasharray: s.len,
                  strokeDashoffset: s.len,
                  animationDelay: s.delay,
                }}
              />
            ))}
          </svg>
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                {t.home.entrate}
              </p>
              <p className="num font-bold text-accent mt-0.5">{eur0.format(chart.lastIncome)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                {t.home.uscite}
              </p>
              <p className="num font-bold text-rose-500 dark:text-rose-400 mt-0.5">{eur0.format(chart.lastExpense)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500">
                {t.home.netto}
              </p>
              <p className="num font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {eur0.format(chart.lastNet)}
              </p>
            </div>
          </div>
        </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section id="funzionalita" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <div className="max-w-[60ch] mb-10">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.home.featuresEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
              {t.home.featuresTitle}
            </h2>
          </div>
          <Reveal className="rounded-2xl bg-accent-soft/60 dark:bg-accent/10 border border-accent/20 dark:border-accent/20 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-8 items-center mb-4">
            <div>
              <div className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center mb-4">
                <heroFeature.icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold mb-1.5">{heroFeature.title}</h3>
              <p className="text-xs font-semibold text-accent mb-2">{heroFeature.tag}</p>
              <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[46ch]">
                {heroFeature.body}
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border dark:border-neutral-800 p-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">{t.home.demoCategory}</span>
                <span className="num text-ink-muted dark:text-neutral-500">210 € / 250 €</span>
              </div>
              <div className="h-2 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden mb-4">
                <div className="h-full rounded bg-amber-500" style={{ width: "84%" }} />
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-border dark:border-neutral-800">
                <span className="text-ink-muted dark:text-neutral-500">{t.home.demoDueSoon}</span>
                <span className="num font-bold">2</span>
              </div>
            </div>
          </Reveal>

          {/* 5 card su 6 colonne: le prime tre larghe 2, le ultime due larghe 3. Riempie
              entrambe le righe senza celle vuote, e ogni card è larga il doppio rispetto
              alle 5 colonne da 208px di prima, dove il testo risultava compresso. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i * 80}
                className={`${i < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${
                  i === features.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="h-full border border-border dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-xl bg-accent-soft dark:bg-accent/20 text-accent flex items-center justify-center mb-4">
                    <f.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold mb-1.5">{f.title}</h3>
                  <p className="text-xs font-semibold text-ink-muted dark:text-neutral-500 mb-2">{f.tag}</p>
                  <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="statistiche" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.home.statsEyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-6 [text-wrap:balance] max-w-[22ch]">
                {t.home.statsTitle}
              </h2>
              <p className="text-ink-secondary dark:text-neutral-400 leading-relaxed max-w-[56ch] mb-4">
                {t.home.statsBody}
              </p>
              <p className="text-ink-muted dark:text-neutral-500 text-sm leading-relaxed max-w-[56ch]">
                {t.home.statsNote}
              </p>
            </div>
            <StatsDemo labels={t.shared.statsDemo} numberLocale={locale === "it" ? "it-IT" : "en-IE"} />
          </Reveal>
        </section>

        <section id="faq" className="py-12 sm:py-14 scroll-mt-20 border-t border-border dark:border-neutral-800">
          <Reveal>
            <div className="max-w-[60ch] mb-8">
              <span className="text-xs font-bold uppercase tracking-wide text-accent">{t.home.faqEyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 [text-wrap:balance]">
                {t.home.faqTitle}
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </Reveal>
        </section>

        <section className="pt-12 sm:pt-14 pb-20 sm:pb-28 border-t border-border dark:border-neutral-800">
          <Reveal className="relative rounded-2xl overflow-hidden">
            <Image src="/cta-bg.jpg" alt="" fill className="object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-ink/75" />
            <div className="relative z-10 text-white px-8 py-14 sm:px-16 sm:py-16 flex flex-col items-center text-center gap-5">
              <AuthGate
                loggedIn={
                  <>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                      {t.home.ctaTitleReturning}
                    </h2>
                    <p className="text-white/70 max-w-[46ch]">{t.home.ctaBodyReturning}</p>
                    <Link
                      href="/dashboard"
                      className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
                    >
                      {t.home.ctaDashboard}
                    </Link>
                  </>
                }
                loggedOut={
                  <>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance] max-w-[22ch]">
                      {t.home.ctaTitleNew}
                    </h2>
                    <p className="text-white/70 max-w-[46ch]">{t.home.ctaBodyNew}</p>
                    <Link
                      href="/signup"
                      className="bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-full px-7 py-3.5 transition-colors mt-2"
                    >
                      {t.home.ctaSignupFree}
                    </Link>
                  </>
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
