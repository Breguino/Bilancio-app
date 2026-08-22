import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// La chiusura di ogni pagina pubblica, in un posto solo. Prima ogni pagina
// riscriveva il proprio blocco finale a mano, con il risultato che tre pagine
// su cinque avevano spaziature e pesi leggermente diversi.
//
// Fondo inchiostro e un bottone d'ottone: è l'unico blocco pieno del sito, e
// arriva sempre in fondo. Chi scorre sa di essere arrivato.
export function Chiusura({
  titolo,
  secondario,
}: {
  // Se la pagina ha una sua domanda finale la usa; altrimenti si adatta a chi
  // legge, con i due testi della home (già dentro / non ancora).
  titolo?: string;
  secondario?: { href: string; label: string };
}) {
  const { t } = getDictionary();

  const azioni = (href: string, label: string) => (
    <div className="flex items-center justify-center gap-3 flex-wrap mt-9">
      {secondario ? (
        <Link
          href={secondario.href}
          className="bottone-quieto border-su-pieno/30 text-su-pieno hover:border-ottone hover:text-ottone"
        >
          {secondario.label}
        </Link>
      ) : null}
      <Link href={href} className="bottone bg-ottone hover:bg-ottone text-su-ottone">
        {label}
      </Link>
    </div>
  );

  return (
    <section className="pt-16 sm:pt-20 pb-20 sm:pb-28 border-t border-riga">
      <Reveal className="bg-pieno rounded-sm px-8 py-16 sm:px-16 sm:py-20 text-center">
        <AuthGate
          loggedIn={
            <>
              <h2 className="display text-3xl sm:text-[2.75rem] text-su-pieno max-w-[22ch] mx-auto">
                {titolo ?? t.home.ctaTitleReturning}
              </h2>
              <p className="text-su-pieno/60 max-w-[46ch] mx-auto mt-5 leading-relaxed">
                {t.home.ctaBodyReturning}
              </p>
              {azioni("/dashboard", t.home.ctaDashboard)}
            </>
          }
          loggedOut={
            <>
              <h2 className="display text-3xl sm:text-[2.75rem] text-su-pieno max-w-[22ch] mx-auto">
                {titolo ?? t.home.ctaTitleNew}
              </h2>
              <p className="text-su-pieno/60 max-w-[46ch] mx-auto mt-5 leading-relaxed">
                {t.home.ctaBodyNew}
              </p>
              {azioni("/signup", t.home.ctaSignupFree)}
            </>
          }
        />
      </Reveal>
    </section>
  );
}
