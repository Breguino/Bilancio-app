-- Bilancino — schema con Row Level Security
-- Incolla questo script nell'SQL Editor di Supabase (Project > SQL Editor > New query) ed eseguilo.
-- Ogni tabella e' isolata per utente tramite user_id + policy RLS: un utente non puo'
-- mai leggere o scrivere righe di un altro utente, a prescindere da eventuali bug nel
-- codice client: la sicurezza e' applicata dal database stesso.

create extension if not exists "pgcrypto";

-- ---------- Movimenti (entrate/uscite) ----------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  date date not null,
  description text not null,
  category text,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions
  for select using ((select auth.uid()) = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check ((select auth.uid()) = user_id);
create policy "transactions_update_own" on public.transactions
  for update using ((select auth.uid()) = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using ((select auth.uid()) = user_id);

-- ---------- Budget per categoria ----------
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  category text not null,
  monthly_limit numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

alter table public.budgets enable row level security;

create policy "budgets_select_own" on public.budgets
  for select using ((select auth.uid()) = user_id);
create policy "budgets_insert_own" on public.budgets
  for insert with check ((select auth.uid()) = user_id);
create policy "budgets_update_own" on public.budgets
  for update using ((select auth.uid()) = user_id);
create policy "budgets_delete_own" on public.budgets
  for delete using ((select auth.uid()) = user_id);

-- ---------- Obiettivi di risparmio ----------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null,
  target numeric(12, 2) not null,
  saved numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals_select_own" on public.goals
  for select using ((select auth.uid()) = user_id);
create policy "goals_insert_own" on public.goals
  for insert with check ((select auth.uid()) = user_id);
create policy "goals_update_own" on public.goals
  for update using ((select auth.uid()) = user_id);
create policy "goals_delete_own" on public.goals
  for delete using ((select auth.uid()) = user_id);

create index if not exists goals_user_idx on public.goals (user_id);

-- ---------- CRM: contatti/clienti ----------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "contacts_select_own" on public.contacts
  for select using ((select auth.uid()) = user_id);
create policy "contacts_insert_own" on public.contacts
  for insert with check ((select auth.uid()) = user_id);
create policy "contacts_update_own" on public.contacts
  for update using ((select auth.uid()) = user_id);
create policy "contacts_delete_own" on public.contacts
  for delete using ((select auth.uid()) = user_id);

-- ---------- Collega un movimento a un contatto/cliente (opzionale) ----------
alter table public.transactions
  add column if not exists contact_id uuid references public.contacts (id) on delete set null;

-- ---------- Indici utili ----------
create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);
create index if not exists contacts_user_name_idx on public.contacts (user_id, name);
create index if not exists transactions_contact_idx on public.transactions (contact_id);

-- ---------- Movimenti ricorrenti ----------
create table if not exists public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  description text not null,
  category text,
  amount numeric(12, 2) not null,
  contact_id uuid references public.contacts (id) on delete set null,
  frequency text not null check (frequency in ('weekly', 'monthly', 'yearly')),
  start_date date not null,
  next_date date not null,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.recurring_transactions enable row level security;

create policy "recurring_transactions_select_own" on public.recurring_transactions
  for select using ((select auth.uid()) = user_id);
create policy "recurring_transactions_insert_own" on public.recurring_transactions
  for insert with check ((select auth.uid()) = user_id);
create policy "recurring_transactions_update_own" on public.recurring_transactions
  for update using ((select auth.uid()) = user_id);
create policy "recurring_transactions_delete_own" on public.recurring_transactions
  for delete using ((select auth.uid()) = user_id);

create index if not exists recurring_transactions_user_next_idx
  on public.recurring_transactions (user_id, next_date);
create index if not exists recurring_transactions_contact_idx
  on public.recurring_transactions (contact_id);

-- Collega un movimento generato alla ricorrenza che lo ha creato (evita duplicati)
alter table public.transactions
  add column if not exists recurring_id uuid references public.recurring_transactions (id) on delete set null;
create index if not exists transactions_recurring_idx on public.transactions (recurring_id);

-- ---------- Note e promemoria per contatto ----------
create table if not exists public.contact_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  note text not null,
  remind_at date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_notes enable row level security;

create policy "contact_notes_select_own" on public.contact_notes
  for select using ((select auth.uid()) = user_id);
create policy "contact_notes_insert_own" on public.contact_notes
  for insert with check ((select auth.uid()) = user_id);
create policy "contact_notes_update_own" on public.contact_notes
  for update using ((select auth.uid()) = user_id);
create policy "contact_notes_delete_own" on public.contact_notes
  for delete using ((select auth.uid()) = user_id);

create index if not exists contact_notes_contact_idx on public.contact_notes (contact_id);
create index if not exists contact_notes_user_idx on public.contact_notes (user_id);

-- ---------- Automazione: generazione ricorrenze in background ----------
-- Fino a qui, i movimenti ricorrenti si generavano solo quando l'utente
-- apriva l'app (Panoramica/Ricorrenti chiamavano generateDueRecurringTransactions
-- in lib/recurring.ts, scoped alla sessione RLS dell'utente). Con pg_cron
-- lo stesso identico calcolo (vedi nextOccurrence) gira ogni notte per TUTTI
-- gli utenti, anche se non aprono mai l'app.
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create or replace function public.next_occurrence(d date, freq text)
returns date
language plpgsql
immutable
set search_path = ''
as $$
declare
  y int := extract(year from d)::int;
  m int := extract(month from d)::int;
  day int := extract(day from d)::int;
  months int := case when freq = 'yearly' then 12 else 1 end;
  new_year int;
  new_month int;
  last_day int;
begin
  if freq = 'weekly' then
    return d + 7;
  end if;

  new_year := y + ((m - 1 + months) / 12);
  new_month := ((m - 1 + months) % 12) + 1;
  last_day := extract(day from (make_date(new_year, new_month, 1) + interval '1 month - 1 day'))::int;

  return make_date(new_year, new_month, least(day, last_day));
end;
$$;

-- security definer: deve operare su tutti gli utenti, non solo quello
-- loggato. Per questo NON deve mai essere chiamabile dalla REST API
-- pubblica (vedi revoke sotto) — solo pg_cron la esegue.
create or replace function public.generate_due_recurring_transactions()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  cursor_date date;
  guard int;
  still_active boolean;
  today date := current_date;
begin
  for r in
    select * from recurring_transactions
    where active = true and next_date <= today
  loop
    cursor_date := r.next_date;
    guard := 0;

    while cursor_date <= today and guard < 500 loop
      insert into transactions (user_id, description, category, amount, date, contact_id, recurring_id)
      values (r.user_id, r.description, r.category, r.amount, cursor_date, r.contact_id, r.id);

      cursor_date := public.next_occurrence(cursor_date, r.frequency);
      guard := guard + 1;

      exit when r.end_date is not null and cursor_date > r.end_date;
    end loop;

    still_active := not (r.end_date is not null and cursor_date > r.end_date);

    update recurring_transactions
    set next_date = cursor_date, active = still_active
    where id = r.id;
  end loop;
end;
$$;

revoke execute on function public.generate_due_recurring_transactions() from anon, authenticated, public;

select cron.unschedule(jobid) from cron.job where jobname = 'generate-due-recurring-transactions';
select cron.schedule(
  'generate-due-recurring-transactions',
  '0 3 * * *', -- ogni notte alle 03:00 UTC
  $$select public.generate_due_recurring_transactions();$$
);

-- ---------- Newsletter: iscritti dal sito pubblico ----------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;

-- Nessuna policy, e nessun permesso ai ruoli pubblici: la lista si tocca solo
-- lato server con la service role key (iscrizione dal modulo, invio mensile,
-- disiscrizione). All'inizio l'iscrizione partiva dal browser con la chiave
-- pubblica e serviva una policy di insert aperta a tutti; da quando passa da
-- una server action quella porta era solo un modo per infilare indirizzi
-- nella lista scavalcando il modulo, visto che la chiave pubblica sta nel
-- codice della pagina.
revoke all on table public.newsletter_subscribers from anon, authenticated;

-- Il divieto scritto per esteso. Senza permessi SQL la porta e' gia' chiusa,
-- ma una tabella con la RLS accesa e nessuna policy sembra una dimenticanza:
-- cosi' invece si legge che e' voluto.
create policy "newsletter_subscribers_solo_service_role" on public.newsletter_subscribers
  for all to anon, authenticated using (false) with check (false);

create index if not exists newsletter_subscribers_unsub_token_idx
  on public.newsletter_subscribers (unsubscribe_token);

-- ---------- Newsletter: numeri (bozza scritta a mano, poi inviata) ----------
create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body_html text not null,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.newsletter_issues enable row level security;
-- Nessuna policy pubblica: solo la service role key la legge/scrive, dalla
-- pagina admin e dal cron di invio (entrambi lato server). Togliamo anche i
-- permessi SQL ai ruoli pubblici, cosi' la tabella non e' raggiungibile
-- dall'API nemmeno se un giorno qualcuno aggiungesse una policy per sbaglio.
revoke all on table public.newsletter_issues from anon, authenticated;

create policy "newsletter_issues_solo_service_role" on public.newsletter_issues
  for all to anon, authenticated using (false) with check (false);

-- ---------- Cestino per i movimenti eliminati ----------
alter table public.transactions add column if not exists deleted_at timestamptz;

-- L'indice esistente serve alle query di tutti i giorni (dashboard, budget,
-- confronto, annuale...), che leggono solo le righe attive: lo rendiamo
-- parziale così resta piccolo e veloce anche quando il cestino cresce.
drop index if exists transactions_user_date_idx;
create index transactions_user_date_idx
  on public.transactions (user_id, date desc)
  where deleted_at is null;

-- Indice separato per il cestino stesso (poche righe, ma serve comunque per
-- ordinarle senza uno scan completo della tabella).
create index if not exists transactions_deleted_at_idx
  on public.transactions (user_id, deleted_at desc)
  where deleted_at is not null;

-- Svuotamento automatico: righe cestinate da più di 30 giorni vengono
-- eliminate per sempre, così il cestino non cresce all'infinito e le sue
-- query restano veloci nel tempo.
create or replace function public.purge_old_deleted_transactions()
returns void
language sql
security definer
set search_path = public
as $$
  delete from transactions where deleted_at is not null and deleted_at < now() - interval '30 days';
$$;

revoke execute on function public.purge_old_deleted_transactions() from anon, authenticated, public;

select cron.unschedule(jobid) from cron.job where jobname = 'purge-old-deleted-transactions';
select cron.schedule(
  'purge-old-deleted-transactions',
  '0 4 * * *', -- ogni notte alle 04:00 UTC
  $$select public.purge_old_deleted_transactions();$$
);

-- ---------- Dati anagrafici dell'utente ----------
-- Richiesti in fase di registrazione (nome, cognome, data di nascita).
-- Stanno in una tabella separata invece che nei metadati di
-- auth.users perché così sono soggetti alle stesse policy RLS di tutto il
-- resto: nessun utente può leggere l'anagrafica di un altro.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = user_id);
create policy "profiles_delete_own" on public.profiles
  for delete using ((select auth.uid()) = user_id);

-- La riga del profilo nasce insieme all'utente. Chi si registra col form
-- passa i dati in raw_user_meta_data e la riga nasce già completa; chi entra
-- con Google non li ha, quindi nasce vuota e l'app chiede di completarla al
-- primo accesso (vedi app/completa-profilo).
-- security definer: gira nel contesto della insert su auth.users, dove
-- auth.uid() non è ancora quello del nuovo utente e le policy RLS
-- bloccherebbero l'inserimento.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, first_name, last_name, birth_date)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    (nullif(new.raw_user_meta_data ->> 'birth_date', ''))::date
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Serve solo al trigger qui sotto: come le altre funzioni security definer di
-- questo schema, non deve essere richiamabile dalla REST API pubblica.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Gli utenti già esistenti quando questo blocco viene applicato la prima volta
-- non hanno una riga: la creiamo vuota, così l'app li tratta come "profilo da
-- completare" invece di dover distinguere fra riga mancante e riga incompleta.
insert into public.profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;
