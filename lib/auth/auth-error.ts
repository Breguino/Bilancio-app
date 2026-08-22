// Perché gli errori di autenticazione viaggiano come codici e non come testo.
//
// Prima le azioni passavano nell'URL il messaggio grezzo di Supabase
// (`?error=${error.message}`) e la pagina lo stampava così com'era. Due
// conseguenze, entrambe viste dal vivo:
//
//  1. Quando la libreria non riesce a leggere il corpo della risposta, il
//     messaggio è la stringa "{}". All'utente comparivano due parentesi graffe
//     al posto di una spiegazione.
//  2. Il testo arrivava dalla barra degli indirizzi, quindi bastava un link
//     costruito ad arte per far comparire un messaggio qualsiasi sulla vera
//     pagina di accesso — per esempio un finto "sessione scaduta, scrivi a
//     questo indirizzo". Non è codice che viene eseguito, ma è comunque un
//     messaggio che sembra nostro e non lo è.
//
// Ora nell'URL passa solo un codice preso da questo elenco chiuso, e il testo
// viene scelto qui al momento di disegnare la pagina, nella lingua giusta.

export const AUTH_ERROR_CODES = [
  "invalid_credentials",
  "email_not_confirmed",
  "email_exists",
  "weak_password",
  "invalid_email",
  "rate_limited",
  "email_send_failed",
  "google_unavailable",
  "expired_link",
  "missing_fields",
  "invalid_birth_date",
  "too_young",
  "save_failed",
  "password_too_short",
  "password_mismatch",
  "generic",
] as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

export type AuthErrorMessages = Record<AuthErrorCode, string>;

function isAuthErrorCode(value: string): value is AuthErrorCode {
  return (AUTH_ERROR_CODES as readonly string[]).includes(value);
}

// I codici che Supabase restituisce nel campo `code`. Quando manca (errori più
// vecchi, o risposte senza corpo) si ripiega sul testo del messaggio.
const BY_SUPABASE_CODE: Record<string, AuthErrorCode> = {
  invalid_credentials: "invalid_credentials",
  email_not_confirmed: "email_not_confirmed",
  user_already_exists: "email_exists",
  email_exists: "email_exists",
  weak_password: "weak_password",
  email_address_invalid: "invalid_email",
  validation_failed: "invalid_email",
  over_request_rate_limit: "rate_limited",
  over_email_send_rate_limit: "rate_limited",
  otp_expired: "expired_link",
  session_expired: "expired_link",
  error_sending_confirmation_email: "email_send_failed",
  error_sending_recovery_email: "email_send_failed",
  unexpected_failure: "generic",
};

const BY_MESSAGE: [RegExp, AuthErrorCode][] = [
  [/invalid login credentials/i, "invalid_credentials"],
  [/email not confirmed/i, "email_not_confirmed"],
  [/already registered|already exists/i, "email_exists"],
  [/password should be|weak password/i, "weak_password"],
  [/unable to validate email|invalid email/i, "invalid_email"],
  [/rate limit|too many requests/i, "rate_limited"],
  [/error sending/i, "email_send_failed"],
  [/expired|invalid.*token/i, "expired_link"],
];

type MaybeAuthError = { code?: string; message?: string; status?: number; name?: string } | null | undefined;

export function authErrorCode(error: MaybeAuthError): AuthErrorCode {
  if (!error) return "generic";

  const code = typeof error.code === "string" ? error.code : "";
  if (code && BY_SUPABASE_CODE[code]) return BY_SUPABASE_CODE[code];

  // "{}" è quello che arriva quando la risposta non ha un corpo leggibile:
  // non dice niente a noi e ancora meno a chi legge.
  const message = typeof error.message === "string" ? error.message.trim() : "";
  if (!message || message === "{}" || message.startsWith("{")) return "generic";

  for (const [pattern, mapped] of BY_MESSAGE) {
    if (pattern.test(message)) return mapped;
  }

  // Troppe richieste: alcune versioni lo segnalano solo con lo stato HTTP.
  if (error.status === 429) return "rate_limited";

  return "generic";
}

// Risolve il codice letto dall'URL. Qualunque cosa non sia un codice noto
// diventa il messaggio generico: così un valore inventato non finisce a video.
export function authErrorText(
  value: string | undefined,
  messages: AuthErrorMessages
): string | undefined {
  if (!value) return undefined;
  return isAuthErrorCode(value) ? messages[value] : messages.generic;
}
