"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { resendConfirmation } from "@/app/signup/actions";

export type ResendLabels = {
  resend: string;
  pending: string;
  cooldown: string;
  spam: string;
  done: string;
};

export function ResendConfirmation({ resent, labels }: { resent: boolean; labels: ResendLabels }) {
  // Il conto alla rovescia è solo una cortesia lato client, per non far
  // premere il bottone a vuoto: il limite vero lo impone Supabase.
  const [left, setLeft] = useState(resent ? 30 : 0);

  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  return (
    <div className="flex flex-col gap-3">
      {resent ? (
        <p role="status" className="text-sm text-ink-secondary dark:text-neutral-400">
          {labels.done}
        </p>
      ) : null}

      <form action={resendConfirmation}>
        <ResendButton left={left} labels={labels} />
      </form>

      <p className="text-xs text-ink-muted dark:text-neutral-500">{labels.spam}</p>
    </div>
  );
}

function ResendButton({ left, labels }: { left: number; labels: ResendLabels }) {
  const { pending } = useFormStatus();
  const waiting = left > 0;

  return (
    <button
      type="submit"
      disabled={pending || waiting}
      className="w-full border border-border dark:border-neutral-700 rounded-full py-2.5 text-sm font-semibold hover:bg-surface-alt dark:hover:bg-neutral-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      {pending ? labels.pending : waiting ? `${labels.cooldown} ${left}s` : labels.resend}
    </button>
  );
}
