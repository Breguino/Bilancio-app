import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Il mese su cui stai guardando, con avanti e indietro. Prima non c'era: la
// panoramica e i budget mostravano sempre e solo il mese in corso, quindi il
// primo di settembre il mese appena chiuso spariva dalla vista.
//
// Sono due collegamenti veri, non due pulsanti: la pagina si ricarica con un
// altro mese nell'indirizzo, quindi funziona anche senza JavaScript e il mese
// che stai guardando si puo' mandare a qualcuno per link.
export function MonthStepper({
  month,
  label,
  hrefFor,
  prevLabel,
  nextLabel,
  maxMonth,
}: {
  month: string;
  label: string;
  hrefFor: (month: string) => string;
  prevLabel: string;
  nextLabel: string;
  maxMonth?: string;
}) {
  const shift = (n: number) => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + n, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const prev = shift(-1);
  const next = shift(1);
  const nextBlocked = Boolean(maxMonth && next > maxMonth);

  const arrow =
    "w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary dark:text-neutral-400 hover:bg-surface-alt dark:hover:bg-neutral-800 hover:text-accent transition-colors";

  return (
    <div className="flex items-center gap-0.5 border border-border dark:border-neutral-800 rounded-full bg-white dark:bg-neutral-900 p-1">
      <Link href={hrefFor(prev)} aria-label={prevLabel} title={prevLabel} className={arrow}>
        <ChevronLeft size={16} strokeWidth={2} />
      </Link>
      <span className="text-sm font-semibold px-2 min-w-[7.5rem] text-center">{label}</span>
      {nextBlocked ? (
        <span aria-hidden="true" className={`${arrow} opacity-30 pointer-events-none`}>
          <ChevronRight size={16} strokeWidth={2} />
        </span>
      ) : (
        <Link href={hrefFor(next)} aria-label={nextLabel} title={nextLabel} className={arrow}>
          <ChevronRight size={16} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
