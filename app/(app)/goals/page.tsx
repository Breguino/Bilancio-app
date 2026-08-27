import { createClient } from "@/lib/supabase/server";
import { ConfirmButton } from "@/components/confirm-button";
import { ErrorBanner } from "@/components/error-banner";
import { SubmitButton } from "@/components/submit-button";
import { Toast } from "@/components/toast";
import { PageHeader } from "@/components/page-header";
import { X } from "lucide-react";
import { addGoal, contribute, deleteGoal } from "./actions";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// Raggio e circonferenza dell'anello: servono a tradurre la percentuale in un
// tratteggio, che e' come si disegna un arco in SVG.
const RAGGIO = 30;
const GIRO = 2 * Math.PI * RAGGIO;

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { locale, t } = getDictionary();
  const intlLocale = locale === "it" ? "it-IT" : "en-IE";
  const eur = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const pct1 = (n: number) =>
    n.toLocaleString(intlLocale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%";

  const supabase = createClient();
  const { data: goals } = await supabase.from("goals").select("*").order("created_at");
  const rows = goals || [];

  const totalSaved = rows.reduce((s, g) => s + Math.min(Number(g.saved), Number(g.target)), 0);
  const totalTarget = rows.reduce((s, g) => s + Number(g.target), 0);
  const totalPct = totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0;

  const addPanel = (
    <>
      <div className="mb-4">
        <ErrorBanner message={searchParams.error} />
      </div>
      <form action={addGoal} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.goals.nameLabel}</label>
          <input
            name="name"
            required
            placeholder={t.goals.namePlaceholder}
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{t.goals.targetLabel}</label>
          <input
            name="target"
            type="number"
            step="0.01"
            min="1"
            required
            className="border border-border dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <SubmitButton
          pendingText={t.goals.creatingPending}
          className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors sm:w-fit"
        >
          {t.goals.createSubmit}
        </SubmitButton>
      </form>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <Toast message={searchParams.success} />

      <PageHeader
        eyebrow={t.goals.savingEyebrow}
        title={t.goals.title}
        actionLabel={t.goals.newAction}
        panelTitle={t.goals.newGoalTitle}
        closeLabel={t.common.closeAction}
        panel={addPanel}
        defaultOpen={Boolean(searchParams.error)}
      />

      {rows.length === 0 ? (
        <p className="text-sm text-ink-muted dark:text-neutral-500">{t.goals.emptyState}</p>
      ) : (
        <>
          <div className="border border-border dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <span className="text-sm text-ink-secondary dark:text-neutral-400">
              {t.goals.setAsidePre}{" "}
              <strong className="num text-ink dark:text-neutral-100">{eur.format(totalSaved)}</strong>{" "}
              {t.goals.setAsideOf}{" "}
              <strong className="num text-ink dark:text-neutral-100">{eur.format(totalTarget)}</strong>{" "}
              {t.goals.setAsideSuffix}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-surface-alt dark:bg-neutral-800 max-w-xs">
              <div className="bar-fill h-full rounded-full bg-accent" style={{ width: `${totalPct}%` }} />
            </div>
            <span className="num text-sm font-semibold">{pct1(totalPct)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rows.map((g) => {
              const saved = Math.min(Number(g.saved), Number(g.target));
              const ratio = Number(g.target) > 0 ? saved / Number(g.target) : 0;
              const pct = Math.min(100, ratio * 100);
              const reached = Number(g.saved) >= Number(g.target);
              const missing = Number(g.target) - Number(g.saved);
              return (
                <div
                  key={g.id}
                  className={`relative border rounded-xl p-4 flex gap-4 items-start ${
                    reached
                      ? "border-transparent bg-accent-soft dark:bg-accent/15"
                      : "border-border dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  }`}
                >
                  {/* L'anello dice a colpo d'occhio quanto manca, cosa che una
                      barra dritta in mezzo agli altri numeri non faceva. */}
                  <div className="relative w-[72px] h-[72px] shrink-0">
                    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
                      <circle cx="36" cy="36" r={RAGGIO} fill="none" strokeWidth="8" className="stroke-surface-alt dark:stroke-neutral-800" />
                      <circle
                        cx="36"
                        cy="36"
                        r={RAGGIO}
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(GIRO * ratio).toFixed(1)} ${GIRO.toFixed(1)}`}
                        transform="rotate(-90 36 36)"
                        className="stroke-accent"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold num">
                      {Math.round(pct)}%
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold pr-6 flex items-center gap-2 flex-wrap">
                      <span className="truncate">{g.name}</span>
                      {reached ? (
                        <span className="text-[11px] font-bold text-accent bg-white dark:bg-neutral-900 rounded-full px-2 py-0.5">
                          {t.goals.reachedBadge}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm num mt-1">
                      {eur.format(Number(g.saved))}{" "}
                      <span className="text-ink-muted dark:text-neutral-500">/ {eur.format(Number(g.target))}</span>
                    </p>
                    <p className="text-xs text-ink-muted dark:text-neutral-500 mt-1.5">
                      {reached
                        ? t.goals.reachedSuffix.replace(/^—\s*/, "")
                        : `${t.goals.missingPre} ${eur.format(missing)}`}
                    </p>

                    <form action={contribute} className="flex flex-wrap items-center gap-2 mt-3">
                      <input type="hidden" name="id" value={g.id} />
                      <input
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder={t.goals.contributionAmountPlaceholder}
                        className="border border-border dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs flex-1 min-w-[4.5rem] max-w-[8rem] bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <SubmitButton
                        pendingText={t.goals.addingPending}
                        className="border border-border dark:border-neutral-800 rounded-full px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-900 hover:border-accent hover:text-accent transition-colors"
                      >
                        {t.goals.contributeSubmit}
                      </SubmitButton>
                    </form>
                  </div>

                  <form action={deleteGoal} className="absolute top-3 right-3">
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmButton
                      confirmMessage={t.goals.deleteConfirmTemplate.replace("{name}", g.name)}
                      confirmLabel={t.common.deleteAction}
                      cancelLabel={t.common.cancelAction}
                      ariaLabel={t.goals.deleteAriaLabel}
                      className="text-ink-muted dark:text-neutral-500 hover:text-red-600 w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      <X size={13} strokeWidth={2.2} />
                    </ConfirmButton>
                  </form>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
