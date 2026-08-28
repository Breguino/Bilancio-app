// Next carica questo file una volta all'avvio di ogni runtime. Serve a
// inizializzare Sentry sul server; nel browser ci pensa
// sentry.client.config.ts.
//
// L'edge non c'è apposta. L'unica cosa che gira lì è il middleware, cioè una
// manciata di righe che reindirizzano chi non ha la sessione: inizializzare
// Sentry anche lì portava il middleware da 84 a 142 kB — cinquanta kilobyte
// caricati a ogni singola richiesta del sito per sorvegliare trenta righe di
// redirect. Misurato, non stimato.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}
