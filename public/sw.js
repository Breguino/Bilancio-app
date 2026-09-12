// Il service worker di Bilancino. Fa una cosa sola, ed è quello il punto.
//
// Un service worker resta installato nel browser di chi visita il sito e
// intercetta le richieste anche dopo che il codice è cambiato: sbagliarlo vuol
// dire servire pagine vecchie a gente che non ha modo di accorgersene, e
// toglierlo da remoto è lento. Per un'app di bilancio, poi, un saldo vecchio
// mostrato con sicurezza è peggio di un errore.
//
// Quindi qui NON si mette in cache niente che possa invecchiare: né pagine, né
// risposte del database, né niente di ciò che riguarda l'utente. Solo i file
// sotto /_next/static/, che hanno l'impronta del contenuto nel nome — se il
// contenuto cambia, cambia il nome, e il file vecchio semplicemente non viene
// più chiesto. Quelli non possono diventare stantii per costruzione.
//
// Per tutto il resto il service worker non chiama respondWith(): la richiesta
// passa al browser come se lui non ci fosse.
//
// Per disinstallarlo un giorno: pubblicare al suo posto un file con dentro
// self.registration.unregister(), non cancellarlo e basta.

const VERSIONE = "v1";
const CACHE = `bilancino-statici-${VERSIONE}`;

self.addEventListener("install", (event) => {
  // Niente pre-caricamento: si riempie da sé con quello che serve davvero.
  // skipWaiting fa entrare subito in servizio la versione nuova, invece di
  // lasciarla in attesa che si chiudano tutte le schede aperte.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nomi = await caches.keys();
      await Promise.all(
        nomi.filter((n) => n.startsWith("bilancino-statici-") && n !== CACHE).map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const richiesta = event.request;
  if (richiesta.method !== "GET") return;

  let url;
  try {
    url = new URL(richiesta.url);
  } catch {
    return;
  }

  // Solo il nostro dominio, e solo i file con l'impronta nel nome.
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/_next/static/")) return;

  event.respondWith(
    (async () => {
      const salvato = await caches.match(richiesta);
      if (salvato) return salvato;
      const risposta = await fetch(richiesta);
      // Si conserva solo quello che è arrivato davvero: mettere in cache un
      // 404 o una risposta parziale vorrebbe dire servirlo per sempre.
      if (risposta.ok) {
        const cache = await caches.open(CACHE);
        cache.put(richiesta, risposta.clone());
      }
      return risposta;
    })()
  );
});
