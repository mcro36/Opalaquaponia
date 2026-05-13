# 05. Energia Solar Fotovoltaica (Fase 5)

## Resumo
Implantação de uma usina solar fotovoltaica de **26 kWp** para suprir a demanda energética total do projeto (sopradores, bomba de calor, automação, fábrica de ração e graxaria), reduzindo a conta de luz para a taxa mínima e aumentando o lucro operacional.

## Demanda Energética do Projeto (Operação Completa)

A demanda inclui cargas contínuas (24h/dia) e cargas intermitentes da fábrica de ração e graxaria:

### Cargas Contínuas
| Equipamento | Potência Média (kW) | Horas/dia | kWh/mês |
| :--- | :---: | :---: | :---: |
| Sopradores (2 × 2CV, com inverter) | 1,8 | 24 | 1.296 |
| Bomba de Calor (média anual) | 1,4 | 24 | 997 |
| CLP, sensores, alimentadores | 0,28 | 24 | 200 |
| **Subtotal contínuo** | **3,48** | | **2.493 kWh/mês** |

### Cargas Intermitentes (Fases 4 em diante)
| Equipamento | Potência (kW) | Horas/mês | kWh/mês |
| :--- | :---: | :---: | :---: |
| Extrusora (15–25 CV) | 11,0 | 20 | 220 |
| Moinho + misturador | 3,5 | 8 | 28 |
| Digestor + secador graxaria | 8,0 | 30 | 240 |
| Prensa de parafuso | 2,0 | 10 | 20 |
| **Subtotal intermitente** | | | **508 kWh/mês** |

**Vantagem:** As cargas intermitentes operam predominantemente durante o dia, com alta taxa de auto-consumo solar (sem injeção na rede). Isso melhora o aproveitamento do sistema.

| | kWh/mês |
|:---|:---:|
| **TOTAL DEMANDA** | **3.001 kWh/mês** |
| Custo estimado na tarifa CEMIG (R$ 0,85/kWh) | ~**R$ 2.551/mês** |

---

## Avaliação: Off-Grid com Gerador para Aeração

**Pergunta:** Um gerador pequeno dedicado aos sopradores (carga crítica 24/7) seria mais econômico do que a usina solar?

**Cálculo:**
- Sopradores: 1,8 kW médio × 24h × 30 dias = 1.296 kWh/mês
- Gerador 3 kVA a 60% de carga: consumo de ~0,6 L/h de gasolina
- Custo mensal de combustível: 0,6 × 24 × 30 × R$ 6,00 = **R$ 2.592/mês**
- vs. custo na rede CEMIG para os mesmos 1.296 kWh: **R$ 1.102/mês**

**Conclusão: off-grid com gerador custa 2,4× mais que a rede elétrica para operação 24/7.** O gerador da Fase 2 (já no CAPEX) cumpre seu papel como **backup de emergência** (≤8h de autonomia com 20 L), não como fonte primária. A usina solar on-grid é a solução correta.

---

## Dimensionamento do Sistema

Belo Horizonte possui excelente irradiação solar, com média de **5,0 HSP/dia** ao longo do ano.

- **Consumo alvo:** 3.001 kWh/mês
- **Fator de perdas do sistema:** 20% (rendimento de 80%)
- **Cálculo da Potência:** `3.001 / (5,0 × 30 × 0,80) = 25,0 kWp`

### Especificação Recomendada
- **Potência instalada:** 26 kWp
- **Painéis:** ~40 módulos de 650W bifaciais (tecnologia TOPCon — maior eficiência e menor área por kWp).
- **Inversor:** 1 inversor string de 25 kW.
- **Área necessária:** ~130 m²

**Economia de espaço vs. especificação anterior:** Usando painéis bifaciais de 650W em vez de 550W, o sistema de 26 kWp utiliza apenas 40 módulos — mesmo número que 22 kWp com painéis de 550W. A área por kWp reduz de 2,9 para **2,5 m²/kWp**.

---

## Impacto da Legislação (Lei 14.300 — Marco Legal da GD)

Como o projeto consome energia 24h por dia e o sol gera apenas durante o dia (~10h), estima-se que **45% do consumo será simultâneo** à geração (sem taxas) e **55% será injetado na rede** e compensado à noite. As cargas intermitentes da fábrica operam de dia, elevando o auto-consumo efetivo.

A energia injetada está sujeita à cobrança do **Fio B**:
- **Cenário atual (2026):** O produtor paga 60% do valor do Fio B sobre a energia compensada.
- O crédito gerado na rede CEMIG vale ~75% da tarifa cheia.
- A economia efetiva supera **85%**. A conta cairá de ~R$ 2.551 para apenas a **taxa mínima de disponibilidade + iluminação pública** (estimada em ~R$ 290/mês para tarifa rural trifásica).

### Atenção — Homologação CEMIG para Sistemas > 10 kWp
Sistemas acima de 10 kWp em baixa tensão podem exigir **Estudo de Impacto na Rede (EPIN)** pela CEMIG antes da aprovação. Providenciar com antecedência de **3–9 meses** antes da instalação. O projeto de engenharia e ART já estão incluídos no CAPEX para cobrir essa etapa.

---

## Benefício Financeiro
- **Custo atual (com Fases 1–4):** ~R$ 2.551/mês
- **Custo com solar:** ~R$ 290/mês (taxa mínima)
- **Economia mensal:** **R$ 2.261/mês**
- **Economia anual:** **R$ 27.132/ano**
- **Payback da usina solar:** ~4,4 anos.
- **Vida útil dos painéis:** 25 anos.

*Obs: A economia maior vs. especificação anterior (R$ 2.261 vs. R$ 1.830) reflete a inclusão das cargas da fábrica de ração e graxaria que não estavam no cálculo original.*

---

## Riscos e Limitações
- **Sombreamento:** Instalações próximas a árvores de grande porte reduzem a eficiência drasticamente. Estruturas de solo afastadas dos tanques podem ser preferíveis ao telhado.
- **Limpeza:** O acúmulo de poeira reduz a geração em até 15%. Lavagem dos painéis a cada 3–4 meses (fora do período de chuvas).
- **Homologação CEMIG:** Prazo de aprovação pode ser de 3–9 meses para sistemas > 10 kWp. Iniciar processo com antecedência antes de comprar os equipamentos.

---

## Custos Estimados — Fase 5

| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Sistema Fotovoltaico 26 kWp (painéis bifaciais 650W + inversor + estruturas) | 1 | 106.000 |
| Projeto de engenharia, ART e homologação CEMIG | 1 | 3.500 |
| Mão de obra de instalação e elétrica | 1 | 2.700 |
| **TOTAL FASE 5** | | **R$ 112.200** |
