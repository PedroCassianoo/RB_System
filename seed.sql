-- Inserção de dados de seed iniciais equivalentes aos dados de mockup do dashboard
-- Para popular a base de dados do Red Balloon Paulínia no Supabase

-- Limpar dados existentes (opcional e seguro)
truncate table public.dashboard_kpis restart identity cascade;
truncate table public.monthly_metrics restart identity cascade;
truncate table public.weekly_cancellations restart identity cascade;
truncate table public.cancellation_reasons restart identity cascade;
truncate table public.pedagogical_classes restart identity cascade;
truncate table public.nps_history restart identity cascade;
truncate table public.nps_feedbacks restart identity cascade;
truncate table public.events restart identity cascade;
truncate table public.farmers_market_participation restart identity cascade;
truncate table public.data_loads restart identity cascade;

-- 1. KPIs Consolidados da Unidade
insert into public.dashboard_kpis (enrolled_students, new_enrollments, predicted_revenue_cents, retention_rate, high_risk_students, nps_score)
values (194, 30, 230000000, 92.40, 18, 82); -- R$ 2.3M = 230.000.000 centavos

-- 2. Histórico de Crescimento de Matrículas (YTD Chart)
insert into public.monthly_metrics (month_date, month_name, entradas, saidas, total_students) values
('2025-10-01', 'Outubro 2025', 30, 0, 30),
('2025-11-01', 'Novembro 2025', 20, 5, 45),
('2025-12-01', 'Dezembro 2025', 18, 8, 55),
('2026-01-01', 'Janeiro 2026', 30, 10, 75),
('2026-02-01', 'Fevereiro 2026', 25, 10, 90),
('2026-03-01', 'Março 2026', 35, 15, 110),
('2026-04-01', 'Abril 2026', 40, 15, 135),
('2026-05-01', 'Maio 2026', 35, 5, 165),
('2026-06-01', 'Junho 2026', 30, 1, 194);

-- 3. Cancelamentos Semanais (Mês Vigente)
insert into public.weekly_cancellations (week_label, cancellations_count) values
('Sem 1', 12),
('Sem 2', 18),
('Sem 3', 9),
('Sem 4', 24),
('Sem 5', 15);

-- 4. Motivos de Evasão (Termômetro - Pareto)
insert into public.cancellation_reasons (reason_category, percentage, display_order) values
('Financeiro', 45.00, 1),
('Mudança / Relocação', 25.00, 2),
('Insat. Pedagógica', 15.00, 3),
('Horário / Conflito', 10.00, 4),
('Outros', 5.00, 5);

-- 5. Turmas & Risco de Evasão
insert into public.pedagogical_classes (class_name, teacher_name, average_grade, attendance_rate, risk_level) values
('Teens 3 - Sáb 09h', 'Prof. Mariana S.', 6.80, 78.00, 'Alto'),
('Kids 2 - Seg/Qua 15h', 'Prof. Carlos A.', 7.50, 85.00, 'Médio'),
('Adults Advanced - Ter/Qui 19h', 'Prof. Elena M.', 9.20, 95.00, 'Baixo');

-- 6. Histórico Trimestral de NPS
insert into public.nps_history (quarter_label, nps_score, display_order) values
('Q1', 60, 1),
('Q2', 65, 2),
('Q3', 62, 3),
('Q4', 75, 4),
('Q5', 78, 5),
('Q6', 82, 6);

-- 7. Feedbacks de NPS
insert into public.nps_feedbacks (comment_text, category) values
('A coordenação pedagógica responde rapidamente e com extrema clareza sobre as dúvidas curriculares. O engajamento com as crianças é notável.', 'Promotor'),
('A equipe de recepção foi extremamente cordial, mas notou-se hesitação na explicação dos novos pacotes corporativos. A área de espera estava impecável.', 'Neutro');

-- 8. Resultado Financeiro de Eventos
insert into public.events (name, year, revenue_cents, cost_cents, engagement_rate, rating, responses_count) values
('Geral', 2026, 800000, 1000000, 36.50, 4.80, 12), -- Receita R$ 8.000, Custo R$ 10.000
('Geral', 2025, 720000, 850000, 32.00, 4.50, 10);  -- Receita R$ 7.200, Custo R$ 8.500

-- 9. Participação do Farmer's Market 2026
insert into public.farmers_market_participation (class_level, participation_rate) values
('fm-bar-k1', 7.00),     -- Kids 1 (1.4 * 5 = 7.00)
('fm-bar-k2', 85.50),    -- Kids 2 (17.1 * 5 = 85.50)
('fm-bar-j', 100.00),    -- Juniors (20 * 5 = 100.00)
('fm-bar-j1', 71.50),    -- Juniors 1 (14.3 * 5 = 71.50)
('fm-bar-j2', 78.50),    -- Juniors 2 (15.7 * 5 = 78.50)
('fm-bar-t1', 71.50),    -- Teens 1 (14.3 * 5 = 71.50)
('fm-bar-t2', 28.50),    -- Teens 2 (5.7 * 5 = 28.50)
('fm-bar-t3', 21.50),    -- Teens 3 (4.3 * 5 = 21.50)
('fm-bar-t4', 14.50),    -- Teens 4 (2.9 * 5 = 14.50)
('fm-bar-t5', 0.00),     -- Teens 5 (0 * 5 = 0.00)
('fm-bar-t6', 0.00),     -- Teens 6 (0 * 5 = 0.00)
('fm-bar-leads', 21.50); -- Leads (4.3 * 5 = 21.50)

-- 10. Histórico de Cargas de Arquivos
insert into public.data_loads (filename, loaded_at, file_size_bytes, status, rows_count, errors_count) values
('nps_q2_2023.csv', now() - interval '1 day', 122880, 'success', 120, 0),
('financeiro_consolidado.xlsx', now() - interval '2 days', 2516582, 'success', 2450, 0);
