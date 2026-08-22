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
      className={`text-sm font-semibold rounded-sm px-4 py-2.5 bg-verde hover:bg-verde-hover text-carta transition-colors shrink-0 ${
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
    return <p className="text-sm text-verde font-semibold">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex items-stretch gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={emailPlaceholder}
          className="text-sm bg-foglio border border-riga rounded-sm px-3 py-2.5 w-48 text-inchiostro placeholder:text-inchiostro-muted focus:outline-none focus:border-verde"
        />
        <SubmitButton label={subscribeLabel} />
      </div>
      {state.status === "error" ? (
        <span className="text-sm text-minio">{state.message}</span>
      ) : null}
    </form>
  );
}
