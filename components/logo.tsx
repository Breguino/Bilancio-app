import Image from "next/image";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Bilancino"
      width={size}
      height={size}
      className="rounded-lg shrink-0"
      priority
    />
  );
}
