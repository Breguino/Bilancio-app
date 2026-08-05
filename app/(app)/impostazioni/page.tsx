import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/error-banner";
import { ConfirmButton } from "@/components/confirm-button";
import { deleteAccount } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ImpostazioniPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { t } = getDictionary();
  const supabase = createClient();
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

      <div className="border border-border dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <h2 className="font-bold mb-3">{t.impostazioni.accountSectionTitle}</h2>
        <p className="text-xs font-semibold text-ink-secondary dark:text-neutral-400 mb-1">
          {t.impostazioni.emailLabel}
        </p>
        <p className="text-sm">{user.email}</p>
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
