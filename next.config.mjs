import { withSentryConfig } from "@sentry/nextjs";

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
  // Verso siti esterni parte solo l'origine (il dominio nudo), non il
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
  // Fa caricare instrumentation.ts all'avvio di ogni runtime, che è dove
  // Sentry si inizializza per server ed edge. Su Next 14 è ancora dietro a
  // "experimental"; dalla 15 è il comportamento normale.
  experimental: {
    instrumentationHook: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Il pacchetto di Sentry porta con sé il tracing delle prestazioni e il
  // Session Replay. Qui non se ne usa nessuno dei due, ma restano nel bundle
  // finché non glielo si dice: queste bandiere li fanno togliere in fase di
  // compilazione invece che caricare a ogni visita codice che non parte mai.
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      })
    );
    return config;
  },
};

// Sentry avvolge la configurazione per compilare i suoi file e, quando c'è un
// token, caricare le source map così gli stack trace sono leggibili invece
// che minificati.
//
// Senza le variabili d'ambiente non succede niente di tutto questo: nessun
// caricamento, nessuna chiamata, e il client resta spento. Il sito continua a
// compilare e a girare identico — è quello che accade oggi, finché il DSN non
// viene impostato su Vercel.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Niente rumore nel log di build quando il token non c'è.
  silent: true,
  // Toglie dal pacchetto il logger di debug di Sentry: è peso che in
  // produzione non serve a nessuno.
  disableLogger: true,
});
