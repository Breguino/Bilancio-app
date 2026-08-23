import Image from "next/image";

// Schermate vere dell'app, catturate su un account dimostrativo con dati
// inventati. Prima al loro posto c'erano tre riquadri ricostruiti in HTML che
// imitavano l'interfaccia: somigliavano al prodotto senza esserlo, e ogni
// modifica all'app li lasciava indietro senza che nessuno se ne accorgesse.
export function AppScreenshot({
  src,
  srcDark,
  width,
  height,
  alt,
  caption,
}: {
  src: string;
  srcDark: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="rounded-2xl overflow-hidden border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_24px_60px_-20px_rgba(20,21,26,0.18)] dark:shadow-none">
      {/* Una schermata chiara su una pagina in tema scuro è un rettangolo
          bianco in mezzo al nero: qui il CSS sceglie la versione giusta. */}
      {[
        { file: src, visibilita: "dark:hidden" },
        { file: srcDark, visibilita: "hidden dark:block" },
      ].map(({ file, visibilita }) => (
        <Image
          key={file}
          src={file}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-auto ${visibilita}`}
          sizes="(max-width: 1024px) 100vw, 620px"
        />
      ))}
      <figcaption className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-neutral-500 px-4 py-2.5 border-t border-border dark:border-neutral-800">
        {caption}
      </figcaption>
    </figure>
  );
}
