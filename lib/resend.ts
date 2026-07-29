import { Resend } from "resend";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// Senza un dominio verificato su Resend, l'indirizzo di test "onboarding@resend.dev"
// funziona ma consegna solo all'email del proprio account Resend — utile per
// collaudare l'invio prima di collegare un dominio vero.
export const NEWSLETTER_FROM = process.env.NEWSLETTER_FROM_EMAIL || "Bilancino <onboarding@resend.dev>";
