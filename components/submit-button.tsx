"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className || ""} ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
