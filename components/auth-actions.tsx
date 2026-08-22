import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import type { dictionaryFor } from "@/lib/i18n/dictionaries";

type NavDict = ReturnType<typeof dictionaryFor>["nav"];

// Le CTA dell'header che cambiano a seconda della sessione. È un Server
// Component che riceve `loggedIn` già risolto da SiteHeader: l'unica parte
// interattiva è MobileMenu, che resta un Client Component a sé. Così l'header
// non spedisce al browser né il client Supabase né un contesto di auth, e la
// CTA arriva già giusta nell'HTML — niente sfarfallio da "Accedi" a
// "Dashboard" dopo l'idratazione.
export function AuthActions({
  loggedIn,
  nav,
  marketingNavLinks,
}: {
  loggedIn: boolean;
  nav: NavDict;
  marketingNavLinks: { href: string; label: string }[];
}) {
  const mobileItems = loggedIn
    ? [...marketingNavLinks, { href: "/dashboard", label: nav.dashboard }]
    : [...marketingNavLinks, { href: "/login", label: nav.accedi }];

  return (
    <>
      {!loggedIn ? (
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center h-9 text-sm font-medium text-inchiostro-soft border border-riga rounded-sm px-4 hover:border-verde hover:text-verde transition-colors whitespace-nowrap"
        >
          {nav.accedi}
        </Link>
      ) : null}
      <div className="sm:hidden">
        <MobileMenu items={mobileItems} variant="sito" />
      </div>
      <Link
        href={loggedIn ? "/dashboard" : "/signup"}
        className="inline-flex items-center h-9 bg-verde hover:bg-verde-hover text-carta font-semibold text-sm rounded-sm px-4 transition-colors whitespace-nowrap"
      >
        <span className="sm:hidden">{loggedIn ? nav.vaiDashboardShort : nav.creaAccountShort}</span>
        <span className="hidden sm:inline">{loggedIn ? nav.vaiDashboard : nav.creaAccount}</span>
      </Link>
    </>
  );
}
