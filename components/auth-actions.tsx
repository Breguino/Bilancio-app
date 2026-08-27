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
  navLabel,
  marketingNavLinks,
}: {
  loggedIn: boolean;
  nav: NavDict;
  navLabel: string;
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
          className="hidden sm:inline-flex items-center h-9 text-sm font-semibold text-ink-secondary dark:text-neutral-400 border border-border dark:border-neutral-700 rounded-full px-4 hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
        >
          {nav.accedi}
        </Link>
      ) : null}
      <div className="sm:hidden">
        <MobileMenu items={mobileItems} navLabel={navLabel} />
      </div>
      <Link
        href={loggedIn ? "/dashboard" : "/signup"}
        className="inline-flex items-center h-9 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-3 sm:px-4 transition-colors whitespace-nowrap"
      >
        <span className="sm:hidden">{loggedIn ? nav.vaiDashboardShort : nav.creaAccountShort}</span>
        <span className="hidden sm:inline">{loggedIn ? nav.vaiDashboard : nav.creaAccount}</span>
      </Link>
    </>
  );
}
