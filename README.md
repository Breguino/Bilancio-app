# Bilancino — versione multi-utente

**Sito live:** https://bilancino-app.vercel.app

Budget personale + CRM contatti, con **account reali** (login/registrazione) e dati
separati per ogni utente. A differenza della versione precedente (un Artifact statico),
questa è un'applicazione vera: **Next.js** per il frontend/backend e **Supabase**
(Postgres + autenticazione) per dati e login.

La sicurezza multi-utente non è "finta": ogni tabella nel database ha una policy di
**Row Level Security** che impedisce a un utente di leggere o scrivere i dati di un
altro, applicata dal database stesso — non solo dal codice dell'app.

## Prerequisiti

Su questo computer **Node.js non è installato**. Serve per installare le librerie e
avviare il progetto in locale.

1. Scarica e installa Node.js (versione LTS) da **https://nodejs.org**
2. Verifica l'installazione aprendo un nuovo terminale ed eseguendo:
   ```
   node --version
   npm --version
   ```

## 1. Crea il database (Supabase, gratuito)

1. Vai su **https://supabase.com**, crea un account gratuito e un nuovo progetto.
2. Nel progetto, apri **SQL Editor → New query**, incolla il contenuto di
   [`supabase/schema.sql`](supabase/schema.sql) ed esegui (▶ Run). Questo crea le
   tabelle `transactions`, `budgets`, `contacts` con le policy di sicurezza.
3. Vai su **Project Settings → API**: copia **Project URL** e **anon public key**.
4. Vai su **Authentication → Providers** e assicurati che "Email" sia abilitato
   (di default lo è). Per test rapidi puoi disattivare "Confirm email" in
   **Authentication → Settings**, così i nuovi account sono attivi subito.

## 2. Configura il progetto in locale

Nella cartella `bilancino-app`:

```bash
npm install
cp .env.local.example .env.local
```

Apri `.env.local` e incolla i valori copiati da Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-anon-key
```

Poi avvia il server di sviluppo:

```bash
npm run dev
```

Apri **http://localhost:3000** — registra un account, conferma l'email (se richiesto),
accedi. Prova ad aprire la stessa app in una finestra anonima con un secondo account:
ognuno vedrà solo i propri movimenti e contatti.

## 3. Metti online il sito (deploy)

Il modo più semplice è **Vercel** (gratuito per progetti personali), che compila il
progetto lui stesso — non serve Node.js sul computer per questo passaggio:

1. Crea un repository su GitHub e caricaci questa cartella (`git init`, `git add .`,
   `git commit`, poi collega il repo remoto e fai push).
2. Vai su **https://vercel.com**, "Add New Project", importa il repository.
3. In "Environment Variables" aggiungi le stesse due variabili di `.env.local`.
4. Deploy. Otterrai un URL pubblico reale (es. `bilancino.vercel.app`).

## Cosa c'è già

- Registrazione / accesso / uscita con Supabase Auth
- **Panoramica**: entrate, uscite, netto del mese, aggiungi/elimina movimenti
- **Budget**: limite di spesa per categoria, indicatore "budget assegnato vs entrate"
- **Obiettivi**: crea obiettivi di risparmio, aggiungi contributi, barra di progresso
- **Confronta**: due mesi a confronto, categoria per categoria, con delta colorati
- **Annuale**: totali e classifica di spesa su tutto lo storico
- **Contatti (CRM)**: elenco clienti/contatti con nome, email, telefono, note
- **Movimenti collegati ai contatti**: ogni movimento può essere associato a un cliente; la pagina Contatti mostra quanto ha fruttato ciascun cliente
- **Esporta CSV**: scarica tutti i movimenti da "Panoramica"
- **Tema chiaro/scuro**: selezionabile dall'icona in alto a destra
- Ogni dato è isolato per utente a livello di database (Row Level Security)

## Progetto Supabase già creato

Il progetto **"bilancino"** è già stato creato nell'organizzazione Supabase e lo
schema (incluso `goals`) è già applicato — non serve rifare il passaggio 1 del
setup, `.env.local` ha già le chiavi corrette.
