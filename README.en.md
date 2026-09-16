[Italiano](README.md) · **English**

# Bilancino

Personal budgeting and client notes in one place, for people who have a few
clients but not a registered business. A complete application with real accounts,
per-user data isolation, and bank statement import via CSV — without asking anyone
for their banking credentials.

**Live:** [bilancino.it.com](https://bilancino.it.com) · **Demo, no sign-up:**
[/demo](https://bilancino.it.com/demo) · **Changelog:**
[/novita](https://bilancino.it.com/novita)

Next.js 16 · React 19 · TypeScript · Supabase (Postgres + Auth) · Tailwind · Vitest

> The application interface, the code comments and the commit history are in
> Italian. This file is here so the engineering is readable without them.

---

## What to look at, if you have five minutes

Rather than listing adjectives, these are the places where the code does something
worth reading.

**[`supabase/schema.sql`](supabase/schema.sql) — security lives in the database, not in the app.**
Thirty-one Row Level Security policies across ten tables. One user cannot read
another's data even if the application code had a flaw: Postgres refuses the row.
Tables that no public role should ever touch carry the denial written out in full,
so that a table with RLS on and no policies doesn't look like an oversight.

**[`lib/cron-auth.ts`](lib/cron-auth.ts) — checks close when something is missing.**
The cron route check used to compare the header against
``"Bearer " + process.env.CRON_SECRET``. With the variable set, it works. Without it,
interpolating `undefined` produces the literal string `"Bearer undefined"` — and
anyone sending exactly that gets in. A cron job that emails every subscriber was
one forgotten environment variable away from being open to the world. Now no key
means no entry, and the comparison runs in constant time.

**[`lib/routes.test.ts`](lib/routes.test.ts) — a test that reads the real directories.**
The list of private pages is maintained by hand. Anyone who adds a page under
`app/(app)` and forgets to declare it gets no error at all: that page simply
becomes public, with somebody's financial records on it. The test enumerates the
filesystem and demands that every page be declared, taking "remembering" out of
the path.

**[`lib/webhooks/resend-signature.ts`](lib/webhooks/resend-signature.ts) — signature verification with no dependency.**
The Svix scheme implemented on `node:crypto`: HMAC-SHA256 over
`id.timestamp.body`, a freshness window against replay, constant-time comparison.
The body is read raw rather than as JSON, because re-serialising an object changes
whitespace and key order, and the signature stops matching.

**[`lib/csv-export.ts`](lib/csv-export.ts) + [`lib/csv-import.test.ts`](lib/csv-import.test.ts) — the round trip.**
CSV injection protection (a field starting with `=`, `+`, `-` or `@` is executed
as a formula by Excel), plus a test that covers the whole loop: a file exported
from Bilancino must be able to come back in. It has been broken before.

---

## Tests

**171 tests across 18 files**, via `npm test`. They cover pure logic — dates,
statistics, CSV parsing, authorisation, signatures — not rendering.

The standard they were written to: **a test you have never watched fail proves
nothing.** Each of these was checked by deliberately breaking the code it guards,
and the failure messages are written to say what is missing, not merely that
something is wrong.

| Area | File | Tests |
|---|---|---|
| Dates and months | `lib/month.test.ts` | 25 |
| Statistics (linear regression, standard deviation, confidence interval) | `lib/statistics.test.ts` | 22 |
| CSV import | `lib/csv-import.test.ts` | 20 |
| CSV export and formula guard | `lib/csv-export.test.ts` | 13 |
| Webhook signatures | `lib/webhooks/resend-signature.test.ts` | 11 |
| Private routes | `lib/routes.test.ts` | 9 |
| Currencies | `lib/currency.test.ts` | 9 |
| …and eleven more files | | 62 |

## Continuous integration

On every pull request and every push to `main`
([`.github/workflows/controlli.yml`](.github/workflows/controlli.yml)):

```
npx tsc --noEmit          # types
npx eslint . --max-warnings=0
npm test                  # 171 tests
npm run build
```

`--max-warnings=0` because warnings, once they accumulate, stop being read.

## How it is built

```
app/
  (app)/          private pages: overview, budgets, contacts, goals,
                  recurring transactions, statistics, year comparison, trash
  api/            CSV export, cron jobs (reminders, newsletter), Resend webhook
  guide/          public content
lib/
  supabase/       three clients: user session, service role, proxy
  i18n/           Italian and English dictionaries, with anti-drift tests
  statistics.ts   linear regression, standard deviation, confidence intervals
  csv-import.ts   tolerant parsing: decimal separator inferred from position
proxy.ts          protection of private routes (was middleware.ts until Next 15)
supabase/
  schema.sql      tables, RLS policies, triggers, functions
```

A few decisions worth explaining:

- **One currency per account, not per transaction.** No conversion, no exchange
  rates, no dependency on a rate provider: what changes is how the figures are
  written, not the figures.
- **The service worker serves nothing offline.** Data always comes from the
  server, so what you read is what is actually there — a stale balance shown with
  confidence would be worse than an error. Only the site's own files are cached.
- **The decimal separator is inferred from position.** In `1.234,50` it is the
  comma; in `1,234.50` it is the dot. The Italian format used to be assumed, and
  an English-formatted bank statement was read wrong by a factor of a thousand,
  silently.

## Running it locally

Requires Node.js 20.9 or later.

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

For the database: create a free project at [supabase.com](https://supabase.com),
run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor, and copy the
URL and anon key from *Project Settings → API* into `.env.local`. The full list of
variables is in [`.env.local.example`](.env.local.example).

To see the data isolation at work: register two accounts and open the second in a
private window. Neither sees the other's transactions, and not because the
interface decided so.

---

An independent project by Angelo Bregu.
