import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * Static mock of the real client-card screen (fake example data), so
 * marketing pages can show what the CRM side of the interface looks like
 * without a real authenticated screenshot.
 */
export function ContactsMockup() {
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
        <span className="tacca">{t.shared.contactsMockup.path}</span>
      </div>

      <div className="p-5">
        <p className="tacca mb-4">{t.shared.contactsMockup.exampleLabel}</p>

        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-semibold text-sm">{t.shared.contactsMockup.contactName}</p>
            <p className="text-xs text-inchiostro-muted mt-0.5">
              {t.shared.contactsMockup.contactRole}
            </p>
          </div>
          <div className="text-right">
            <p className="tacca text-[10px]">{t.shared.contactsMockup.totalRevenueLabel}</p>
            <p className="cifra text-verde text-sm mt-1">{eur.format(1240)}</p>
          </div>
        </div>

        <div className="border-t border-riga pt-4">
          <p className="tacca mb-3">{t.shared.contactsMockup.notesTitle}</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate">{t.shared.contactsMockup.note1}</span>
              <span className="cifra text-[10px] text-ottone bg-ottone-soft rounded-sm px-1.5 py-0.5 shrink-0">
                {t.shared.contactsMockup.note1Reminder}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-inchiostro-muted line-through">
                {t.shared.contactsMockup.note2}
              </span>
              <span className="cifra text-[10px] text-inchiostro-muted bg-carta rounded-sm px-1.5 py-0.5 shrink-0">
                {t.shared.contactsMockup.note2Done}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
