import { isLoggedIn } from "@/lib/auth/session";

// Sceglie quale dei due rami mostrare in base alla sessione. È un Server
// Component: prima la scelta avveniva nel browser, il che costringeva ogni
// pagina pubblica a scaricare il client Supabase solo per cambiare la scritta
// di un bottone. `isLoggedIn()` legge il cookie di sessione, quindi la pagina
// resta un Server Component senza pagare un round-trip di rete per richiesta.
//
// I due rami restano JSX già pronto (non una render prop) perché così le
// pagine possono passarli senza dover diventare Client Component.
export function AuthGate({
  loggedIn,
  loggedOut,
}: {
  loggedIn: React.ReactNode;
  loggedOut: React.ReactNode;
}) {
  return <>{isLoggedIn() ? loggedIn : loggedOut}</>;
}
