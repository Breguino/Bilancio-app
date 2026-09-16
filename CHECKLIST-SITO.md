# Verifica del sito

Ultima verifica: **16 settembre 2026**, su [bilancino.it.com](https://bilancino.it.com).
Controlli diretti sul sito in produzione, più build, tipi, lint e test in locale.
Senza credenziali di accesso: le sezioni riservate sono verificate dall'esterno
(che rispondano negando), non dall'interno.

Questo file è un referto datato, non un documento vivo. Se le cifre qui sotto non
tornano con la realtà, è perché la verifica è vecchia — non perché il sito sia cambiato
di nascosto.

## Verificato

**Raggiungibilità e protezione**

- **21 pagine pubbliche su 21** rispondono 200: home, novità, chi sono, cosa offriamo,
  il servizio, le tre guide più il loro indice, privacy, termini, registrazione,
  accesso, demo, reimposta password, disiscrizione, `robots.txt`, `sitemap.xml`,
  `manifest.webmanifest`, `sw.js`, `icon.svg`.
- **12 rotte riservate su 12** rimandano al login con `?next=` per tornare dove si
  stava andando: panoramica, budget, contatti, impostazioni, statistiche, annuale,
  confronto, obiettivi, ricorrenti, cestino, newsletter, export CSV.
- **Le due rotte cron rispondono 401** senza chiave e con una chiave sbagliata. Il
  controllo si chiude quando la variabile d'ambiente manca, invece di aprirsi
  (`lib/cron-auth.ts`).
- **Un cookie di sessione inventato viene rifiutato**: la rotta riservata redirige
  comunque al login, quindi il client valida davvero il token invece di fidarsi
  della sua presenza.
- **Protezione da open redirect**: il parametro `?next=` è validato
  (`lib/safe-redirect.ts`, con test) e non può rimandare fuori dal sito.
- **Un indirizzo inesistente dà 404**, non un redirect al login — e adesso c'è un
  test che impedisce la regressione opposta (vedi sotto).

**Resa nel browser** — verificata il 15 settembre 2026 con Chromium, a 1280 px e a
390 px, in tema chiaro e scuro:

- nessuno scorrimento orizzontale a nessuna delle due larghezze;
- un solo `<h1>` per pagina, tutte le immagini con `alt`, nessun link o pulsante
  privo di nome accessibile;
- il sito si legge per intero anche con JavaScript disattivato.

**Qualità del codice** — `npx tsc --noEmit`, `npx eslint . --max-warnings=0`,
`npm test` (**171 test in 18 file**) e `npm run build`: tutti verdi, e tutti girano
in CI su ogni pull request.

## Non verificato

Senza credenziali e per non creare dati finti nel database di produzione, dall'esterno
non si possono provare:

- login e registrazione reali (email/password e Google), e quindi tutto ciò che sta
  dietro l'accesso: panoramica, budget, obiettivi, statistiche, contatti, ricorrenze,
  cestino, ricevute PDF, import ed export CSV nel prodotto vero;
- la cancellazione dell'account;
- **quante visite riceve il sito**: Vercel Analytics è installato, ma i dati non sono
  accessibili da qui. Senza, non si distingue "nessuno arriva" da "arrivano e se ne
  vanno" — due problemi diversi con due rimedi diversi.

## Aperto

- **Gmail rifiuta le email inviate dal dominio.** Risposta testuale di Google:
  *«likely unsolicited mail … this message has been blocked»*. Non è un difetto di
  configurazione — DKIM, SPF del dominio di busta e MX dei rimbalzi sono corretti e
  verificati record per record. È reputazione di un dominio nuovo. Dal 15 settembre
  ogni rimbalzo viene registrato con il motivo per esteso
  (`app/api/webhooks/resend/route.ts`).
- **Protezione dalle password compromesse spenta** su Supabase. È l'unica voce aperta
  negli advisor di sicurezza del progetto, e si attiva solo dal pannello.
- **Cadute di connessione intermittenti**: in questa verifica, 3 richieste su 36 non
  hanno ricevuto alcuna risposta HTTP — nessun errore del server, proprio nessuna
  risposta, e la stessa pagina risponde correttamente al tentativo successivo. Si
  osservano da giorni, a frequenza variabile, e **non sono state attribuite**. Sono
  cadute di trasporto, non errori dell'applicazione. Il sospetto è che riguardino il
  suffisso `.it.com`, che è già risultato bloccato su due reti diverse.

## Difetti trovati e chiusi

Il valore di questo elenco non è che i difetti ci fossero, ma **come sono stati
trovati**: misurando, non aspettando che qualcuno se ne lamentasse.

| Difetto | Causa | Chiuso con |
|---|---|---|
| Un indirizzo inesistente rimandava al login invece del 404 | ogni percorso non elencato come pubblico era trattato come riservato | elenco esplicito delle rotte riservate, più un test che legge il filesystem e pretende che ogni pagina sotto `app/(app)` sia dichiarata |
| Le rotte cron si aprivano a chiunque mandasse `Bearer undefined` | l'interpolazione di una variabile d'ambiente mancante produceva quella stringa | controllo che si chiude senza chiave, confronto a tempo costante |
| Il logo era rotto in **ogni email mai inviata** | `/logo.png` non esisteva: il file era solo in SVG, che Gmail scarta | PNG generato dall'SVG, e tema delle email in un modulo condiviso |
| L'import CSV leggeva `1,234.50` come uno virgola due | si dava per scontato il formato italiano | separatore decimale dedotto dalla posizione, con il giro completo export → import sotto test |
| Senza JavaScript il sito era l'apertura e poi un muro bianco | i blocchi animati partono invisibili e li accende solo JavaScript | regola in `<noscript>`, verificata rendendo le pagine col browser a JavaScript spento |
| L'export CSV usciva con cifre nude | la valuta non era scritta da nessuna parte | codice della valuta nell'intestazione, e l'import sa rileggerlo |
| La ricerca fra i movimenti esisteva ma nessuno la trovava | era dietro il pulsante "Altri filtri", che non annunciava di contenerla | casella in vista sopra l'elenco, e ricerca anche su categoria e nome del contatto |
| Quindici `any` sparsi fra le pagine | il client Supabase era senza tipi, e `@supabase/ssr` era fermo a una versione che li faceva collassare | tipi generati dallo schema vero, dipendenza aggiornata, zero `any` |

**Privacy e GDPR** — in una revisione mirata sulla pagina `/privacy` sono emersi e
sono stati chiusi: titolare del trattamento indicato solo con un recapito e senza
nome (art. 13), base giuridica non dichiarata, trasferimento extra-UE senza base
legale, diritti dell'interessato non elencati, periodo di conservazione non
dichiarato, età minima non dichiarata in `/termini`.

## Come è stata fatta

- `npm install`, `npx tsc --noEmit`, `npx eslint . --max-warnings=0`, `npm test`,
  `npm run build` in locale.
- Richieste dirette con `curl` su tutte le pagine pubbliche e riservate in produzione,
  con tre tentativi per indirizzo — perché contare una caduta di trasporto come una
  pagina rotta falserebbe il referto.
- Rendering reale con Chromium a due larghezze e due temi, compreso il caso con
  JavaScript disattivato.
- Lettura diretta dei record DNS (SPF, DKIM, DMARC, MX) via DNS-over-HTTPS, e
  confronto byte per byte della chiave DKIM con quella attesa dal servizio di invio.
- Interrogazione degli advisor di sicurezza del database.
