import { AlertCircle } from "lucide-react";

// role="alert" perché un errore che compare dopo l'invio va annunciato: senza,
// chi usa uno screen reader resta sul bottone senza sapere che è andata male.
export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm px-3 py-2"
    >
      <AlertCircle size={16} strokeWidth={2} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
