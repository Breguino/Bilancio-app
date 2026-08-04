"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext<User | null>(null);

// Legge la sessione una sola volta nel browser e la condivide via contesto a
// tutti i componenti che devono sapere "utente loggato sì/no" (header CTA,
// footer, banner nelle pagine di marketing). Usa getSession() (locale, senza
// round-trip di rete) perché qui serve solo per decidere cosa mostrare nella
// UI — la sicurezza vera resta a middleware + RLS lato server.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuthUser() {
  return useContext(AuthContext);
}
