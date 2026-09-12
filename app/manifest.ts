import type { MetadataRoute } from "next";

// Il manifesto che rende Bilancino installabile: dal telefono si aggiunge alla
// schermata Home e si apre come un'app, senza la barra degli indirizzi.
//
// È statico apposta. Sarebbe possibile leggere il cookie della lingua e
// tradurre nome e descrizione, ma il manifesto lo scarica il browser una volta
// sola e poi se lo tiene: renderlo dinamico vorrebbe dire generarlo a ogni
// richiesta per un testo che quasi nessuno legge — il nome sotto l'icona è
// "Bilancino" in tutte e due le lingue.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bilancino",
    short_name: "Bilancino",
    description:
      "Budget personale e scheda cliente in un unico posto, per chi ha qualche cliente e non la partita IVA.",
    lang: "it",
    // Chi installa l'app vuole l'app, non la pagina di presentazione: si apre
    // sulla Panoramica. Chi non ha la sessione viene mandato al login da lì,
    // che è comunque un passo avanti rispetto alla home del sito.
    start_url: "/dashboard",
    // Tutto il sito resta dentro l'app installata: senza, uscire sulla
    // privacy o sulle guide aprirebbe il browser.
    scope: "/",
    display: "standalone",
    background_color: "#fbfbf8",
    theme_color: "#fbfbf8",
    categories: ["finance", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android ritaglia l'icona nella forma del lanciatore: questa è piena
      // fino ai bordi e col simbolo dentro la zona sicura, altrimenti su un
      // lanciatore a cerchio le si tagliano gli angoli.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
