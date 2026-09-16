import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/error-banner";
import { ConfirmButton } from "@/components/confirm-button";
import { Toast } from "@/components/toast";
import { SubmitButton } from "@/components/submit-button";
import { deleteAccount, setCurrency } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { CURRENCIES, moneyFormatter } from "@/lib/currency";
import { getUserCurrency } from "@/lib/currency-server";

export default async function ImpostazioniPage(props: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { t, intlLocale } = await getDictionary();
  const valuta = await getUserCurrency();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="text-2xl font-extrabold tracking-tight">{t.impostazioni.title}</h1>

      <ErrorBanner message={searchParams.error} />
      {searchParams.success ? <Toast message={t.impostazioni.currencySaved} /> : null}

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-3">{t.impostazioni.accountSectionTitle}</h2>
        <p className="text-xs font-semibold text-ink-secondary dark:text-neutral-400 mb-1">
          {t.impostazioni.emailLabel}
        </p>
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-2">{t.impostazioni.currencySectionTitle}</h2>
        <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed mb-4">
          {t.impostazioni.currencyBody}
        </p>
        <form action={setCurrency} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="currency"
              className="text-xs font-semibold text-ink-secondary dark:text-neutral-400"
            >
              {t.impostazioni.currencyLabel}
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue={valuta}
              className="border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {/* Accanto al codice c'è un importo di esempio scritto in quella
                  valuta: "CHF" da solo non dice come verranno i numeri, e la
                  posizione del simbolo cambia da valuta a valuta. */}
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} · {moneyFormatter(intlLocale, c).format(1234.5)}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-5 py-2 transition-colors">
            {t.impostazioni.currencySave}
          </SubmitButton>
        </form>
      </div>

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-2">{t.impostazioni.exportSectionTitle}</h2>
        <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed mb-4">
          {t.impostazioni.exportBody}
        </p>
        <a
          href="/api/export"
          className="inline-flex text-xs font-semibold border border-border dark:border-neutral-700 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
        >
          {t.dashboard.exportCsv}
        </a>
      </div>

      <div className="border border-red-200 dark:border-red-900/60 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-2 text-red-600 dark:text-red-400">{t.impostazioni.dangerZoneTitle}</h2>
        <p className="text-sm text-ink-secondary dark:text-neutral-400 leading-relaxed mb-4">
          {t.impostazioni.deleteAccountBody}
        </p>
        <form action={deleteAccount}>
          <ConfirmButton
            confirmMessage={t.impostazioni.deleteConfirmMessage}
            confirmLabel={t.impostazioni.deleteConfirmLabel}
            cancelLabel={t.common.cancelAction}
            ariaLabel={t.impostazioni.deleteAriaLabel}
            className="text-xs font-semibold border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 rounded-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            {t.impostazioni.deleteAccountButton}
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
