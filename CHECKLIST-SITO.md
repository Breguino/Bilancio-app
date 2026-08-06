# Checklist del sito — Bilancino

Verifica del **6 agosto 2026** su https://bilancino-app.vercel.app e https://bilancino.it.com
(build/test in locale + controlli diretti sul sito in produzione, senza credenziali di accesso).

## ✅ Cose che vanno bene

- Build di produzione (`npm run build`) completa senza errori, 39 rotte generate correttamente.
- Test automatici: **20/20 passano** (import CSV, redirect sicuro dopo login, movimenti ricorrenti).
- Homepage (`/`) carica correttamente, contenuto coerente, nessun errore.
- Pagine marketing pubbliche tutte **200 OK**: `/chi-siamo`, `/cosa-offriamo`, `/il-servizio`, `/novita`, `/privacy`, `/termini`.
- `/guide` e le 3 guide figlie (conti personali e lavoro, tasse, Excel vs app) — tutte 200 OK, contenuto leggibile.
- `/login` e `/signup` — form presenti (Google + email/password), nessun errore visibile.
- Chi è già loggato viene rimandato automaticamente da `/login`/`/signup` a `/dashboard` (verificato nel codice).
- Le pagine riservate (`/dashboard`, `/budget`, `/goals`, `/compare`, `/yearly`, `/contacts`, ecc.) rimandano correttamente al login chi non ha effettuato l'accesso, con `?next=` per tornare dove si era diretti dopo il login.
- Protezione da **open redirect**: il parametro `?next=` dopo il login è validato (`lib/safe-redirect.ts`, con test dedicato) e non può rimandare fuori dal sito.
- `robots.txt` e `sitemap.xml` si generano e sono raggiungibili, con le rotte private correttamente escluse (`Disallow`).
- Tema chiaro/scuro e selettore lingua presenti nell'header; menu mobile (hamburger) presente per la navigazione su schermi stretti.
- Il dominio personalizzato `bilancino.it.com` è raggiungibile e funziona come `bilancino-app.vercel.app`.

## ⚠️ Non verificabile in questa sessione

Non avendo credenziali d'accesso e per non creare dati finti nel database di produzione, non ho potuto testare dal vivo:

- Login/registrazione reali (email+password e Google OAuth).
- Le sezioni riservate: Panoramica, Budget, Obiettivi, Confronta, Annuale, Statistiche, Contatti/CRM, ricorrenze, cestino, ricevute PDF.
- Esporta CSV e importazione CSV nel prodotto reale.
- Iscrizione/disiscrizione alla newsletter (il form nel footer c'è, ma non ho inviato un'email vera).
- Cancellazione account.
- Resa visiva reale nel browser (colori, layout, responsive): l'ambiente di test non riusciva a raggiungere il sito con un browser Chromium, quindi ho controllato solo l'HTML restituito dal server, non lo schermo.

## ❌ Problemi trovati

1. **Un indirizzo inesistente rimanda al login invece di mostrare "pagina non trovata"**
   Esempio: `https://bilancino-app.vercel.app/pagina-che-non-esiste-xyz` risponde con un redirect (307) a `/login?next=/pagina-che-non-esiste-xyz`, invece di un 404.
   Causa: in `lib/supabase/middleware.ts` ogni indirizzo non esplicitamente elencato come pubblico viene trattato come "riservato" e chi non è loggato viene mandato al login — anche se quella pagina non esiste affatto. La cosa funziona bene solo per gli indirizzi sotto `/guide/...`, che essendo in whitelist come prefisso pubblico arrivano correttamente alla pagina 404 vera e propria (`not-found.tsx`).
   Effetto pratico: un link rotto, un refuso digitato nell'URL o un vecchio indirizzo mostrano la schermata di login invece di un messaggio "pagina non trovata" — confusionario per chi arriva sul sito da un link sbagliato o da un motore di ricerca.

2. **Il README indica un dominio diverso da quello canonico usato dal sito**
   Il `README.md` riporta come "Sito live" `https://bilancino-app.vercel.app`, ma `sitemap.xml`, `robots.txt` e i meta tag SEO generati dall'app usano `https://bilancino.it.com` come dominio canonico. Non blocca nulla (entrambi gli indirizzi funzionano), ma è un'inconsistenza da sistemare nella documentazione.

## Come è stata fatta questa verifica

- `npm install`, `npm run build`, `npm test` in locale.
- Richieste dirette (`curl`) su tutte le pagine pubbliche in produzione, controllando codici di stato HTTP e redirect.
- Lettura del codice di autenticazione/middleware, redirect sicuro e componenti di navigazione.
- Non è stato possibile testare con un vero browser (Chromium) le pagine in produzione né le sezioni che richiedono login, per mancanza di credenziali e per non generare dati finti nel database reale.
