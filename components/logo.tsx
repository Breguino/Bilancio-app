import Image from "next/image";

// Il simbolo compare sempre accanto al nome scritto (in Brand e sulla
// ricevuta): con un testo alternativo uno screen reader leggeva "Bilancino"
// due volte di fila. Immagine decorativa, quindi alt vuoto.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      priority
    />
  );
}
