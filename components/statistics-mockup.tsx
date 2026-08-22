import { TriangleAlert } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real Statistiche screen (fake example data), so
 * marketing pages can show what the analytics side of the interface looks
 * like without a real authenticated screenshot.
 */
export function StatisticsMockup() {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: true,
  });

  return (
    <div className="foglio overflow-hidden">
      <div className="px-4 py-2.5 border-b border-riga bg-carta">
        <span className="tacca">{t.shared.statisticsMockup.path}</span>
      </div>

      <div className="p-5">
        <p className="tacca mb-4">{t.shared.statisticsMockup.exampleLabel}</p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div>
            <p className="tacca text-[10px]">{t.shared.statisticsMockup.average}</p>
            <p className="cifra text-sm mt-1">{eur.format(410)}</p>
          </div>
          <div>
            <p className="tacca text-[10px]">{t.shared.statisticsMockup.stdDev}</p>
            <p className="cifra text-sm mt-1">{eur.format(85)}</p>
          </div>
          <div>
            <p className="tacca text-[10px]">{t.shared.statisticsMockup.ci95}</p>
            <p className="cifra text-sm mt-1">
              {eur.format(340)}–{eur.format(480)}
            </p>
          </div>
        </div>

        {/* L'avviso di spesa anomala usa il minio, non l'ambra da notifica di
            sistema: è il colore con cui questo sito segna le uscite. */}
        <div className="border-t border-riga pt-4">
          <div className="flex items-start gap-2.5 rounded-sm bg-minio-soft border border-minio/25 px-3 py-2.5">
            <TriangleAlert
              size={15}
              strokeWidth={1.75}
              className="text-minio shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-minio">
                {t.shared.statisticsMockup.anomalyTitle}
              </p>
              <p className="text-xs text-inchiostro-soft mt-1 leading-relaxed">
                {t.shared.statisticsMockup.anomalyDescription} · {eur.format(180)} ·{" "}
                {t.shared.statisticsMockup.anomalyDetail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
