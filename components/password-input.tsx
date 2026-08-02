"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  id,
  name,
  autoComplete,
  required,
  minLength,
  showLabel = "Mostra password",
  hideLabel = "Nascondi password",
}: {
  id: string;
  name: string;
  autoComplete: string;
  required?: boolean;
  minLength?: number;
  showLabel?: string;
  hideLabel?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="w-full border border-border dark:border-neutral-800 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-neutral-500 hover:text-accent transition-colors"
      >
        {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
      </button>
    </div>
  );
}
