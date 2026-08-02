"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ConfirmButton({
  confirmMessage,
  confirmLabel = "Elimina",
  cancelLabel = "Annulla",
  className,
  ariaLabel,
  children,
}: {
  confirmMessage: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    // Il focus parte da Annulla, non da Elimina: su un'azione distruttiva un
    // Invio a caso non deve cancellare niente.
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        // Senza questo il focus resta orfano sul body e chi naviga da tastiera
        // perde il punto in cui era nella lista.
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleConfirm() {
    // Il dialog vive in un portal su document.body, quindi fuori dal <form>: non
    // può essere un submit button. Inviamo a mano il form del trigger, così la
    // Server Action parte come con un submit normale.
    const form = triggerRef.current?.closest("form");
    setOpen(false);
    form?.requestSubmit();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div
                className="confirm-overlay absolute inset-0 bg-ink/50 dark:bg-black/70"
                onClick={close}
              />
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="confirm-dialog relative w-full max-w-sm rounded-2xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-[0_24px_60px_-12px_rgba(20,21,26,0.35)]"
              >
                <p id={titleId} className="font-bold text-[15px] leading-snug">
                  {confirmMessage}
                </p>
                <div className="flex items-center justify-end gap-2 mt-6">
                  <button
                    ref={cancelRef}
                    type="button"
                    onClick={close}
                    className="text-sm font-semibold rounded-full px-4 py-2 border border-border dark:border-neutral-700 hover:border-accent hover:text-accent transition-colors"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="text-sm font-semibold rounded-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
