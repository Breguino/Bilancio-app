// Punteggio 0–4 per la barra di robustezza mostrata sotto il campo password.
// Non è un cancello: la registrazione richiede comunque 8 caratteri via
// minLength, questo serve solo a far vedere a chi scrive quanto sta reggendo.
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export function passwordScore(password: string): PasswordScore {
  if (password.length === 0) return 0;

  // Sotto la soglia minima resta 1 comunque sia composta: dire "Buona" a una
  // password di 4 caratteri con simboli e cifre sarebbe un consiglio sbagliato.
  if (password.length < 8) return 1;

  let score = 1;
  if (password.length >= 12) score += 1;
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  return score as PasswordScore;
}
