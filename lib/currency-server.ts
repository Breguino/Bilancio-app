import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { toCurrency, type Currency } from "@/lib/currency";

// La valuta scelta dall'utente, letta una volta sola per richiesta.
//
// La chiamano quasi tutte le schermate dell'app, e in Next ognuna gira per
// conto suo: senza cache() sarebbero otto interrogazioni identiche per una
// pagina sola. cache() di React le riduce a una, per la durata della richiesta.
//
// Quale riga torni lo decide la RLS: un utente vede solo il proprio profilo.
export const getUserCurrency = cache(async (): Promise<Currency> => {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("currency").maybeSingle();
  return toCurrency(data?.currency);
});
