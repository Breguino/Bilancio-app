import Image from "next/image";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      alt="Bilancino"
      width={size}
      height={size}
      className="shrink-0"
      priority
    />
  );
}
