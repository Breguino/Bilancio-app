"use client";

import { useId, useState } from "react";
import { Upload } from "lucide-react";
import { useFormStatus } from "react-dom";

// Scegliere il file avvia subito l'import (niente pulsante "Importa" separato
// da premere dopo) — un solo gesto invece di due.
export function FileInputButton({
  name,
  accept,
  required,
  title,
  importingLabel = "Importo…",
  importLabel = "Importa CSV",
}: {
  name: string;
  accept?: string;
  required?: boolean;
  title?: string;
  importingLabel?: string;
  importLabel?: string;
}) {
  const id = useId();
  const [fileName, setFileName] = useState<string | null>(null);
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <label
        htmlFor={id}
        title={title}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border border-border dark:border-neutral-700 transition-colors shrink-0 ${
          pending
            ? "opacity-60 cursor-not-allowed pointer-events-none"
            : "cursor-pointer hover:border-accent hover:text-accent"
        }`}
      >
        <Upload size={13} strokeWidth={2} aria-hidden="true" />
        {pending ? importingLabel : importLabel}
      </label>
      <input
        id={id}
        type="file"
        name={name}
        accept={accept}
        required={required}
        title={title}
        disabled={pending}
        onChange={(e) => {
          setFileName(e.target.files?.[0]?.name || null);
          if (e.target.files?.length) e.target.form?.requestSubmit();
        }}
        className="sr-only"
      />
      {fileName ? (
        <span className="text-xs text-ink-muted dark:text-neutral-500 truncate max-w-[7rem] sm:max-w-[10rem]">
          {fileName}
        </span>
      ) : null}
    </div>
  );
}
