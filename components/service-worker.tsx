"use client";

import { useEffect } from "react";

// Registra il service worker, che serve a due cose: rendere Bilancino
// installabile sul telefono (Chrome mostra la proposta di installazione solo
// ai siti che ne hanno uno) e non richiedere due volte gli stessi file statici.
//
// Gira dopo il montaggio e non blocca niente: se la registrazione fallisce —
// browser vecchio, modalità privata, utente che li ha disattivati — il sito
// funziona esattamente come prima, perché il service worker non è mai
// necessario a farlo funzionare.
export function ServiceWorker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    // In sviluppo resterebbe installato fra un riavvio e l'altro, a
    // intercettare file che cambiano a ogni salvataggio.
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silenzio voluto: è un miglioramento, non un requisito.
    });
  }, []);

  return null;
}
