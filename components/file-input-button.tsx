"use client";

import { useId, useState } from "react";

export function FileInputButton({
  name,
  accept,
  required,
  title,
}: {
  name: string;
  accept?: string;
  required?: boolean;
  title?: string;
}) {
  const id = useId();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <label
        htmlFor={id}
        title={title}
        className="text-xs font-semibold rounded-full px-2.5 py-1.5 border border-border dark:border-neutral-700 cursor-pointer hover:border-accent hover:text-accent transition-colors shrink-0"
      >
        Scegli file
      </label>
      <input
        id={id}
        type="file"
        name={name}
        accept={accept}
        required={required}
        title={title}
        onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
        className="sr-only"
      />
      <span className="text-xs text-ink-muted dark:text-neutral-500 truncate max-w-[7rem] sm:max-w-[10rem]">
        {fileName || "Nessun file"}
      </span>
    </div>
  );
}
