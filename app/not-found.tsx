import Link from "next/link";
import { Brand } from "@/components/brand";
import { dictionaryFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export default function NotFound() {
  const t = dictionaryFor(getLocale());

  return (
    <main className="min-h-screen flex justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center my-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
          <Brand size={40} nameClassName="text-2xl" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">{t.errors.notFoundTitle}</h1>
        <p className="text-ink-secondary dark:text-neutral-400 text-sm mb-6">
          {t.errors.notFoundBody}
        </p>
        <Link
          href="/"
          className="inline-flex bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-full px-6 py-2.5 transition-colors"
        >
          {t.errors.backToHome}
        </Link>
      </div>
    </main>
  );
}
