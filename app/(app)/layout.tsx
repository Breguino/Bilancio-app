import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isProfileComplete, type Profile } from "@/lib/profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { AppNav } from "@/components/app-nav";
import { MobileMenu } from "@/components/mobile-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Chi entra con Google non passa dal form di registrazione, quindi arriva
  // qui senza i dati anagrafici richiesti: lo mandiamo a completarli prima di
  // poter usare l'app. La pagina sta fuori da questo gruppo di rotte, altrimenti
  // il controllo si riattiverebbe su se stesso.
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, birth_date, residence")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!isProfileComplete(profile as Profile | null)) {
      redirect("/completa-profilo");
    }
  }

  const { locale, t } = getDictionary();

  const navLinks = [
    { href: "/dashboard", label: t.appShell.navPanoramica },
    { href: "/recurring", label: t.appShell.navRicorrenti },
    { href: "/budget", label: t.appShell.navBudget },
    { href: "/goals", label: t.appShell.navObiettivi },
    { href: "/compare", label: t.appShell.navConfronta },
    { href: "/yearly", label: t.appShell.navAnnuale },
    { href: "/statistics", label: t.appShell.navStatistiche },
    { href: "/contacts", label: t.appShell.navContatti },
  ];

  const ownerEmail = process.env.NEWSLETTER_ADMIN_EMAIL?.toLowerCase();
  if (ownerEmail && user?.email?.toLowerCase() === ownerEmail) {
    navLinks.push({ href: "/newsletter", label: t.appShell.navNewsletter });
  }

  return (
    <div className="min-h-screen">
      <header className="print:hidden sticky top-0 z-20 relative border-b border-border dark:border-neutral-800 backdrop-blur bg-white/90 dark:bg-neutral-950/90">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-extrabold -ml-2 px-2 py-2 rounded-full hover:bg-surface-alt dark:hover:bg-neutral-800 transition-colors"
            aria-label="Bilancino"
          >
            <Logo />
          </Link>
          <AppNav links={navLinks} />
          <div className="flex items-center gap-2">
            <span className="text-ink-muted dark:text-neutral-500 text-sm hidden xl:inline mr-1">
              {user?.email}
            </span>
            <Link
              href="/"
              aria-label={t.appShell.backToSiteAriaLabel}
              title={t.appShell.backToSiteTitle}
              className="w-9 h-9 rounded-full border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <Home size={16} strokeWidth={1.75} />
            </Link>
            <Link
              href="/impostazioni"
              aria-label={t.appShell.settingsAriaLabel}
              title={t.appShell.settingsTitle}
              className="w-9 h-9 rounded-full border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <Settings size={16} strokeWidth={1.75} />
            </Link>
            <LanguageSwitcher locale={locale} label={t.common.langSwitchLabel} />
            <ThemeToggle ariaLabel={t.shared.themeToggle.ariaLabel} title={t.shared.themeToggle.title} />
            <div className="lg:hidden">
              <MobileMenu items={navLinks} />
            </div>
            <form action="/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center h-9 border border-border dark:border-neutral-700 rounded-full px-4 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                {t.appShell.logout}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
