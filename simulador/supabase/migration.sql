-- =============================================
-- Opala Aquaponia — Supabase Migration v1.0
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL DEFAULT 'Projeto Piloto BH',
    phase VARCHAR(20) NOT NULL DEFAULT 'pilot',
    linhagem VARCHAR(20) NOT NULL DEFAULT 'gift',
    reversao_sexual BOOLEAN DEFAULT true,
    target_weight_g NUMERIC(8,2) DEFAULT 800,
    target_density_kg_m3 NUMERIC(6,2) DEFAULT 35,
    price_per_kg NUMERIC(8,2) DEFAULT 50,
    fca_base NUMERIC(4,2) DEFAULT 1.2,
    climate_control_enabled BOOLEAN DEFAULT false,
    target_temperature_c NUMERIC(4,1) DEFAULT 28,
    own_feed_enabled BOOLEAN DEFAULT false,
    current_scenario VARCHAR(20) DEFAULT 'realista',
    extra_params JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SCENARIOS
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    fca_override NUMERIC(4,2),
    price_override NUMERIC(8,2),
    mortality_modifier NUMERIC(4,2) DEFAULT 1.0,
    energy_cost_modifier NUMERIC(4,2) DEFAULT 1.0,
    custom_params JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TANKS
CREATE TABLE IF NOT EXISTS tanks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    label VARCHAR(20) NOT NULL,
    volume_liters NUMERIC(10,2) NOT NULL DEFAULT 5000,
    purpose VARCHAR(30) DEFAULT 'engorda',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- 5. BIOMASS READINGS
CREATE TABLE IF NOT EXISTS biomass_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id UUID NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
    biomass_kg NUMERIC(10,2) NOT NULL,
    fish_count INTEGER,
    avg_weight_g NUMERIC(8,2),
    phase VARCHAR(20)
);

-- 6. CAPEX ITEMS
CREATE TABLE IF NOT EXISTS capex_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(80) NOT NULL,
    name VARCHAR(200) NOT NULL,
    cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Planejado',
    priority VARCHAR(20) DEFAULT 'Média',
    useful_life_months INTEGER DEFAULT 60,
    purchase_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. OPEX ITEMS
CREATE TABLE IF NOT EXISTS opex_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(80) NOT NULL,
    name VARCHAR(200) NOT NULL,
    monthly_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_seasonal BOOLEAN DEFAULT false,
    winter_multiplier NUMERIC(4,2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUTOMATION DEVICES
CREATE TABLE IF NOT EXISTS automation_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    device_type VARCHAR(30) DEFAULT 'sensor',
    cost NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Planejado',
    protocol VARCHAR(30),
    alert_rules JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MORTALITY PHASES
CREATE TABLE IF NOT EXISTS mortality_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    phase VARCHAR(30) NOT NULL,
    rate_percent NUMERIC(5,2) NOT NULL DEFAULT 5,
    sort_order INTEGER DEFAULT 0
);

-- 10. WATER QUALITY READINGS
CREATE TABLE IF NOT EXISTS water_quality_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id UUID NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL,
    reading_at TIMESTAMPTZ DEFAULT NOW(),
    temperature_c NUMERIC(5,2),
    dissolved_oxygen_mg_l NUMERIC(5,2),
    ph NUMERIC(4,2),
    alkalinity_mg_l NUMERIC(8,2),
    ammonia_total_mg_l NUMERIC(6,4),
    ammonia_nh3_mg_l NUMERIC(6,4),
    nitrite_mg_l NUMERIC(6,4),
    co2_mg_l NUMERIC(6,2),
    sst_mg_l NUMERIC(8,2),
    risk_level VARCHAR(20) DEFAULT 'seguro'
);

-- 11. SALES CHANNELS
CREATE TABLE IF NOT EXISTS sales_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    channel_name VARCHAR(100) NOT NULL,
    price_per_kg NUMERIC(8,2) NOT NULL,
    volume_level VARCHAR(20) DEFAULT 'Médio',
    license_required VARCHAR(30) DEFAULT 'SIM',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- 12. LICENSES
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    authority VARCHAR(100),
    scope VARCHAR(20) DEFAULT 'Municipal',
    cost_level VARCHAR(20) DEFAULT 'Baixo',
    status VARCHAR(30) DEFAULT 'Pendente',
    notes TEXT
);

-- 13. SIMULATION SNAPSHOTS
CREATE TABLE IF NOT EXISTS simulation_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES scenarios(id) ON DELETE SET NULL,
    snapshot_name VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    total_capex NUMERIC(14,2),
    monthly_opex NUMERIC(12,2),
    monthly_revenue NUMERIC(12,2),
    monthly_profit NUMERIC(12,2),
    payback_months NUMERIC(6,1),
    roi_percent NUMERIC(8,2),
    fca_used NUMERIC(4,2),
    days_to_harvest INTEGER,
    total_biomass_kg NUMERIC(10,2),
    alevinos_needed INTEGER,
    full_state JSONB
);

-- 14. MONTHLY PROJECTIONS
CREATE TABLE IF NOT EXISTS monthly_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id UUID NOT NULL REFERENCES simulation_snapshots(id) ON DELETE CASCADE,
    month_number INTEGER NOT NULL,
    revenue NUMERIC(12,2) DEFAULT 0,
    opex NUMERIC(12,2) DEFAULT 0,
    energy_cost NUMERIC(10,2) DEFAULT 0,
    feed_cost NUMERIC(10,2) DEFAULT 0,
    tax_simples NUMERIC(10,2) DEFAULT 0,
    depreciation NUMERIC(10,2) DEFAULT 0,
    net_profit NUMERIC(12,2) DEFAULT 0,
    cumulative_balance NUMERIC(14,2) DEFAULT 0,
    expansion_phase VARCHAR(20) DEFAULT 'pilot'
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_biomass_tank_date ON biomass_readings(tank_id, reading_date DESC);
CREATE INDEX IF NOT EXISTS idx_wqr_tank_date ON water_quality_readings(tank_id, reading_at DESC);
CREATE INDEX IF NOT EXISTS idx_capex_project_cat ON capex_items(project_id, category);
CREATE INDEX IF NOT EXISTS idx_opex_project_cat ON opex_items(project_id, category);
CREATE INDEX IF NOT EXISTS idx_snapshots_project ON simulation_snapshots(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projections_snapshot ON monthly_projections(snapshot_id, month_number);

-- =============================================
-- ROW LEVEL SECURITY (Acesso público para anon)
-- Configuração simplificada: permite leitura/escrita
-- pública para o MVP. Pode ser restrito depois com auth.
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE biomass_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE capex_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE opex_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_quality_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_projections ENABLE ROW LEVEL SECURITY;

-- Políticas: Acesso público completo (MVP sem auth)
CREATE POLICY "public_access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON scenarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON tanks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON biomass_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON capex_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON opex_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON automation_devices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON mortality_phases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON water_quality_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON sales_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON licenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON simulation_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON monthly_projections FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- TRIGGER: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =============================================
-- SEED DATA: Projeto Piloto BH
-- =============================================

-- Usuário padrão
INSERT INTO users (id, name, email) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Rodrigo Leite', 'rnleite@opala.com');

-- Projeto
INSERT INTO projects (id, user_id, name, phase, linhagem, reversao_sexual, target_weight_g, target_density_kg_m3, price_per_kg, fca_base)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Opala BH — Piloto 30m³', 'pilot', 'gift', true, 800, 35, 50, 1.2
);

-- 6 Tanques
INSERT INTO tanks (project_id, label, volume_liters, purpose, sort_order) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'T1', 5000, 'alevinagem', 1),
    ('b0000000-0000-0000-0000-000000000001', 'T2', 5000, 'recria', 2),
    ('b0000000-0000-0000-0000-000000000001', 'T3', 5000, 'recria', 3),
    ('b0000000-0000-0000-0000-000000000001', 'T4', 5000, 'engorda', 4),
    ('b0000000-0000-0000-0000-000000000001', 'T5', 5000, 'engorda', 5),
    ('b0000000-0000-0000-0000-000000000001', 'T6', 5000, 'engorda', 6);

-- Biomassa inicial (50kg por tanque)
INSERT INTO biomass_readings (tank_id, biomass_kg, phase)
SELECT t.id, 50, t.purpose FROM tanks t
WHERE t.project_id = 'b0000000-0000-0000-0000-000000000001';

-- CAPEX
INSERT INTO capex_items (project_id, category, name, cost, status, priority) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Infraestrutura', '6 Tanques 5.000L', 15000, 'Planejado', 'Crítica'),
    ('b0000000-0000-0000-0000-000000000001', 'Hidráulica', 'Tubulações iniciais', 5000, 'Planejado', 'Alta'),
    ('b0000000-0000-0000-0000-000000000001', 'Aeração', 'Sopradores Piloto (2x 1CV)', 5000, 'Planejado', 'Crítica');

-- OPEX
INSERT INTO opex_items (project_id, category, name, monthly_cost, is_seasonal, winter_multiplier) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Ração', 'Ração (Premium)', 945, false, 1.0),
    ('b0000000-0000-0000-0000-000000000001', 'Mão de Obra', 'Tratador em Domicílio', 1000, false, 1.0),
    ('b0000000-0000-0000-0000-000000000001', 'Energia', 'Energia Elétrica', 400, true, 2.5);

-- Cenário Realista + Mortalidades
INSERT INTO scenarios (id, project_id, name) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'realista');

INSERT INTO mortality_phases (scenario_id, phase, rate_percent, sort_order) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'transporte', 5, 1),
    ('c0000000-0000-0000-0000-000000000001', 'alevinagem', 10, 2),
    ('c0000000-0000-0000-0000-000000000001', 'recria', 4, 3),
    ('c0000000-0000-0000-0000-000000000001', 'engorda', 2, 4);

-- Canais de Venda
INSERT INTO sales_channels (project_id, channel_name, price_per_kg, volume_level, license_required, sort_order) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'CEASA-BH (Atacado)', 35, 'Muito Alto', 'SIM/SIE', 1),
    ('b0000000-0000-0000-0000-000000000001', 'Restaurantes (B2B)', 45, 'Alto', 'SIM/SIE', 2),
    ('b0000000-0000-0000-0000-000000000001', 'Feiras / Mercados', 55, 'Médio', 'SIM', 3),
    ('b0000000-0000-0000-0000-000000000001', 'Direto / E-commerce', 65, 'Baixo', 'Isento', 4);

-- Licenças
INSERT INTO licenses (project_id, name, authority, scope, cost_level, status) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'SIM (Serviço de Inspeção Municipal)', 'Prefeitura BH', 'Municipal', 'Baixo', 'Pendente'),
    ('b0000000-0000-0000-0000-000000000001', 'SIE-MG (IMA)', 'Governo de Minas Gerais', 'Estadual', 'Médio', 'Pendente'),
    ('b0000000-0000-0000-0000-000000000001', 'SIF (Inspeção Federal)', 'MAPA', 'Federal', 'Alto', 'N/A'),
    ('b0000000-0000-0000-0000-000000000001', 'IGAM (Outorga de Água)', 'Recursos Hídricos MG', 'Estadual', 'Médio', 'Pendente'),
    ('b0000000-0000-0000-0000-000000000001', 'COPAM/FEAM', 'Secretaria Meio Ambiente', 'Estadual', 'Baixo', 'Pendente');
