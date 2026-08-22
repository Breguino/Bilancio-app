// Riconosce il cookie di sessione scritto da @supabase/ssr, il cui nome è
// `sb-<ref-progetto>-auth-token`. Quando il token supera la dimensione massima
// di un cookie viene spezzato in `...-auth-token.0`, `...-auth-token.1` e così
// via: bastano quei suffissi numerici, non serve ricomporre il valore.
//
// L'ancora finale è importante: durante il login con Google, Supabase scrive
// anche `sb-<ref>-auth-token-code-verifier`, che esiste *prima* che l'utente
// sia autenticato. Senza `$` lo scambieremmo per una sessione valida e chi non
// ha ancora finito il login vedrebbe la CTA "Dashboard".
const SESSION_COOKIE = /^sb-.+-auth-token(\.\d+)?$/;

export function hasSessionCookie(cookies: { name: string; value: string }[]) {
  return cookies.some(({ name, value }) => SESSION_COOKIE.test(name) && value !== "");
}
