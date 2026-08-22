"use client";

import { useFormState, useFormStatus } from "react-dom";
import { subscribeToNewsletter, type SubscribeState } from "@/lib/newsletter/subscribe-action";

const initialState: SubscribeState = { status: "idle" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-xs font-semibold rounded-full px-4 py-2 bg-accent hover:bg-accent-hover text-white transition-colors shrink-0 ${
        pending ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "…" : label}
    </button>
  );
}

export function NewsletterSubscribeForm({
  emailPlaceholder = "La tua email",
  subscribeLabel = "Iscriviti",
}: {
  emailPlaceholder?: string;
  subscribeLabel?: string;
}) {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);

  if (state.status === "success") {
    return <p className="text-xs text-accent font-semibold">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col sm:flex-row items-center gap-2">
      <div className="flex items-center gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={emailPlaceholder}
          className="text-xs border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-40"
        />
        <SubmitButton label={subscribeLabel} />
      </div>
      {state.status === "error" ? (
        <span className="text-xs text-red-600 dark:text-red-400">{state.message}</span>
      ) : null}
    </form>
  );
}
