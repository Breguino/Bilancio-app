"use client";

import { useEffect, useState } from "react";

export function Toast({ message }: { message?: string }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 2200);
    const clean = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }, 2500);
    return () => {
      clearTimeout(hide);
      clearTimeout(clean);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 bg-ink dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-full px-5 py-2.5 shadow-lg">
        <span>✓</span>
        {message}
      </div>
    </div>
  );
}
