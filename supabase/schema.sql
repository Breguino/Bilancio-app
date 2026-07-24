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
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

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
  for select using (auth.uid() = user_id);
create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id);
create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);

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
  for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals
  for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals
  for update using (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals
  for delete using (auth.uid() = user_id);

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
  for select using (auth.uid() = user_id);
create policy "contacts_insert_own" on public.contacts
  for insert with check (auth.uid() = user_id);
create policy "contacts_update_own" on public.contacts
  for update using (auth.uid() = user_id);
create policy "contacts_delete_own" on public.contacts
  for delete using (auth.uid() = user_id);

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
  for select using (auth.uid() = user_id);
create policy "recurring_transactions_insert_own" on public.recurring_transactions
  for insert with check (auth.uid() = user_id);
create policy "recurring_transactions_update_own" on public.recurring_transactions
  for update using (auth.uid() = user_id);
create policy "recurring_transactions_delete_own" on public.recurring_transactions
  for delete using (auth.uid() = user_id);

create index if not exists recurring_transactions_user_next_idx
  on public.recurring_transactions (user_id, next_date);

-- Collega un movimento generato alla ricorrenza che lo ha creato (evita duplicati)
alter table public.transactions
  add column if not exists recurring_id uuid references public.recurring_transactions (id) on delete set null;

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
  for select using (auth.uid() = user_id);
create policy "contact_notes_insert_own" on public.contact_notes
  for insert with check (auth.uid() = user_id);
create policy "contact_notes_update_own" on public.contact_notes
  for update using (auth.uid() = user_id);
create policy "contact_notes_delete_own" on public.contact_notes
  for delete using (auth.uid() = user_id);

create index if not exists contact_notes_contact_idx on public.contact_notes (contact_id);
