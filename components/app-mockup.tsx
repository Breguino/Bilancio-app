import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real Panoramica screen (fake example data), so
 * marketing pages can show what the interface looks like without a
 * real authenticated screenshot.
 */
export function AppMockup() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  const rows = [
    { date: "23/07", description: t.shared.appMockup.demoSalary, category: "Ardian Bregu", amount: 1000, positive: true },
    { date: "23/07", description: t.shared.appMockup.demoUtility, category: t.shared.appMockup.demoCategory, amount: -30, positive: false },
  ];

  return (
    <div className="foglio overflow-hidden">
      {/* Niente più tre pallini da finestra macOS: non è un Mac, è un indirizzo
          web, e scriverlo e basta è più onesto e meno rumoroso. */}
      <div className="px-4 py-2.5 border-b border-riga bg-carta">
        <span className="tacca">bilancino.app/dashboard</span>
      </div>

      <div className="p-5">
        <p className="tacca mb-4">{t.shared.appMockup.exampleOverview}</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div>
            <p className="tacca text-[10px]">{t.shared.appMockup.entrate}</p>
            <p className="cifra text-verde text-sm mt-1">{eur.format(1000)}</p>
          </div>
          <div>
            <p className="tacca text-[10px]">{t.shared.appMockup.uscite}</p>
            <p className="cifra text-minio text-sm mt-1">{eur.format(30)}</p>
          </div>
          <div>
            <p className="tacca text-[10px]">{t.shared.appMockup.netto}</p>
            <p className="cifra text-sm mt-1">{eur.format(970)}</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-baseline justify-between text-xs mb-1.5">
            <span>{t.shared.appMockup.demoCategory}</span>
            <span className="cifra text-inchiostro-muted">30 € / 250 €</span>
          </div>
          <div className="h-1.5 bg-riga overflow-hidden">
            <div className="h-full bg-ottone" style={{ width: "12%" }} />
          </div>
        </div>

        <div className="border-t border-riga pt-4 flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.description} className="flex items-baseline justify-between gap-3 text-xs">
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="cifra text-inchiostro-muted shrink-0">{r.date}</span>
                <span className="truncate">{r.description}</span>
                <span className="text-[10px] text-verde bg-verde-soft rounded-sm px-1.5 py-0.5 shrink-0">
                  {r.category}
                </span>
              </div>
              <span className={`cifra shrink-0 ${r.positive ? "text-verde" : "text-minio"}`}>
                {r.positive ? "+" : "−"}
                {eur.format(Math.abs(r.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
