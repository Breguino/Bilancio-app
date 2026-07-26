// Impedisce redirect verso URL esterni quando "next" arriva da una query string
// (login, conferma email, reset password): senza questo controllo un link
// creato ad arte (?next=https://evil.com) rimanderebbe fuori dall'app subito
// dopo un'autenticazione legittima.
export function safeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}
