"use client";

import { useAuthUser } from "@/components/auth-provider";

// Isola nel client la parte di markup che dipende dalla sessione, così la
// pagina che la usa resta un Server Component senza dynamic API di auth
// invece di leggere i cookie di sessione ad ogni richiesta. I due rami sono
// JSX già pronto (non una render prop): una funzione non è serializzabile
// attraverso il confine Server → Client Component di Next.js, un nodo React
// sì.
export function AuthGate({
  loggedIn,
  loggedOut,
}: {
  loggedIn: React.ReactNode;
  loggedOut: React.ReactNode;
}) {
  const user = useAuthUser();
  return <>{user ? loggedIn : loggedOut}</>;
}
