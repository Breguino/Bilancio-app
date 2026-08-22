import { cookies } from "next/headers";
import { hasSessionCookie } from "./session-cookie";

// "Utente loggato sì/no" per decidere cosa mostrare nella UI (CTA dell'header,
// del footer e delle pagine di marketing). Guarda solo la presenza del cookie
// di sessione: è una lettura locale, senza round-trip di rete, quindi non
// reintroduce il costo per richiesta che avevamo evitato spostando questo
// controllo nel browser — ma senza spedire il client Supabase (~70 kB gzip) a
// chi visita una pagina pubblica.
//
// Non è un controllo di sicurezza e non deve diventarlo: la sicurezza vera
// resta middleware + RLS lato server. Vale comunque quanto il precedente
// `getSession()` lato client, che allo stesso modo si fidava del token locale
// senza validarlo; anzi qui il middleware ha appena rinnovato o ripulito i
// cookie con `getUser()`, quindi il segnale è semmai più fresco.
export function isLoggedIn() {
  return hasSessionCookie(cookies().getAll());
}
