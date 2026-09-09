# Bilancino — convenzioni di lavoro

## Il diario delle novità si scrive nella stessa sessione

**Ogni volta che esce una modifica che un utente può notare, la voce su
`/novita` si scrive subito, nella stessa sessione, prima di unire.** Non
"dopo", non "quando ce ne ricordiamo": il diario si è già fermato una volta
per tre settimane — dal 22 agosto al 9 settembre 2026 — mentre uscivano il
ridisegno di tutte le schermate, la leggibilità dei colori, sette difetti di
accessibilità, tre buchi di sicurezza e le email riparate. Una pagina che si
intitola *"Cosa è cambiato, aggiornamento dopo aggiornamento"* e tace per tre
settimane dice il contrario di quello che vuole dire.

### Dove

`lib/i18n/dictionaries/it.ts` e `en.ts`, campo `novita.entries`. **Vanno
aggiornati tutti e due**: ci sono test che rifiutano una lingua senza l'altra.

```ts
{
  date: "2026-09-09",          // ISO, mai la data scritta a parole
  items: [
    "Frase piana, dal punto di vista di chi usa l'app.",
  ],
}
```

La voce più recente va **in cima**: l'intestazione della pagina legge
`entries[0].date` come "ultimo aggiornamento", quindi l'ordine non è estetica.

La data la formatta la pagina con `Intl`, in italiano e in inglese. Nel
dizionario ci va solo l'ISO.

### Cosa ci va, e cosa no

Ci va quello che **un utente può accorgersi che è cambiato**: schermate,
funzioni, testi, colori, difetti corretti che gli capitavano davvero.

Non ci va il lavoro invisibile riga per riga — CI, test, lint, refactoring,
chiavi di configurazione. Se in un rilascio ce n'è parecchio, si riassume in
una frase sola ("Sotto il cofano: …"). Questo è un diario per chi usa
Bilancino, non un registro dei commit.

### Come si scrive

Nella voce che la pagina ha già: italiano piano, concreto, spesso col difetto
raccontato prima della correzione ("le email avevano il logo rotto: …
riparato"). Niente numeri di versione, niente gergo, niente promesse.

**Le date vengono da `git log`, non dalla memoria.** La pagina promette di
raccontare quello che è successo davvero: se le date sono approssimate, la
promessa salta.

## Prima di aprire una PR

`npx tsc --noEmit` · `npx next lint --max-warnings=0` · `npm test` · `npm run build`

Girano comunque in CI su ogni PR (`.github/workflows/controlli.yml`), ma
scoprirlo prima costa meno.
