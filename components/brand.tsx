import { Logo } from "@/components/logo";

// Il simbolo insieme al nome scritto. Prima nell'intestazione e sulle pagine di
// accesso c'era solo la tessera con la B: chi arrivava da una ricerca o da un
// link non leggeva mai come si chiama il prodotto, e il contenitore aveva
// perfino un aria-label "Bilancino" senza nessun testo dentro.
//
// Il nome usa il carattere dei titoli (Fraunces) invece di quello del testo:
// è la stessa voce con cui parlano le intestazioni del sito, quindi il marchio
// non sembra un pezzo aggiunto dopo.
export function Brand({ size = 30, nameClassName = "text-base sm:text-xl" }: { size?: number; nameClassName?: string }) {
  return (
    <>
      <Logo size={size} />
      <span className={`font-display font-bold tracking-tight leading-none ${nameClassName}`}>Bilancino</span>
    </>
  );
}
