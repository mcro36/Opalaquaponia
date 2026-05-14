# 07. Plano Financeiro Consolidado

## Resumo
Documento mestre com todas as métricas financeiras do projeto: CAPEX por fase, OPEX mensal detalhado, capital de giro, fluxo de caixa e projeção de payback. Números atualizados para incluir o sistema de fotoperíodo 18L:6D (sombrite + EPS + LED) que eleva a biomassa de despesca em +15%, o sistema RAS com percolador (Fase 2B) e o consumo de ração corrigido pelo cálculo por estágio de ciclo (2.904 kg/mês — ver Doc 02B).

---

## Premissas Operacionais
- **Capacidade:** 6 tanques de 60m³ (360m³ total) + 1 tanque de depuração/buffer 60m³.
- **Ciclo:** 6 meses por lote. Cada tanque opera de forma independente.
- **Despesca mensal (regime estável, com 18L:6D):** ~2.200 kg vivo, em 3 lotes de ~733 kg.
- **Rendimento de filé:** 33% → ~726 kg filé/mês.
- **Rendimento barriguinha:** 5% → ~110 kg/mês (fator limitante da linguiça).
- **Rendimento recortes:** 4% → ~88 kg/mês.
- **Resíduo graxaria:** 58% → ~1.276 kg/mês (+ 33 kg recortes excedentes = 1.309 kg).
- **Mix de venda:** B2B Restaurantes 80% / B2C Feiras 20%.
- **Preço de venda filé:** R$ 45,00/kg (B2B) | R$ 55,00/kg (B2C) | Médio ponderado: R$ 47,00/kg.
- **Preço de venda linguiça:** R$ 30,00/kg (B2B) | R$ 42,00/kg (B2C).
- **FCA:** 1,2 a 1,3 (ração comercial e ração própria). A diferença entre ração comercial e própria está no **custo por kg**, não na conversão alimentar.
- **Consumo de ração:** 2.904 kg/mês — calculado por estágio de ciclo (96,8 kg/dia × 30 dias; ver Doc 02B). Inclui o ganho de biomassa do fotoperíodo 18L:6D; não aplica fator adicional.
- **Fotoperíodo:** 18L:6D via sombrite (dia) + LED IP68 parede (tarde/noite) + EPS 50mm (noite). Ganho produtivo conservador de +15% na biomassa final por ciclo (Vera Cruz & Brown, 2007; Rad et al., 2006).
- **Fonte hídrica:** Poço artesiano existente no terreno.
- **Tarifa CEMIG (rural):** R$ 0,85/kWh (com impostos).

---

## CAPEX — Investimento por Fase

| Fase | Descrição | Valor (R$) |
| :---: | :--- | :--- |
| 1 | Infraestrutura, Aeração, 7º Tanque (60m³ buffer), Processamento SIE e Linguiça/Defumação | 129.000 |
| 2 | Automação e Segurança (CLP, sensores BOQU multiparamétricos, inversores, gerador, UPS) | 47.250 |
| 2B | RAS — Recirculação (decantador cônico, percolador, filtro tela, UV, reservatório, bombas) | 59.600 |
| 3 | Climatização, Fotoperíodo e Alimentação (Bomba de Calor 48k BTU, EPS, Sombrite, LED) | 52.760 |
| 4 | Fábrica de Ração + Graxaria (c/ controle de odor) | 107.600 |
| 5 | Energia Solar (sistema 26 kWp bifacial completo) | 112.200 |
| | Licenciamento (COPAM, IGAM, SIE, MAPA, responsável técnico) | 15.000 |
| **TOTAL** | | **R$ 523.410** |

*Fase 1: inclui bombas centrífugas individuais por tanque (R$ 9.000) para manutenção do vórtice Cornell.*
*Fase 2B: ver dimensionamento completo em [Doc 02B — RAS e Recirculação](02b_RAS_e_Recirculacao.md).*
*Fase 3: Bomba de Calor 48k BTU/h Inverter (R$ 15.000 — redimensionada graças ao EPS noturno que limita pico de carga a ~10,9 kW), painéis EPS 50mm removíveis (R$ 8.200), sombrite 50% anti-UV + estrutura (R$ 7.000), faixas LED IP68 parede (R$ 2.660) e alimentadores automáticos (R$ 10.500).*
*Licenciamento: R$ 10.000 anteriores subestimavam outorga IGAM (uso > 10 m³/dia) e não incluíam honorários do responsável técnico (obrigatório para COPAM e SIE). Ver detalhamento em [Doc 06](06_Qualidade_Riscos_e_Licenciamento.md).*

---

## OPEX Mensal (Cenário Base: Fases 1 a 3 + 2B, com linguiça desde Mês 7)
Sem Fábrica de Ração própria e sem Energia Solar.

| Item | Valor Mensal (R$) |
| :--- | :--- |
| Ração Comercial | 12.923 |
| Energia — Sopradores (2 × 2CV, inverter) | 1.050 |
| Energia — CLP, alimentadores, iluminação + LED | 220 |
| Energia — Bomba de Calor (média anual sazonal) | 388 |
| Alevinos (~2.900/mês, reversão sexual) | 1.160 |
| Mão de obra (1 técnico/proprietário) | 3.000 |
| Manutenção e insumos | 800 |
| Processamento (abate/filetagem) | 1.350 |
| Insumos linguiça (temperos, tripa, embalagem, defumação) | 1.650 |
| **OPEX Total** | **R$ 22.541** |
| Faturamento — filé (616 kg* × R$ 47 médio ponderado) | R$ 28.952 |
| Faturamento — linguiça (248 kg) | R$ 8.040 |
| **Faturamento Total** | **R$ 36.992** |
| **Lucro Líquido Mensal** | **R$ 14.451** |

*616 kg filé para venda = 726 kg total − 110 kg destinados à linguiça*

*Ração comercial: 2.904 kg/mês × R$ 4,45/kg = R$ 12.923. Calculado por estágio de ciclo (Doc 02B, tabela linha "TOTAL 96,8 kg/dia × 30 dias"). O +15% do fotoperíodo já está embutido nas biomassas por ciclo — não se aplica fator adicional.*

*Linguiça produzida desde a primeira despesca (mês 7), pois os equipamentos fazem parte do CAPEX da Fase 1.*

---

## Impacto da Verticalização (Fases 4 e 5)

### Fase 4: Fábrica de Ração
- Produzindo ração própria a R$ 2,10/kg (FCA 1,2–1,3, mesmo da ração comercial).
- O custo de ração cai de R$ 12.923 para **R$ 6.098** (2.904 kg × R$ 2,10).
- **Economia mensal:** R$ 6.825.
- **Novo Lucro Mensal (após Fase 4):** ~R$ 21.276.

### Fase 4 + Graxaria: Farinha e Óleo Próprios
- Graxaria internaliza a farinha de peixe (~145 kg/mês) e o óleo (~58 kg/mês) usados na ração.
- Custo de ração cai de R$ 6.098 para **R$ 5.169** (2.904 kg × R$ 1,78 — −R$ 929/mês).
- Excedente de farinha (~143 kg × R$ 4,00) gera receita de R$ 572/mês.
- Custo operacional da graxaria: +R$ 400/mês.
- **Ganho líquido da graxaria:** +R$ 1.101/mês.

### Fase 5: Energia Solar Fotovoltaica (26 kWp)
- O custo de energia nas linhas explícitas de OPEX (Sopradores R$ 1.050 + Bomba de Calor R$ 388 + CLP/LED R$ 220 = **R$ 1.658**) cai para a taxa mínima rural trifásica de **R$ 290**.
- **Economia mensal (linha OPEX energia):** ~R$ 1.368.
- *A energia da fábrica de ração e graxaria (~R$ 432/mês) está embutida no custo de R$ 2,10/kg da ração — a usina solar também cobre essas cargas, reduzindo o custo efetivo da ração, mas sem dupla contagem no lucro.*
- **Novo Lucro Mensal Final (após Fases 4 e 5 + linguiça + graxaria):** **~R$ 23.745**.

---

## Capital de Giro (6 Meses sem Faturamento)
Nos primeiros 6 meses, os tanques estão sendo ativados e nenhum lote atingiu peso de despesca. O OPEX roda gradualmente.
**Capital de giro necessário: ~R$ 90.000** (deve estar reservado antes de iniciar).

---

## Payback e Projeção

| Cenário | CAPEX Total | Capital Giro | Investimento Total | Lucro Mensal | Payback |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Operação Básica (Fases 1–3 + 2B, com linguiça) | R$ 288.610 | R$ 90.000 | R$ 378.610 | R$ 14.451 | **26 meses (2,2 anos)** |
| Operação Completa (Fases 1–5 + 2B, sem linguiça/graxaria) | R$ 523.410 | R$ 90.000 | R$ 613.410 | R$ 21.424 | **29 meses (2,4 anos)** |
| **Operação Completa + Linguiça + Graxaria** | **R$ 523.410** | **R$ 90.000** | **R$ 613.410** | **R$ 23.745** | **26 meses (2,2 anos)** |

*CAPEX das Fases 1–3 + 2B (R$ 288.610) = Fase 1 R$ 129.000 + Fase 2 R$ 47.250 + Fase 2B R$ 59.600 + Fase 3 R$ 52.760.*
*Nota: Fase 5 (Solar) pode ser financiada via PRONAF Eco, onde a parcela mensal aproxima-se da economia gerada na conta de luz.*

---

## Resumo Executivo (Cenário Operação Completa + Linguiça + Graxaria)

| Métrica | Valor |
| :--- | :--- |
| Investimento Total (Fase 1–5 + 2B + Giro) | R$ 613.410 |
| Faturamento Mensal (filé + linguiça + farinha excedente) | R$ 37.564 |
| Faturamento Anual | R$ 450.768 |
| OPEX Mensal (ração própria + solar + graxaria + linguiça) | R$ 13.819 |
| OPEX Anual | R$ 165.828 |
| **Lucro Operacional Mensal** | **R$ 23.745** |
| **Lucro Operacional Anual** | **R$ 284.940** |
| Margem Operacional | 63,2% |
| Payback (lucro operacional) | 2,2 anos |

### Comparativo de Cenários

| Cenário | Faturamento Mensal | Lucro Mensal | Margem | Payback |
| :--- | :---: | :---: | :---: | :---: |
| Base (só filé, R$ 45/kg, 100% B2B, sem linguiça, sem 18L:6D) | R$ 28.395 | R$ 7.217 | 25,4% | 3,5 anos |
| Completo s/ linguiça/graxaria (Fases 1–5 + 2B + 18L:6D) | R$ 34.122 | R$ 21.424 | 62,8% | 2,4 anos |
| **Completo + linguiça + graxaria + 18L:6D** | **R$ 37.564** | **R$ 23.745** | **63,2%** | **2,2 anos** |

---

## Depreciação, Tributos e Lucro Econômico

O lucro operacional acima não considera depreciação do imobilizado nem encargos tributários sobre receita bruta. Para análise de viabilidade real:

| Item | Cálculo | Impacto Mensal (R$) |
| :--- | :--- | :---: |
| Depreciação (CAPEX R$ 523.410 / 10 anos) | R$ 52.341/ano | −R$ 4.362 |
| FUNRURAL (2,1% sobre receita bruta rural) | R$ 37.564 × 2,1% | −R$ 789 |
| **Lucro Econômico Ajustado** | | **~R$ 18.594/mês** |

*FUNRURAL substitui o INSS patronal para produtores rurais. Produtores registrados como pessoa jurídica podem ter alíquotas distintas — consultar contador antes do início das operações. A depreciação não é desembolso de caixa; o payback usa o lucro operacional, não o econômico.*

---

## Análise de Sensibilidade (Cenário Completo + 18L:6D)

| Cenário | Preço Filé | Produção (vivo) | Faturamento Estimado | Lucro Operacional |
| :--- | :---: | :---: | :---: | :---: |
| **Base** | **R$ 47/kg** | **2.200 kg/mês** | **R$ 37.564** | **R$ 23.745** |
| Preço filé −20% | R$ 37,60/kg | 2.200 kg/mês | R$ 31.800 | R$ 17.980 |
| Produção −15% | R$ 47/kg | 1.870 kg/mês | R$ 32.000 | R$ 18.180 |
| Pessimista (−20% preço, −15% prod.) | R$ 37,60/kg | 1.870 kg/mês | R$ 27.100 | R$ 13.280 |
| Otimista (+15% preço, +10% prod.) | R$ 54/kg | 2.420 kg/mês | R$ 43.200 | R$ 29.380 |

**Ponto de equilíbrio (Break-even):**
- Receita de linguiça + farinha excedente: ~R$ 8.612/mês (independente do preço do filé)
- Receita mínima de filé para cobrir OPEX: R$ 13.819 − R$ 8.612 = **R$ 5.207**
- Volume de filé para venda: 616 kg → **preço mínimo de equilíbrio: R$ 8,45/kg** (muito abaixo do mercado)

*Conclusão: o projeto mantém fluxo de caixa positivo mesmo com quedas severas de preço, graças à diversificação (linguiça + graxaria) e à verticalização da ração e energia.*

### Projeção para o Milhão
Com lucro operacional anual de ~R$ 284.940, a marca de **R$ 1.000.000 em lucros acumulados** é atingida em **~3,5 anos** após o início das despescas. Reinvestindo os lucros iniciais para dobrar a capacidade, esse tempo cai para menos de 3 anos.

---

## Potencial Adicional — Ração para Terceiros (Pós Fase 4)

A fábrica de ração opera apenas ~19 h/mês para cobrir a demanda própria (2.904 kg ÷ 150 kg/h), deixando enorme capacidade ociosa disponível para venda a terceiros. Esta receita não está incorporada nas projeções base acima para manter conservadorismo — deve ser tratada como **upside** após a operação estabilizar.

| Cenário | Volume Adicional | Lucro Incremental/mês | Impacto no Payback |
| :--- | :---: | :---: | :---: |
| Conservador | 2.500 kg/mês | ~R$ 2.400/mês | Payback Fases 1–5 + 2B: 2,0 anos |
| Base | 5.000 kg/mês | ~R$ 5.100/mês | Payback Fases 1–5 + 2B: 1,7 anos |
| Otimista | 10.000 kg/mês | ~R$ 9.500/mês | Payback Fases 1–5 + 2B: 1,4 anos |

*Formulação para venda: Tier 2 (farinha de carne/ossos no lugar da farinha de peixe própria), custo ~R$ 2,25/kg, venda a R$ 3,50/kg. CAPEX adicional: R$ 0. Capital de giro adicional: ~R$ 10.000. Requisito: registro MAPA de fabricante de ração (já previsto). Ver detalhes em [Doc 04](04_Fabrica_de_Racao.md) e [Doc 08](08_Canais_de_Venda_e_Produtos.md).*
