// Dati anagrafici raccolti alla registrazione. Vivono nella tabella
// "profiles" (vedi supabase/schema.sql), una riga per utente.
export type Profile = {
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
};

export const MIN_SIGNUP_AGE = 18;

// Età compiuta alla data di riferimento. Confrontiamo mese e giorno invece di
// dividere una differenza in millisecondi: così anni bisestili e fusi orari
// non spostano il compleanno di un giorno.
export function ageOn(birthDate: string, today: Date): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  let age = today.getFullYear() - y;
  const monthDiff = today.getMonth() + 1 - m;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
    age -= 1;
  }
  return age;
}

// Una data valida nel formato dell'input type="date" (YYYY-MM-DD) e che
// esiste davvero: "2026-02-31" passa il formato ma non è un giorno reale.
export function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

export function isAdult(birthDate: string, today: Date = new Date()): boolean {
  return ageOn(birthDate, today) >= MIN_SIGNUP_AGE;
}

// Il profilo è completo solo se tutti e tre i campi sono valorizzati:
// chi si registra col form li fornisce subito, chi entra con Google no, e
// finché mancano l'app lo manda su /completa-profilo.
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.first_name?.trim() && profile.last_name?.trim() && profile.birth_date
  );
}
