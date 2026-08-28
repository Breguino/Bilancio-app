"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// L'ultima rete: error.tsx sta dentro il layout, quindi non può catturare un
// errore del layout stesso. Quando salta quello, salta anche l'HTML intorno —
// per questo qui ci sono <html> e <body>, e nessuna classe del tema: è il caso
// in cui non si può dare per buono niente di quello che c'è sopra.
//
// Succede raramente. È esattamente il guasto di cui altrimenti non sapremmo
// mai niente.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#fbfbf8",
          color: "#14151a",
          fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
            Qualcosa è andato storto
          </h1>
          <p style={{ margin: "0 0 20px", color: "#55565f", fontSize: "14px" }}>
            La pagina non è riuscita a caricarsi. Riprova fra un momento.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "#0e6e80",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              borderRadius: "999px",
              padding: "10px 24px",
            }}
          >
            Torna alla home
          </a>
        </div>
      </body>
    </html>
  );
}
