-- Schema do Banco de Dados Supabase para o Sistema Red Balloon Paulínia
-- Criado com base nas Melhores Práticas de PostgreSQL do Supabase

-- Habilitar extensões necessárias se aplicável
-- create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABELA: dashboard_kpis (KPIs Consolidados da Unidade)
-- ==========================================
create table if not exists public.dashboard_kpis (
  id bigint generated always as identity primary key,
  enrolled_students integer not null check (enrolled_students >= 0),
  new_enrollments integer not null check (new_enrollments >= 0),
  predicted_revenue_cents bigint not null check (predicted_revenue_cents >= 0), -- Armazenado em centavos para precisão
  retention_rate numeric(5,2) not null check (retention_rate >= 0.00 and retention_rate <= 100.00),
  high_risk_students integer not null check (high_risk_students >= 0),
  nps_score integer not null check (nps_score >= -100 and nps_score <= 100),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.dashboard_kpis enable row level security;
alter table public.dashboard_kpis force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read dashboard_kpis"
  on public.dashboard_kpis for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify dashboard_kpis"
  on public.dashboard_kpis for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 2. TABELA: monthly_metrics (Gráfico de Linha YTD de Matrículas)
-- ==========================================
create table if not exists public.monthly_metrics (
  id bigint generated always as identity primary key,
  month_date date not null unique,
  month_name text not null,
  entradas integer not null check (entradas >= 0),
  saidas integer not null check (saidas >= 0),
  total_students integer not null check (total_students >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para ordenação rápida por data
create index if not exists monthly_metrics_month_date_idx on public.monthly_metrics (month_date);

-- Habilitar RLS
alter table public.monthly_metrics enable row level security;
alter table public.monthly_metrics force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read monthly_metrics"
  on public.monthly_metrics for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify monthly_metrics"
  on public.monthly_metrics for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 3. TABELA: weekly_cancellations (Cancelamentos Semanais)
-- ==========================================
create table if not exists public.weekly_cancellations (
  id bigint generated always as identity primary key,
  week_label text not null unique, -- ex: 'Sem 1', 'Sem 2'
  cancellations_count integer not null check (cancellations_count >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.weekly_cancellations enable row level security;
alter table public.weekly_cancellations force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read weekly_cancellations"
  on public.weekly_cancellations for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify weekly_cancellations"
  on public.weekly_cancellations for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 4. TABELA: cancellation_reasons (Motivos de Evasão - Pareto)
-- ==========================================
create table if not exists public.cancellation_reasons (
  id bigint generated always as identity primary key,
  reason_category text not null unique, -- ex: 'Financeiro', 'Mudança / Relocação'
  percentage numeric(5,2) not null check (percentage >= 0.00 and percentage <= 100.00),
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para ordem de exibição
create index if not exists cancellation_reasons_display_order_idx on public.cancellation_reasons (display_order);

-- Habilitar RLS
alter table public.cancellation_reasons enable row level security;
alter table public.cancellation_reasons force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read cancellation_reasons"
  on public.cancellation_reasons for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify cancellation_reasons"
  on public.cancellation_reasons for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 5. TABELA: pedagogical_classes (Turmas & Risco de Evasão)
-- ==========================================
create table if not exists public.pedagogical_classes (
  id bigint generated always as identity primary key,
  class_name text not null, -- ex: 'Teens 3 - Sáb 09h'
  teacher_name text not null, -- ex: 'Prof. Mariana S.'
  average_grade numeric(4,2) not null check (average_grade >= 0.00 and average_grade <= 10.00),
  attendance_rate numeric(5,2) not null check (attendance_rate >= 0.00 and attendance_rate <= 100.00),
  risk_level text not null check (risk_level in ('Alto', 'Médio', 'Baixo')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices para filtros rápidos de risco e nome da turma
create index if not exists pedagogical_classes_risk_level_idx on public.pedagogical_classes (risk_level);
create index if not exists pedagogical_classes_class_name_idx on public.pedagogical_classes (class_name);

-- Habilitar RLS
alter table public.pedagogical_classes enable row level security;
alter table public.pedagogical_classes force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read pedagogical_classes"
  on public.pedagogical_classes for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify pedagogical_classes"
  on public.pedagogical_classes for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 6. TABELA: nps_history (Evolução Trimestral de NPS)
-- ==========================================
create table if not exists public.nps_history (
  id bigint generated always as identity primary key,
  quarter_label text not null unique, -- ex: 'Q1', 'Q2'
  nps_score integer not null check (nps_score >= -100 and nps_score <= 100),
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para ordem de exibição
create index if not exists nps_history_display_order_idx on public.nps_history (display_order);

-- Habilitar RLS
alter table public.nps_history enable row level security;
alter table public.nps_history force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read nps_history"
  on public.nps_history for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify nps_history"
  on public.nps_history for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 7. TABELA: nps_feedbacks (Comentários e Feedbacks de NPS)
-- ==========================================
create table if not exists public.nps_feedbacks (
  id bigint generated always as identity primary key,
  comment_text text not null,
  category text check (category in ('Promotor', 'Neutro', 'Detrator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.nps_feedbacks enable row level security;
alter table public.nps_feedbacks force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read nps_feedbacks"
  on public.nps_feedbacks for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify nps_feedbacks"
  on public.nps_feedbacks for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 8. TABELA: events (Resultado de Eventos)
-- ==========================================
create table if not exists public.events (
  id bigint generated always as identity primary key,
  name text not null, -- ex: 'Farmer''s Market' ou 'Geral'
  year integer not null check (year >= 2000),
  revenue_cents bigint not null check (revenue_cents >= 0),
  cost_cents bigint not null check (cost_cents >= 0),
  engagement_rate numeric(5,2) not null check (engagement_rate >= 0.00 and engagement_rate <= 100.00),
  rating numeric(3,2) not null check (rating >= 0.00 and rating <= 5.00),
  responses_count integer not null check (responses_count >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para buscas por ano e nome
create index if not exists events_year_name_idx on public.events (year, name);

-- Habilitar RLS
alter table public.events enable row level security;
alter table public.events force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read events"
  on public.events for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify events"
  on public.events for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 9. TABELA: farmers_market_participation (Participação do Farmer's Market)
-- ==========================================
create table if not exists public.farmers_market_participation (
  id bigint generated always as identity primary key,
  class_level text not null unique, -- ex: 'fm-bar-k1', 'fm-bar-k2'
  participation_rate numeric(5,2) not null check (participation_rate >= 0.00 and participation_rate <= 100.00),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.farmers_market_participation enable row level security;
alter table public.farmers_market_participation force row level security;

-- Políticas de RLS
create policy "Allow authenticated users to read farmers_market_participation"
  on public.farmers_market_participation for select
  to authenticated
  using (true);

create policy "Allow authenticated users to modify farmers_market_participation"
  on public.farmers_market_participation for all
  to authenticated
  using (true)
  with check (true);


-- ==========================================
-- 10. TABELA: data_loads (Histórico de Cargas)
-- ==========================================
create table if not exists public.data_loads (
  id bigint generated always as identity primary key,
  filename text not null,
  loaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  status text not null check (status in ('success', 'error', 'processing')),
  rows_count integer not null default 0 check (rows_count >= 0),
  errors_count integer not null default 0 check (errors_count >= 0),
  user_id uuid references auth.users(id) on delete set null
);

-- Criar índice na chave estrangeira user_id (Regra Crucial de FK Indexing)
create index if not exists data_loads_user_id_idx on public.data_loads (user_id);

-- Habilitar RLS
alter table public.data_loads enable row level security;
alter table public.data_loads force row level security;

-- Políticas de RLS (Sintaxe Otimizada envolvendo auth.uid() em SELECT)
create policy "Allow authenticated users to read data_loads"
  on public.data_loads for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert data_loads"
  on public.data_loads for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
