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
