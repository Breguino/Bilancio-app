"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { passwordScore } from "@/lib/password-strength";

export type StrengthLabels = {
  hint: string;
  weak: string;
  fair: string;
  good: string;
  strong: string;
  ariaLabel: string;
};

export function PasswordInput({
  id,
  name,
  autoComplete,
  required,
  minLength,
  showLabel = "Mostra password",
  hideLabel = "Nascondi password",
  strengthLabels,
}: {
  id: string;
  name: string;
  autoComplete: string;
  required?: boolean;
  minLength?: number;
  showLabel?: string;
  hideLabel?: string;
  // Passando le etichette compare la barra di robustezza: serve dove la
  // password viene scelta (registrazione, nuova password), non dove viene
  // solo riscritta per accedere.
  strengthLabels?: StrengthLabels;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");

  const score = passwordScore(value);
  const hintId = `${id}-strength`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-describedby={strengthLabels ? hintId : undefined}
          onChange={strengthLabels ? (e) => setValue(e.target.value) : undefined}
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

      {strengthLabels ? (
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-1" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${segmentClass(score, step)}`}
              />
            ))}
          </div>
          <span
            id={hintId}
            aria-live="polite"
            aria-label={strengthLabels.ariaLabel}
            className="text-xs text-ink-muted dark:text-neutral-500 whitespace-nowrap"
          >
            {scoreLabel(score, strengthLabels)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

// Stessa scala semantica delle barre budget: rosa, ambra, smeraldo.
function segmentClass(score: number, step: number) {
  const empty = "bg-surface-alt dark:bg-neutral-800";
  if (score === 0 || score < step) return empty;
  if (score >= 3) return "bg-emerald-400/70";
  if (score === 2) return "bg-amber-400/70";
  return "bg-rose-400/70";
}

function scoreLabel(score: number, labels: StrengthLabels) {
  if (score === 0) return labels.hint;
  if (score === 1) return labels.weak;
  if (score === 2) return labels.fair;
  if (score === 3) return labels.good;
  return labels.strong;
}
