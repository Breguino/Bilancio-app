import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// Riga di consenso da mettere sotto il bottone di invio, dove i dati vengono
// effettivamente raccolti: l'art. 13 GDPR vuole l'informativa al momento della
// raccolta, non solo raggiungibile da qualche parte nel sito. Non è una spunta
// perché la base giuridica è il contratto, non il consenso — vedi /privacy.
export function AuthConsentNote({ variant = "signup" }: { variant?: "signup" | "continue" }) {
  const { t } = getDictionary();
  const lead = variant === "signup" ? t.auth.legal.consentSignup : t.auth.legal.consentContinue;

  return (
    <p className="text-xs leading-[1.5] text-ink-muted dark:text-neutral-500 text-center">
      {lead}{" "}
      <Link href="/termini" className="font-medium text-accent hover:underline">
        {t.auth.legal.terms}
      </Link>{" "}
      {t.auth.legal.and}{" "}
      <Link href="/privacy" className="font-medium text-accent hover:underline">
        {t.auth.legal.privacy}
      </Link>
      .
    </p>
  );
}

// Piè di pagina presente su ogni schermata di autenticazione: prima di questo
// non c'era modo di leggere termini e privacy senza tornare alla home.
export function AuthLegalFooter({ align = "left" }: { align?: "left" | "center" }) {
  const { t } = getDictionary();

  return (
    <div
      className={`flex items-center gap-2 mt-7 pt-5 border-t border-border dark:border-neutral-800 text-xs ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <Link href="/termini" className="text-ink-muted dark:text-neutral-500 hover:text-accent transition-colors">
        {t.auth.legal.terms}
      </Link>
      <span className="text-ink-muted dark:text-neutral-500" aria-hidden="true">
        ·
      </span>
      <Link href="/privacy" className="text-ink-muted dark:text-neutral-500 hover:text-accent transition-colors">
        {t.auth.legal.privacy}
      </Link>
    </div>
  );
}
