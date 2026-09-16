# Bilancino

Budget personale e schede cliente in un unico posto, per chi ha qualche cliente
e non la partita IVA. Applicazione completa con account reali, dati isolati per
utente e import dell'estratto conto in CSV — senza chiedere a nessuno le
credenziali della banca.

**Live:** [bilancino.it.com](https://bilancino.it.com) · **Demo senza registrazione:**
[/demo](https://bilancino.it.com/demo) · **Cosa è cambiato:** [/novita](https://bilancino.it.com/novita)

Next.js 16 · React 19 · TypeScript · Supabase (Postgres + Auth) · Tailwind · Vitest

---

## Cosa guardare, se hai cinque minuti

Invece di elencare aggettivi, questi sono i punti in cui il codice fa qualcosa
che vale la pena leggere.

**[`supabase/schema.sql`](supabase/schema.sql) — la sicurezza sta nel database, non nell'app.**
Trentuno policy di Row Level Security su dieci tabelle. Un utente non può leggere
i dati di un altro nemmeno se il codice dell'applicazione avesse un difetto: è
Postgres a rifiutare la riga. Le tabelle che non devono essere toccate dai ruoli
pubblici hanno il divieto scritto per esteso, così una tabella con RLS accesa e
nessuna policy non sembra una dimenticanza.

**[`lib/cron-auth.ts`](lib/cron-auth.ts) — i controlli si chiudono quando manca qualcosa.**
Il controllo delle rotte cron confrontava l'intestazione con ``"Bearer " + process.env.CRON_SECRET``.
Con la variabile impostata funziona; senza, l'interpolazione di `undefined` produce
la stringa `"Bearer undefined"` — e chiunque mandi esattamente quella entra. Un
cron che invia email a tutti gli iscritti si apriva al mondo per una variabile
dimenticata. Ora senza chiave non entra nessuno, e il confronto è a tempo costante.

**[`lib/routes.test.ts`](lib/routes.test.ts) — un test che legge le cartelle vere.**
L'elenco delle pagine riservate è scritto a mano. Chi aggiunge una pagina sotto
`app/(app)` e si dimentica di dichiararla non riceve nessun errore: quella pagina
diventa semplicemente pubblica, con i movimenti di qualcuno dentro. Il test
enumera il filesystem e pretende che ogni pagina sia dichiarata, togliendo il
"ricordarsene" dal percorso.

**[`lib/webhooks/resend-signature.ts`](lib/webhooks/resend-signature.ts) — verifica di firma senza dipendenze.**
Schema Svix implementato con `node:crypto`: HMAC-SHA256 su `id.timestamp.corpo`,
finestra di freschezza contro il replay, confronto a tempo costante. Il corpo si
legge grezzo e non come JSON, perché riserializzare un oggetto cambia spazi e
ordine delle chiavi e la firma non torna più.

**[`lib/csv-export.ts`](lib/csv-export.ts) + [`lib/csv-import.test.ts`](lib/csv-import.test.ts) — il giro completo.**
Protezione contro la CSV injection (un campo che inizia per `=`, `+`, `-` o `@`
viene eseguito come formula da Excel), e un test che verifica il giro intero: un
file esportato da Bilancino deve poter rientrare in Bilancino. È già successo che
non fosse vero.

---

## Test

**171 test in 18 file**, su `npm test`. Sono test sulla logica pura — date,
statistica, parsing CSV, autorizzazione, firme — non sul rendering.

Il criterio con cui sono stati scritti: **un test che non è mai stato visto
fallire non dimostra niente.** Ognuno di questi è stato provato rompendo di
proposito il codice che sorveglia, e il messaggio di errore è pensato per dire
cosa manca, non solo che qualcosa non va.

| Area | File | Test |
|---|---|---|
| Date e mesi | `lib/month.test.ts` | 25 |
| Statistica (regressione, deviazione, intervallo di confidenza) | `lib/statistics.test.ts` | 22 |
| Import CSV | `lib/csv-import.test.ts` | 20 |
| Export CSV e protezione formule | `lib/csv-export.test.ts` | 13 |
| Firma dei webhook | `lib/webhooks/resend-signature.test.ts` | 11 |
| Rotte riservate | `lib/routes.test.ts` | 9 |
| Valute | `lib/currency.test.ts` | 9 |
| …e altri undici file | | 62 |

## Controlli automatici

Su ogni pull request e su ogni push verso `main`
([`.github/workflows/controlli.yml`](.github/workflows/controlli.yml)):

```
npx tsc --noEmit          # tipi
npx eslint . --max-warnings=0
npm test                  # 171 test
npm run build
```

`--max-warnings=0` perché gli avvisi, se si accumulano, smettono di essere letti.

## Com'è fatto

```
app/
  (app)/          pagine riservate: panoramica, budget, contatti, obiettivi,
                  ricorrenti, statistiche, confronto anni, cestino
  api/            export CSV, cron (promemoria, newsletter), webhook Resend
  guide/          contenuti pubblici
lib/
  supabase/       tre client: sessione utente, service role, proxy
  i18n/           dizionari italiano e inglese, con test anti-deriva
  statistics.ts   regressione lineare, deviazione standard, intervalli
  csv-import.ts   parsing tollerante: separatore decimale dedotto dalla posizione
proxy.ts          protezione delle rotte riservate (era middleware.ts fino a Next 15)
supabase/
  schema.sql      tabelle, policy RLS, trigger, funzioni
```

Qualche scelta che vale la pena spiegare:

- **Una valuta per account, non per movimento.** Nessuna conversione, nessun
  tasso di cambio, nessuna dipendenza da un fornitore di dati: cambia come si
  scrivono le cifre, non le cifre.
- **Il service worker non serve niente offline.** I dati arrivano sempre dal
  server, così quello che leggi è quello che c'è davvero — un saldo vecchio
  mostrato con sicurezza sarebbe peggio di un errore. In memoria restano solo i
  file del sito.
- **Il separatore decimale si deduce dalla posizione.** In `1.234,50` è la
  virgola, in `1,234.50` è il punto. Prima si dava per scontato il formato
  italiano, e un estratto conto inglese veniva letto sbagliato di mille volte,
  in silenzio.

## Provarlo in locale

Serve Node.js 20.9 o superiore.

```bash
npm install
cp .env.local.example .env.local   # poi riempi i valori
npm run dev
```

Per il database: su [supabase.com](https://supabase.com) crea un progetto
gratuito, esegui [`supabase/schema.sql`](supabase/schema.sql) nell'SQL Editor, e
copia URL e chiave anonima da *Project Settings → API* dentro `.env.local`.
L'elenco completo delle variabili sta in
[`.env.local.example`](.env.local.example).

Per vedere la separazione dei dati all'opera: registra due account e apri il
secondo in una finestra anonima. Nessuno dei due vede i movimenti dell'altro, e
non perché lo decida l'interfaccia.

---

Progetto indipendente di Angelo Bregu.
