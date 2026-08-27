// Intestazioni di sicurezza. Vercel manda già `strict-transport-security`, il
// resto no: senza queste il sito si lascia incorniciare in un iframe da
// chiunque (clickjacking) e manda l'indirizzo completo della pagina, con
// eventuali parametri, a ogni sito esterno che linkiamo.
//
// La Content-Security-Policy qui è volutamente parziale: le sole direttive
// che non possono rompere niente. Una `script-src` completa richiederebbe un
// nonce per gli script che Next e Google Analytics scrivono in pagina, e una
// policy sbagliata non degrada — spegne il sito.
const securityHeaders = [
  // Nessuno può metterci dentro un iframe. `frame-ancestors` è la versione
  // moderna, X-Frame-Options resta per i browser che ancora non la leggono.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Un file caricato come .txt non viene eseguito come script perché il
  // browser "indovina" un tipo diverso da quello dichiarato.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Verso siti esterni parte solo l'origine (https://bilancino.it.com), non il
  // percorso: i link con token dentro l'URL non finiscono nei log altrui.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Non usiamo nessuna di queste: dichiararlo evita che uno script di terze
  // parti possa chiederle a nome nostro.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Non serve annunciare al mondo con che cosa è fatto il sito.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
