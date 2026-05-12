-- =============================================
-- RJ Piscicultura — Earnings Releases SCHEMA & SEED
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Criação da Tabela (se não existir)
CREATE TABLE IF NOT EXISTS earnings_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    period_label VARCHAR(10) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    event_key VARCHAR(100),
    is_published BOOLEAN DEFAULT true,
    admin_message TEXT,
    dre JSONB NOT NULL DEFAULT '{}',
    kpi_financial JSONB NOT NULL DEFAULT '{}',
    kpi_operational JSONB NOT NULL DEFAULT '{}',
    capital_structure JSONB NOT NULL DEFAULT '{}',
    fcl JSONB NOT NULL DEFAULT '{}',
    yearly_summary JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS e Criar Política de Acesso Público
ALTER TABLE earnings_releases ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'earnings_releases' AND policyname = 'public_access'
    ) THEN
        CREATE POLICY "public_access" ON earnings_releases FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 3. Limpa os dados existentes antes de reinserir
DELETE FROM earnings_releases WHERE project_id = 'b0000000-0000-0000-0000-000000000001';

-- 4. SEED DATA
-- 1S21 (Antigo 1S27) — Implantação
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S21', '2021-01-01', '2021-06-30',
  'Implantação e Escalonamento',
  'Iniciamos a jornada da RJ Piscicultura com a montagem da infraestrutura e o povoamento escalonado dos 6 tanques. O semestre foi marcado por CAPEX intensivo e a preparação biológica do sistema de bioflocos. Os tanques foram ativados sequencialmente de janeiro a junho, preparando o sistema para a primeira safra.',
  '{"receita_bruta":0,"pis_cofins":0,"receita_liquida":0,"cpv_racao":-36431,"cpv_alevinos":-6960,"cpv_processamento":0,"lucro_bruto":-43391,"sga_energia":-12127,"sga_manutencao":-4800,"ebitda":-60318,"depreciacao":-9795,"ebit":-70113,"financeiro":-3820,"lair":-73933,"ir_csll":0,"lucro_liquido":-73933}',
  '{"receita":0,"ebitda":-60318,"lucro_liquido":-73933,"capex":195900,"caixa_final":25862}',
  '{"tanques":"6 de 6","biomassa":5040,"file_vendido":0,"fca":null,"mortalidade":null,"preco_medio":47,"custo_kg":null}',
  '{"divida_bruta":117540,"caixa":25862,"divida_liquida":91678,"alavancagem":"n/a"}',
  '{"ebitda":-60318,"capex":-195900,"ir":0,"amortizacao":0,"fcl_antes":-256218,"dividendos":0,"fcl_apos":-256218}',
  '{}'
);

-- 2S21 (Antigo 2S27) — Break-even
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S21', '2021-07-01', '2021-12-31',
  'Receita Plena e Break-even',
  'Com o ciclo de despesca iniciado em julho, atingimos a marca de 6 despescas no semestre. A linhagem GIFT respondeu conforme projetado, e alcançamos o ponto de equilíbrio operacional com margem EBITDA de 38%. O FCA de 1,25 e mortalidade de 12% estiveram dentro do projetado para o primeiro ciclo.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-78828,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":84954,"sga_energia":-12497,"sga_manutencao":-4800,"ebitda":67657,"depreciacao":-9795,"ebit":57862,"financeiro":-3820,"lair":54042,"ir_csll":-7118,"lucro_liquido":46924}',
  '{"receita":177942,"ebitda":67657,"lucro_liquido":46924,"capex":0,"caixa_final":82581}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":29.12}',
  '{"divida_bruta":117540,"caixa":82581,"divida_liquida":34959,"alavancagem":"0.52x"}',
  '{"ebitda":67657,"capex":0,"ir":-7118,"amortizacao":-3820,"fcl_antes":56719,"dividendos":0,"fcl_apos":56719}',
  '{"receita_anual":177942,"ebitda_anual":7339,"ll_anual":-27009}'
);

-- 1S22 (Antigo 1S28) — Crise da Soja
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S22', '2022-01-01', '2022-06-30',
  'Gestão da Crise da Soja',
  'O semestre foi desafiador devido à alta de 40% nos insumos (soja/milho). Nossa estratégia de repasse parcial e foco em eficiência biológica manteve o EBITDA em campo positivo, validando a resiliência do modelo. A decisão de antecipar o investimento na verticalização da ração foi tomada neste semestre.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-78828,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":84954,"sga_energia":-12127,"sga_manutencao":-4800,"ebitda":68027,"depreciacao":-9795,"ebit":58232,"financeiro":-3820,"lair":54412,"ir_csll":-7118,"lucro_liquido":47294}',
  '{"receita":177942,"ebitda":68027,"lucro_liquido":47294,"capex":0,"caixa_final":119055}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":29.12}',
  '{"divida_bruta":117540,"caixa":119055,"divida_liquida":-1515,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":68027,"capex":0,"ir":-7118,"amortizacao":-24435,"fcl_antes":36474,"dividendos":0,"fcl_apos":36474}',
  '{}'
);

-- 2S22 (Antigo 2S28) — Pico da Crise
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S22', '2022-07-01', '2022-12-31',
  'Pico da Crise: CAPEX Fábrica de Ração',
  'A crise de insumos atingiu seu pico, com o custo da ração comercial subindo 40% (R$ 4,45 para R$ 6,23/kg). Mesmo assim, mantivemos operação plena e aproveitamos o momento para investir R$ 62.600 na Fábrica de Ração própria, que entrará em operação no próximo semestre e eliminará nossa dependência de insumos externos.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-110360,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":53422,"sga_energia":-12496,"sga_manutencao":-4800,"ebitda":36126,"depreciacao":-9795,"ebit":26331,"financeiro":-3820,"lair":22511,"ir_csll":-7118,"lucro_liquido":15393}',
  '{"receita":177942,"ebitda":36126,"lucro_liquido":15393,"capex":62600,"caixa_final":80130}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":37.45}',
  '{"divida_bruta":97950,"caixa":80130,"divida_liquida":17820,"alavancagem":"0.17x"}',
  '{"ebitda":36126,"capex":-62600,"ir":-7118,"amortizacao":-5333,"fcl_antes":-38925,"dividendos":0,"fcl_apos":-38925}',
  '{"receita_anual":355884,"ebitda_anual":104153,"ll_anual":62687}'
);

-- 1S23 (Antigo 1S29) — Fábrica de Ração
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S23', '2023-01-01', '2023-06-30',
  'Verticalização: Fábrica de Ração Ativa',
  'A entrada em operação da Fábrica de Ração própria reduziu o custo do insumo de R$ 4,45/kg para R$ 2,10/kg — queda de 53%. A margem EBITDA saltou de 20% para 54% em apenas um semestre. Esta é nossa maior alavanca operacional e o divisor de águas do projeto. O FCA melhorou para 1,20 com a formulação nutricional própria.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-50259,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":113523,"sga_energia":-12492,"sga_manutencao":-4800,"ebitda":96231,"depreciacao":-16055,"ebit":80176,"financeiro":-3820,"lair":76356,"ir_csll":-7118,"lucro_liquido":69238}',
  '{"receita":177942,"ebitda":96231,"lucro_liquido":69238,"capex":0,"caixa_final":167961}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":10,"preco_medio":47,"custo_kg":17.02}',
  '{"divida_bruta":78360,"caixa":167961,"divida_liquida":-89601,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":96231,"capex":0,"ir":-7118,"amortizacao":-1310,"fcl_antes":87831,"dividendos":0,"fcl_apos":87831}',
  '{}'
);

-- 2S23 (Antigo 2S29) — Energia Solar
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S23', '2023-07-01', '2023-12-31',
  'Independência Energética (Solar 21kWp)',
  'A usina solar de 21kWp entrou em operação plena em agosto. A conta de energia caiu para a taxa mínima da CEMIG — R$ 290/mês. Atingimos a Blindagem Tripla: (1) ração própria, (2) energia solar, (3) climatização 24h. O FCL ficou negativo exclusivamente pelo CAPEX de R$ 91.200 da usina — sem o investimento, o FCL operacional seria R$ 85.323.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-50259,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":113523,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":115341,"depreciacao":-25175,"ebit":90166,"financeiro":-3820,"lair":86346,"ir_csll":-7118,"lucro_liquido":84298}',
  '{"receita":177942,"ebitda":115341,"lucro_liquido":84298,"capex":91200,"caixa_final":162084}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":10,"preco_medio":47,"custo_kg":17.02}',
  '{"divida_bruta":58770,"caixa":162084,"divida_liquida":-103314,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":115341,"capex":-91200,"ir":-7118,"amortizacao":-22900,"fcl_antes":-5877,"dividendos":0,"fcl_apos":-5877}',
  '{"receita_anual":355884,"ebitda_anual":211572,"ll_anual":153536}'
);

-- 1S24 (Antigo 1S30) — Excelência Operacional
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S24', '2024-01-01', '2024-06-30',
  'Excelência Operacional: FCA 1,20',
  'Atingimos o estado da arte na operação: FCA de 1,20 e mortalidade de 9%. Sem CAPEX pendente, o semestre foi dedicado à geração máxima de Fluxo de Caixa Livre de R$ 91.192 — equivalente a mais da metade de todo o capital de giro inicial do projeto (R$ 90.000). O PRONAF caminha para quitação.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-36522,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":127260,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":120720,"depreciacao":-25175,"ebit":95545,"financeiro":-2440,"lair":93105,"ir_csll":-7118,"lucro_liquido":90187}',
  '{"receita":177942,"ebitda":120720,"lucro_liquido":90187,"capex":0,"caixa_final":253276}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":39180,"caixa":253276,"divida_liquida":-214096,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":120720,"capex":0,"ir":-7118,"amortizacao":-22410,"fcl_antes":91192,"dividendos":0,"fcl_apos":91192}',
  '{}'
);

-- 2S24 (Antigo 2S30) — Inverno Extremo
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S24', '2024-07-01', '2024-12-31',
  'Inverno Extremo: Premio Climatico +19%',
  'O inverno mais frio da decada em BH (minimas de 6 graus em julho) validou nosso investimento em climatizacao. Enquanto o mercado sofria com mortalidade massiva e falta de peixe, operamos em capacidade plena 24h. Capturamos preco medio de R$ 56/kg — premium de 19% sobre o preco base. EBITDA record de R$ 152.934.',
  '{"receita_bruta":212016,"pis_cofins":0,"receita_liquida":212016,"cpv_racao":-36522,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":161334,"sga_energia":-3600,"sga_manutencao":-4800,"ebitda":152934,"depreciacao":-25175,"ebit":127759,"financeiro":-1490,"lair":126269,"ir_csll":-8481,"lucro_liquido":121658}',
  '{"receita":212016,"ebitda":152934,"lucro_liquido":121658,"capex":0,"caixa_final":375879}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":9,"preco_medio":56,"custo_kg":15.12}',
  '{"divida_bruta":19590,"caixa":375879,"divida_liquida":-356289,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":152934,"capex":0,"ir":-8481,"amortizacao":-21850,"fcl_antes":122603,"dividendos":0,"fcl_apos":122603}',
  '{"receita_anual":389958,"ebitda_anual":273654,"ll_anual":211845}'
);

-- 1S25 (Antigo 1S31) — Payback Total
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S25', '2025-01-01', '2025-06-30',
  'Payback Total e Inicio dos Dividendos',
  'Comunicamos o atingimento do Payback Total do Projeto. Todo o capital investido — os R$ 322.160 de recursos proprios e os R$ 117.540 do PRONAF — foi recuperado integralmente a partir da geracao de caixa operacional. Distribuimos R$ 60.000 em dividendos ao socio fundador, iniciando a era de retorno ao capital.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-36522,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":133260,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":120720,"depreciacao":-20615,"ebit":100105,"financeiro":-1490,"lair":98615,"ir_csll":-7118,"lucro_liquido":91497}',
  '{"receita":177942,"ebitda":120720,"lucro_liquido":91497,"capex":0,"caixa_final":408481}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":19590,"caixa":408481,"divida_liquida":-388891,"alavancagem":"Caixa Liquido"}',
  '{"ebitda":120720,"capex":0,"ir":-7118,"amortizacao":-21000,"fcl_antes":92602,"dividendos":-60000,"fcl_apos":32602}',
  '{}'
);

-- 2S25 (Antigo 2S31) — Quitação Total
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S25', '2025-07-01', '2025-12-31',
  'Quitacao PRONAF: Empresa 100% Sem Dividas',
  'Encerramos o quinto ano com a quitacao total do PRONAF. A RJ Piscicultura e agora uma empresa 100% sem dividas, gerando R$ 120.720 de EBITDA e R$ 113.602 de Lucro Liquido por semestre, sem qualquer compromisso financeiro. Distribuimos mais R$ 60.000 em dividendos. A Fase II (12 tanques, 720m3) esta aprovada.',
  '{"receita_bruta":177942,"pis_cofins":0,"receita_liquida":177942,"cpv_racao":-36522,"cpv_alevinos":-6960,"cpv_processamento":-7200,"lucro_bruto":133260,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":120720,"depreciacao":-20615,"ebit":100105,"financeiro":0,"lair":100105,"ir_csll":-7118,"lucro_liquido":113602}',
  '{"receita":177942,"ebitda":120720,"lucro_liquido":113602,"capex":0,"caixa_final":441813}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3786,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":0,"caixa":441813,"divida_liquida":-441813,"alavancagem":"Divida Zero"}',
  '{"ebitda":120720,"capex":0,"ir":-7118,"amortizacao":-19590,"fcl_antes":94012,"dividendos":-60000,"fcl_apos":34012}',
  '{"receita_anual":355884,"ebitda_anual":241440,"ll_anual":205099}'
);
