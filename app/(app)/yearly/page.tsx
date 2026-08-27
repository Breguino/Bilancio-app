import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export default async function YearlyPage() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const pct1 = (n: number) =>
    n.toLocaleString(locale === "it" ? "it-IT" : "en-IE", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

  const supabase = createClient();
  const { data: transactions } = await supabase.from("transactions").select("*").is("deleted_at", null);
  const rows = transactions || [];

  const income = rows.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = rows.filter((t) => t.amount < 0).reduce((s, t) => s - Number(t.amount), 0);
  const net = income - expense;
  const rate = income > 0 ? (net / income) * 100 : 0;

  // L'etichetta per i movimenti senza categoria: era scritta in italiano
  // dentro il codice, quindi la vedeva così anche chi usa l'app in inglese.
  const senzaCategoria = t.common.uncategorized;

  const byCategory = new Map<string, number>();
  rows
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const cat = t.category || senzaCategoria;
      byCategory.set(cat, (byCategory.get(cat) || 0) + -Number(t.amount));
    });
  const ranked = Array.from(byCategory.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
  const max = ranked[0]?.value || 1;

  // Mese per mese: prima la pagina dava quattro totali e una classifica di
  // categorie, ma non la forma dell'anno — quali mesi tirano e quali no.
  const perMese = new Map<string, { entrate: number; uscite: number }>();
  rows.forEach((t) => {
    const chiave = t.date.slice(0, 7);
    const voce = perMese.get(chiave) || { entrate: 0, uscite: 0 };
    if (t.amount > 0) voce.entrate += Number(t.amount);
    else voce.uscite += -Number(t.amount);
    perMese.set(chiave, voce);
  });
  const mesi = Array.from(perMese.keys()).sort();
  const massimoMese = Math.max(1, ...mesi.map((k) => Math.max(perMese.get(k)!.entrate, perMese.get(k)!.uscite)));
  const netti = mesi.map((k) => ({ chiave: k, valore: perMese.get(k)!.entrate - perMese.get(k)!.uscite }));
  const ordinati = netti.slice().sort((a, b) => b.valore - a.valore);
  const migliore = ordinati[0];
  const peggiore = ordinati[ordinati.length - 1];
  const mediaMensile = netti.length ? netti.reduce((s, m) => s + m.valore, 0) / netti.length : 0;
  const intlLocale = locale === "it" ? "it-IT" : "en-IE";
  const etichettaMese = (chiave: string) => {
    const [y, m] = chiave.split("-").map(Number);
    return new Intl.DateTimeFormat(intlLocale, { month: "short" }).format(new Date(y, m - 1, 1));
  };
  const etichettaMeseLunga = (chiave: string) => {
    const [y, m] = chiave.split("-").map(Number);
    const testo = new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
    return testo.charAt(0).toUpperCase() + testo.slice(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 mb-1">
          {t.yearly.allTimeEyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{t.yearly.title}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mt-1">
          {t.yearly.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.yearly.totalIncome}</p>
          <p className="text-xl font-bold num">{eur.format(income)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.yearly.totalExpense}</p>
          <p className="text-xl font-bold num">{eur.format(expense)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.yearly.netSavings}</p>
          <p className="text-xl font-bold num">{eur.format(net)}</p>
        </div>
        <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.yearly.savingsRate}</p>
          <p className="text-xl font-bold num">{pct1(rate)}</p>
        </div>
      </div>

      {mesi.length > 1 ? (
        <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="font-bold">{t.yearly.monthByMonthTitle}</h2>
            <div className="flex items-center gap-4 text-xs text-ink-secondary dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent" /> {t.home.entrate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-border dark:bg-neutral-700" /> {t.home.uscite}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-2.5 h-52">
            {mesi.map((k) => {
              const voce = perMese.get(k)!;
              const migliorMese = migliore && k === migliore.chiave;
              return (
                <div key={k} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1.5 h-full">
                  <div className="flex items-end justify-center gap-[3px] w-full max-w-[54px] flex-1">
                    <span
                      className="flex-1 max-w-[22px] rounded-t bg-accent"
                      style={{ height: `${(voce.entrate / massimoMese) * 100}%` }}
                      title={`${t.home.entrate}: ${eur.format(voce.entrate)}`}
                    />
                    <span
                      className="flex-1 max-w-[22px] rounded-t bg-border dark:bg-neutral-700"
                      style={{ height: `${(voce.uscite / massimoMese) * 100}%` }}
                      title={`${t.home.uscite}: ${eur.format(voce.uscite)}`}
                    />
                  </div>
                  <span
                    className={`text-[11px] truncate max-w-full ${
                      migliorMese ? "text-accent font-bold" : "text-ink-muted dark:text-neutral-500"
                    }`}
                  >
                    {etichettaMese(k)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] gap-6 items-start">
      <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
        <h2 className="font-bold mb-4">{t.yearly.spendByCategoryTitle}</h2>
        {ranked.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-neutral-500">{t.yearly.emptyState}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ranked.map((r) => {
              const pct = expense > 0 ? (r.value / expense) * 100 : 0;
              const width = (r.value / max) * 100;
              return (
                <div key={r.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{r.category}</span>
                    <span className="num">{eur.format(r.value)}</span>
                  </div>
                  <div className="h-2.5 rounded bg-surface-alt dark:bg-neutral-800 overflow-hidden">
                    <div className="bar-fill h-full rounded bg-accent" style={{ width: `${width}%` }} />
                  </div>
                  <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1">{pct1(pct)} {t.yearly.ofTotalSuffix}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {netti.length > 0 ? (
        <div className="border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5">
          <h2 className="font-bold mb-4">{t.yearly.extremesTitle}</h2>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ArrowUp size={15} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block">{t.yearly.bestMonth}</span>
                <span className="block text-xs text-ink-muted dark:text-neutral-500">{etichettaMeseLunga(migliore.chiave)}</span>
              </span>
              <span className="num font-semibold ml-auto shrink-0">{eur.format(migliore.valore)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center shrink-0">
                <ArrowDown size={15} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block">{t.yearly.worstMonth}</span>
                <span className="block text-xs text-ink-muted dark:text-neutral-500">{etichettaMeseLunga(peggiore.chiave)}</span>
              </span>
              <span className="num font-semibold ml-auto shrink-0">{eur.format(peggiore.valore)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-8 h-8 rounded-full bg-surface-alt text-ink-secondary dark:bg-neutral-800 dark:text-neutral-400 flex items-center justify-center shrink-0">
                <Minus size={15} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block">{t.yearly.averageMonth}</span>
                <span className="block text-xs text-ink-muted dark:text-neutral-500">{t.yearly.averageMonthSub}</span>
              </span>
              <span className="num font-semibold ml-auto shrink-0">{eur.format(mediaMensile)}</span>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
