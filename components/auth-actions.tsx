"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { useAuthUser } from "@/components/auth-provider";
import type { dictionaryFor } from "@/lib/i18n/dictionaries";

type NavDict = ReturnType<typeof dictionaryFor>["nav"];

// Componente client separato dal resto dell'header: legge la sessione dal
// contesto condiviso (AuthProvider) invece che nel Server Component, così
// SiteHeader non deve più chiamare supabase.auth.getUser() ad ogni
// richiesta. Finché la sessione non è nota si assume utente anonimo (il
// caso comune per chi visita le pagine di marketing), evitando un mismatch
// di idratazione. I testi restano tradotti lato server e arrivano via prop.
export function AuthActions({
  nav,
  marketingNavLinks,
}: {
  nav: NavDict;
  marketingNavLinks: { href: string; label: string }[];
}) {
  const user = useAuthUser();

  const mobileItems = user
    ? [...marketingNavLinks, { href: "/dashboard", label: nav.dashboard }]
    : [...marketingNavLinks, { href: "/login", label: nav.accedi }];

  return (
    <>
      {!user ? (
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center h-9 text-sm font-semibold text-ink-secondary dark:text-neutral-400 border border-border dark:border-neutral-700 rounded-full px-4 hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
        >
          {nav.accedi}
        </Link>
      ) : null}
      <div className="sm:hidden">
        <MobileMenu items={mobileItems} />
      </div>
      <Link
        href={user ? "/dashboard" : "/signup"}
        className="inline-flex items-center h-9 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-4 transition-colors whitespace-nowrap"
      >
        <span className="sm:hidden">{user ? nav.vaiDashboardShort : nav.creaAccountShort}</span>
        <span className="hidden sm:inline">{user ? nav.vaiDashboard : nav.creaAccount}</span>
      </Link>
    </>
  );
}
