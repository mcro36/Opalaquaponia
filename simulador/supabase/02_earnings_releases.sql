-- =============================================
-- RJ Piscicultura — Earnings Releases SCHEMA & SEED (REVISADO: LINGUIÇA + GRAXARIA)
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

-- 1S21 — Implantação
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S21', '2021-01-01', '2021-06-30',
  'Implantação e Escalonamento',
  'O primeiro semestre foi dedicado à execução do CAPEX e ao escalonamento biológico. Os seis tanques foram populados sequencialmente, preparando o sistema para a primeira despesca em julho.',
  '{"receita_bruta":0,"receita_agregados":0,"pis_cofins":0,"receita_liquida":0,"cpv_racao":-36431,"cpv_alevinos":-6960,"cpv_processamento":0,"cpv_agregados":0,"lucro_bruto":-43391,"sga_energia":-12127,"sga_manutencao":-4800,"ebitda":-60318,"depreciacao":-9795,"ebit":-70113,"financeiro":-3820,"lair":-73933,"ir_csll":0,"lucro_liquido":-73933}',
  '{"receita":0,"ebitda":-60318,"lucro_liquido":-73933,"capex":195900,"caixa_final":25862}',
  '{"tanques":"6 de 6","biomassa":5040,"file_vendido":0,"linguiça_vendida":0,"fca":null,"mortalidade":null,"preco_medio":47,"custo_kg":null}',
  '{"divida_bruta":117540,"caixa":25862,"divida_liquida":91678,"alavancagem":"n/a"}',
  '{"ebitda":-60318,"capex":-195900,"ir":0,"amortizacao":0,"fcl_antes":-256218,"dividendos":0,"fcl_apos":-256218}',
  '{}'
);

-- 2S21 — Primeira Safra e Linguiça
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S21', '2021-07-01', '2021-12-31',
  'Receita Plena e Estreia da Linguiça',
  'Atingimos receita plena com as seis despescas e lançamos a linha de Linguiça de Tilápia, aproveitando subprodutos que seriam descartados. A diversificação aumentou a receita em 36% e a margem EBITDA para 48,8%.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-78828,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":135736,"sga_energia":-12497,"sga_manutencao":-4800,"ebitda":118439,"depreciacao":-9795,"ebit":108644,"financeiro":-3820,"lair":104824,"ir_csll":-9700,"lucro_liquido":95124}',
  '{"receita":242488,"ebitda":118439,"lucro_liquido":95124,"capex":4500,"caixa_final":122523}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":29.12}',
  '{"divida_bruta":117540,"caixa":122523,"divida_liquida":-4983,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":118439,"capex":-4500,"ir":-9700,"amortizacao":-3820,"fcl_antes":100419,"dividendos":0,"fcl_apos":100419}',
  '{"receita_anual":242488,"ebitda_anual":58121,"ll_anual":21191}'
);

-- 1S22 — Regime Estável
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S22', '2022-01-01', '2022-06-30',
  'Maturidade Operacional',
  'Semestre de estabilidade com filé e linguiça em plena produção. Geramos forte caixa operacional e consolidamos a posição de caixa líquido.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-78828,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":135736,"sga_energia":-12127,"sga_manutencao":-4800,"ebitda":118809,"depreciacao":-9795,"ebit":109014,"financeiro":-3820,"lair":105194,"ir_csll":-9700,"lucro_liquido":95494}',
  '{"receita":242488,"ebitda":118809,"lucro_liquido":95494,"capex":0,"caixa_final":227524}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":29.12}',
  '{"divida_bruta":117540,"caixa":227524,"divida_liquida":-109984,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":118809,"capex":0,"ir":-9700,"amortizacao":-3820,"fcl_antes":105289,"dividendos":0,"fcl_apos":105289}',
  '{}'
);

-- 2S22 — Crise da Soja (Amortecida pela Linguiça)
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S22', '2022-07-01', '2022-12-31',
  'Crise de Grãos e Decisão de CAPEX',
  'Mesmo com a alta de 40% na ração, a linha de linguiça manteve a empresa lucrativa e resiliente. Decidimos antecipar o CAPEX da Fábrica + Graxaria para R$ 117.000 para eliminar esta dependência.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-110360,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":104204,"sga_energia":-12496,"sga_manutencao":-4800,"ebitda":86908,"depreciacao":-9795,"ebit":77113,"financeiro":-3820,"lair":73293,"ir_csll":-9700,"lucro_liquido":63593}',
  '{"receita":242488,"ebitda":86908,"lucro_liquido":63593,"capex":117000,"caixa_final":297927}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.25,"mortalidade":12,"preco_medio":47,"custo_kg":37.45}',
  '{"divida_bruta":97950,"caixa":297927,"divida_liquida":-199977,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":86908,"capex":-117000,"ir":-9700,"amortizacao":-5333,"fcl_antes":-45125,"dividendos":0,"fcl_apos":-45125}',
  '{"receita_anual":484976,"ebitda_anual":205717,"ll_anual":159087}'
);

-- 1S23 — Fábrica de Ração e Graxaria
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S23', '2023-01-01', '2023-06-30',
  'Verticalização: Ração Própria + Graxaria',
  'A Fábrica de Ração e a Graxaria reduziram o custo da nutrição para R$ 1,75/kg. A graxaria produz farelo e óleo de peixe a partir de resíduos, fechando o ciclo da economia circular.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-46360,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":168204,"sga_energia":-12492,"sga_manutencao":-4800,"ebitda":151277,"depreciacao":-21495,"ebit":129782,"financeiro":-3820,"lair":125962,"ir_csll":-9700,"lucro_liquido":116262}',
  '{"receita":242488,"ebitda":151277,"lucro_liquido":116262,"capex":0,"caixa_final":390779}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.22,"mortalidade":10,"preco_medio":47,"custo_kg":17.50}',
  '{"divida_bruta":78360,"caixa":390779,"divida_liquida":-312419,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":151277,"capex":0,"ir":-9700,"amortizacao":-1310,"fcl_antes":140267,"dividendos":0,"fcl_apos":140267}',
  '{}'
);

-- 2S23 — Energia Solar e Blindagem Total
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S23', '2023-07-01', '2023-12-31',
  'Blindagem Quádrupla: Solar Ativo',
  'Com energia solar, ração própria, graxaria e linguiça, atingimos o maior nível de resiliência e margem EBITDA (70,3%). Somos imunes aos maiores vetores de custo do setor.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-22050,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":192514,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":170387,"depreciacao":-29774,"ebit":140613,"financeiro":-3820,"lair":136793,"ir_csll":-9700,"lucro_liquido":127093}',
  '{"receita":242488,"ebitda":170387,"lucro_liquido":127093,"capex":91200,"caixa_final":411516}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.21,"mortalidade":10,"preco_medio":47,"custo_kg":16.54}',
  '{"divida_bruta":58770,"caixa":411516,"divida_liquida":-352746,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":170387,"capex":-91200,"ir":-9700,"amortizacao":-22900,"fcl_antes":46587,"dividendos":0,"fcl_apos":46587}',
  '{"receita_anual":484976,"ebitda_anual":321664,"ll_anual":243355}'
);

-- 1S24 — Geração de Caixa Máxima
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S24', '2024-01-01', '2024-06-30',
  'Fluxo de Caixa Livre Recorde',
  'Operação em velocidade de cruzeiro. Geração massiva de caixa livre sem necessidade de novos CAPEX.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-22050,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":192514,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":185974,"depreciacao":-29774,"ebit":156200,"financeiro":-2440,"lair":153760,"ir_csll":-9700,"lucro_liquido":144060}',
  '{"receita":242488,"ebitda":185974,"lucro_liquido":144060,"capex":0,"caixa_final":565340}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":39180,"caixa":565340,"divida_liquida":-526160,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":185974,"capex":0,"ir":-9700,"amortizacao":-22410,"fcl_antes":153864,"dividendos":0,"fcl_apos":153864}',
  '{}'
);

-- 2S24 — Inverno Extremo e Preço Premium
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S24', '2024-07-01', '2024-12-31',
  'Inverno Rigoroso e Valorização do Peixe',
  'Enquanto a região sofria com mortandade, nossa climatização manteve produção plena. Capturamos preço premium de R$ 56/kg no filé. Linguiça manteve preço estável.',
  '{"receita_bruta":272449,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":272449,"cpv_racao":-22050,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":222475,"sga_energia":-3600,"sga_manutencao":-4800,"ebitda":214075,"depreciacao":-29774,"ebit":184301,"financeiro":-1490,"lair":182811,"ir_csll":-10898,"lucro_liquido":171913}',
  '{"receita":272449,"ebitda":214075,"lucro_liquido":171913,"capex":0,"caixa_final":746815}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.20,"mortalidade":9,"preco_medio":56,"custo_kg":15.12}',
  '{"divida_bruta":19590,"caixa":746815,"divida_liquida":-727225,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":214075,"capex":0,"ir":-10898,"amortizacao":-21850,"fcl_antes":181327,"dividendos":0,"fcl_apos":181327}',
  '{"receita_anual":514937,"ebitda_anual":400049,"ll_anual":315973}'
);

-- 1S25 — Payback e Primeiros Dividendos
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '1S25', '2025-01-01', '2025-06-30',
  'Payback Completo e ROI de 394%',
  'Payback do capital próprio atingido com folga. Distribuímos R$ 100.000 em dividendos, mantendo forte reserva para a Fase II.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-22050,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":192514,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":185974,"depreciacao":-29774,"ebit":156200,"financeiro":-1490,"lair":154710,"ir_csll":-9700,"lucro_liquido":145010}',
  '{"receita":242488,"ebitda":185974,"lucro_liquido":145010,"capex":0,"caixa_final":771125}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":19590,"caixa":771125,"divida_liquida":-751535,"alavancagem":"Caixa Líquido"}',
  '{"ebitda":185974,"capex":0,"ir":-9700,"amortizacao":-21000,"fcl_antes":155274,"dividendos":-100000,"fcl_apos":55274}',
  '{}'
);

-- 2S25 — Quitação e Próximos Passos
INSERT INTO earnings_releases (project_id, period_label, period_start, period_end, event_key, admin_message, dre, kpi_financial, kpi_operational, capital_structure, fcl, yearly_summary)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  '2S25', '2025-07-01', '2025-12-31',
  'Fase I Consolidada: R$ 1M em Lucros',
  'Quitamos o PRONAF e encerramos os 5 anos com mais de R$ 1 milhão em lucro líquido acumulado. Prontos para dobrar a capacidade com 12 tanques.',
  '{"receita_bruta":242488,"receita_agregados":86025,"pis_cofins":0,"receita_liquida":242488,"cpv_racao":-22050,"cpv_alevinos":-6960,"cpv_processamento":-7200,"cpv_agregados":-13764,"lucro_bruto":192514,"sga_energia":-1740,"sga_manutencao":-4800,"ebitda":185974,"depreciacao":-29774,"ebit":156200,"financeiro":0,"lair":156200,"ir_csll":-9700,"lucro_liquido":146500}',
  '{"receita":242488,"ebitda":185974,"lucro_liquido":146500,"capex":0,"caixa_final":851035}',
  '{"tanques":"6 de 6","biomassa":11478,"file_vendido":3329,"linguiça_vendida":1147,"fca":1.20,"mortalidade":9,"preco_medio":47,"custo_kg":15.12}',
  '{"divida_bruta":0,"caixa":851035,"divida_liquida":-851035,"alavancagem":"Dívida Zero"}',
  '{"ebitda":185974,"capex":0,"ir":-9700,"amortizacao":-19590,"fcl_antes":156684,"dividendos":-100000,"fcl_apos":56684}',
  '{"receita_anual":484976,"ebitda_anual":371948,"ll_anual":291510}'
);
