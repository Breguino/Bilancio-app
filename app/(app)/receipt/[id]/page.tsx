import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";
import { PrintButton } from "@/components/print-button";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const { locale, t } = getDictionary();
  const eur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-IE", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });
  const dateFmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*, contact:contacts(id, name, email)")
    .eq("id", params.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!transaction || !transaction.contact_id || Number(transaction.amount) <= 0) {
    notFound();
  }

  const receiptNumber = transaction.id.slice(0, 8).toUpperCase();
  const issuedOn = dateFmt.format(new Date());
  const [y, m, d] = transaction.date.split("-").map(Number);
  const transactionDate = dateFmt.format(new Date(y, m - 1, d));

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-lg border border-border dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-6 sm:p-8 print:border-0 print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Logo size={36} />
            <span className="font-extrabold text-lg">Bilancino</span>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500">{t.receipt.receiptLabel}</p>
            <p className="num text-sm font-bold">#{receiptNumber}</p>
          </div>
        </div>

        <h1 className="text-xl font-extrabold tracking-tight mb-6">{t.receipt.title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.receipt.from}</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.receipt.to}</p>
            <p className="font-medium">{transaction.contact?.name}</p>
            {transaction.contact?.email ? (
              <p className="text-ink-secondary dark:text-neutral-400 text-xs">{transaction.contact.email}</p>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.receipt.paymentDate}</p>
            <p className="font-medium">{transactionDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-ink-muted dark:text-neutral-500 mb-1">{t.receipt.issuedOn}</p>
            <p className="font-medium">{issuedOn}</p>
          </div>
        </div>

        <div className="border border-border dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-alt dark:bg-neutral-800 text-xs font-semibold uppercase text-ink-muted dark:text-neutral-400">
            <span>{t.receipt.descriptionColumn}</span>
            <span>{t.receipt.amountColumn}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm">
            <span className="min-w-0 break-words">
              {transaction.description}
              {transaction.category ? (
                <span className="text-ink-muted dark:text-neutral-500"> · {transaction.category}</span>
              ) : null}
            </span>
            <span className="num font-medium shrink-0">{eur.format(Number(transaction.amount))}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-ink dark:border-neutral-100 pt-4">
          <span className="font-bold">{t.receipt.totalReceived}</span>
          <span className="num text-xl font-extrabold">{eur.format(Number(transaction.amount))}</span>
        </div>
      </div>

      <div className="print:hidden flex items-center gap-3">
        <PrintButton />
        <a
          href="/dashboard"
          className="text-sm font-semibold text-ink-muted dark:text-neutral-500 hover:text-accent px-2 py-2"
        >
          {t.receipt.backToDashboard}
        </a>
      </div>
    </div>
  );
}
