"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { useAuthUser } from "@/components/auth-provider";
import { MARKETING_NAV_LINKS } from "@/lib/marketing-nav";

// Componente client separato dal resto dell'header: legge la sessione dal
// contesto condiviso (AuthProvider) invece che nel Server Component, così le
// pagine di marketing restano statiche e cacheabili dalla CDN invece di
// essere rigenerate ad ogni richiesta solo per sapere se mostrare "Accedi" o
// "Vai alla Dashboard". Finché la sessione non è nota si assume utente
// anonimo (il caso comune per chi visita queste pagine), evitando un
// mismatch di idratazione.
export function AuthActions() {
  const user = useAuthUser();

  const mobileItems = user
    ? [...MARKETING_NAV_LINKS, { href: "/dashboard", label: "Dashboard" }]
    : [...MARKETING_NAV_LINKS, { href: "/login", label: "Accedi" }];

  return (
    <>
      {!user ? (
        <Link
          href="/login"
          className="hidden sm:inline text-sm font-semibold text-ink-secondary dark:text-neutral-400 hover:text-ink dark:hover:text-neutral-100"
        >
          Accedi
        </Link>
      ) : null}
      <div className="sm:hidden">
        <MobileMenu items={mobileItems} />
      </div>
      <Link
        href={user ? "/dashboard" : "/signup"}
        className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 py-2 transition-colors whitespace-nowrap"
      >
        {user ? "Vai alla Dashboard" : "Crea un account"}
      </Link>
    </>
  );
}
