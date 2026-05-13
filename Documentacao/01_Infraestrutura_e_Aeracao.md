# 01. Infraestrutura e Aeração (Fase 1)

## Resumo
Montagem dos 6 tanques circulares de geomembrana (60m³ cada, Ø 7,40m × 1,40m útil) em dois patamares com desnível de 2,5m. O sistema utiliza Airlifts para circulação de água e design Cornell Dual-Drain para autolimpeza, eliminando bombas elétricas submersas.

## Modelo Operacional (Ciclo dos Tanques)
Os peixes **permanecem no mesmo tanque** durante todo o ciclo de 6 meses. Não há transferência entre tanques.

1. Mês 1: T1 recebe alevinos.
2. Mês 2: T2 recebe alevinos. T1 continua crescendo.
3. Meses 3-6: Os demais tanques são ativados sequencialmente.
4. Mês 7: T1 atinge peso de despesca (~850g). Peixes são transferidos ao **tanque de depuração** (purga 3-5 dias). T1 é limpo e repovoado com alevinos.
5. Mês 8: T2 é despescado. E assim por diante — **uma despesca por mês**.

## Dimensionamento de Biomassa (Regime Estável)
Após os primeiros 6 meses, cada tanque estará em um estágio diferente do ciclo:

| Tanque | Mês do Ciclo | Peso Médio (g) | Nº Peixes | Biomassa (kg) |
| :---: | :---: | :---: | :---: | :---: |
| Ciclo 1 | 1 | 10-50 | 2.900 | 87 |
| Ciclo 2 | 2 | 50-150 | 2.750 | 275 |
| Ciclo 3 | 3 | 150-300 | 2.650 | 596 |
| Ciclo 4 | 4 | 300-500 | 2.600 | 1.040 |
| Ciclo 5 | 5 | 500-700 | 2.570 | 1.542 |
| Ciclo 6 | 6 | 700-850 | 2.550 | 1.913 |
| **TOTAL** | | | | **5.453 kg** |

*Mortalidade acumulada considerada: ~10% alevinagem, ~3% recria, ~1-2% engorda.*

## Aeração (O Pulmão)
- **Sopradores de Canal Lateral:** 2 unidades de 2.0 CV, operando em rede mestra de PVC (75-100mm) com distribuição em anel (Ring Main).
- **Difusores:** Mangueiras microperfuradas (Aero-Tube) lastreadas no fundo de cada tanque.

## Hidrodinâmica: Design Cornell Dual-Drain
Para garantir a autolimpeza eficiente em tanques de 7,4m de diâmetro, o projeto adota o design comprovado pela Cornell University:

### Entrada Tangencial
- A tubulação de retorno de água (dos Airlifts ou da Bomba de Calor) entra no tanque por **bocais tangenciais ajustáveis** posicionados na parede, na altura da linha d'água.
- A força do jato de entrada cria a rotação constante (vórtice).

### Duplo Dreno
- **Dreno central de fundo (5-20% do fluxo):** Remove água concentrada em sólidos (fezes e restos de ração). O fundo do tanque deve ter inclinação cônica mínima de 5% em direção ao centro.
- **Dreno lateral elevado (80-95% do fluxo):** Remove água "limpa" da coluna superior para recirculação.

### Airlifts (Bombeamento a Ar)
- O ar proveniente dos sopradores é injetado em tubos verticais dentro d'água, arrastando a coluna líquida para cima (Princípio de Arquimedes).
- A saída do Airlift alimenta os bocais tangenciais, mantendo o vórtice sem custo elétrico adicional.

### Limpeza por Gravidade
- O desnível de 2,5m entre os patamares do terreno permite que a descarga do dreno central dos tanques superiores escoe por gravidade para um decantador no nível inferior.

## 7º Tanque — Depuração + Buffer Térmico

A despesca de ~1.913 kg vivos é realizada em **3 lotes por mês** (~638 kg/lote, ~750 peixes). Para não imobilizar um dos 6 tanques de produção durante a purga (3–5 dias), o projeto inclui um **7º tanque do mesmo padrão dos demais (60m³, Ø 7,40m)**, que cumpre função dupla:

### Função 1 — Depuração
- Cada lote fica em jejum com fluxo contínuo de água pré-aquecida por 3–5 dias antes do abate.
- Teste sensorial antes da liberação: cozinhar uma amostra e avaliar sabor/odor.
- 60m³ = espaço confortável para ~750 peixes → menor estresse → depuração mais eficiente.

### Função 2 — Buffer Térmico (Pré-Aquecedor da Água de Reposição)

A água do poço artesiano chega a ~18°C no inverno. Se inserida diretamente nos tanques de produção, geraria pico de carga térmica de +8,7 kW sobre a bomba de calor (exigiria bomba de 100k BTU/h). O 7º tanque elimina esse problema:

- **Toda a água de reposição nova (poço) entra exclusivamente no 7º tanque.**
- Cada renovação de 3 m³ reduz a temperatura do 7º tanque em apenas **~0,5°C** (3/60 × ΔT 10°C) — sem pico de demanda.
- A bomba de calor compensa esse delta gradualmente ao longo de horas.
- Os tanques de produção 1–6 recebem apenas água já aquecida, saída do 7º tanque. Nunca há choque térmico.

**Modo de operação do 7º tanque:**
| Período | Temperatura Alvo | Finalidade |
| :--- | :---: | :--- |
| Fora da depuração (25 dias/mês) | 22–24°C | Pré-aquecedor — minimiza carga na bomba |
| Durante depuração (3–5 dias/mês) | 28°C | Condição ideal para purga de geosmina |

Com este design, a bomba de calor de **80.000 BTU/h (COP ≥ 5)** é suficiente — os tanques de produção só enfrentam a carga estrutural (16,2 kW), dentro da capacidade nominal de 23 kW.

- **Aeração:** Derivação da rede mestra existente (Ring Main) — sem custo de soprador adicional.
- **Dreno:** Cornell Dual-Drain completo, mesmo padrão dos 6 tanques de produção (facilita construção e manutenção uniformes).

## Sala de Processamento (Adequação SIE-MG)

Para atender ao SIE-MG (obrigatório para venda em todo o estado de MG), a primeira despesca (mês 7) já requer instalações certificadas de abate e filetagem. A sala é implantada na Fase 1, antes do início do faturamento.

**Exigências mínimas SIE-MG para pescado:**
- Piso cerâmico ou epóxi antiderrapante com ralo sifonado
- Revestimento lavável nas paredes (azulejo ou tinta epóxi) até 1,5 m
- Mesa de filetagem em aço inox
- Tanque de lavagem em aço inox com água corrente
- Ventilação/exaustão mecânica
- Separação física entre área de abate (suja) e área de filetagem/embalagem (limpa)

## Riscos e Limitações
- **Velocidade do vórtice:** Se a vazão dos Airlifts for insuficiente para manter a rotação em tanques de 7,4m, pode ser necessário adicionar mais de um ponto de injeção tangencial por tanque (2 a 3 bocais distribuídos).
- **Fundo cônico:** A inclinação mínima de 5% é essencial. Sem ela, os sólidos não migram para o dreno central e a qualidade da água degrada.
- **Terraplenagem em corte:** Os dois patamares são formados por escavação no talude existente (corte de terra), sem aterro. A base dos tanques (60 toneladas cada) assenta sobre solo natural compactado mecanicamente — sem risco de recalque diferencial de aterro. A terra removida pode ser aproveitada para nivelar áreas adjacentes.

## Processamento — Linguiça de Tilápia

A produção de linguiça começa na **primeira despesca (mês 7)**, junto com a filetagem. O projeto produz dois tipos:

- **Linguiça fresca:** shelf life de 5–7 dias refrigerada / 3–6 meses congelada. Embalagem a vácuo simples.
- **Linguiça defumada:** shelf life de 20–30 dias refrigerada / até 12 meses congelada. Maior valor percebido; defumador semi-industrial instalado na Fase 1.

Os equipamentos são instalados na Fase 1 para que o processamento integral esteja operacional desde o início do faturamento. Ver dimensionamento completo em [Doc 08 — Canais de Venda e Produtos](08_Canais_de_Venda_e_Produtos.md).

---

## Custos Estimados — Fase 1

### Infraestrutura e Aeração
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Tanques geomembrana (60m³) c/ estrutura metálica | 6 | 48.000 |
| Sopradores Canal Lateral 2.0 CV | 2 | 10.000 |
| Material hidráulico (tubulações, drenos, bocais tangenciais) | 1 | 8.000 |
| Material aeração (mangueiras, conexões) | 1 | 4.500 |
| Escavação e preparação do terreno em corte (2 patamares) | 1 | 7.000 |
| Elétrica básica (quadro, cabos, disjuntores) | 1 | 3.500 |
| Primeiro lote de alevinos (genética GenoMar/Supreme) | 1 | 2.500 |
| Ferramentas de manejo (redes, balanças, kits teste) | 1 | 1.500 |
| **Subtotal Infraestrutura** | | **R$ 85.000** |

### 7º Tanque — Depuração + Buffer Térmico
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Tanque geomembrana 60m³ (Ø 7,40m) c/ estrutura metálica — mesmo padrão Tanques 1–6 | 1 | 8.000 |
| **Subtotal 7º Tanque** | | **R$ 8.000** |

### Sala de Processamento — Adequação SIE
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Piso epóxi antiderrapante + ralo sifonado | 1 | 2.000 |
| Revestimento lavável paredes (azulejo/tinta epóxi) | 1 | 1.500 |
| Mesa de filetagem inox | 1 | 1.500 |
| Tanque de lavagem inox | 1 | 800 |
| Exaustão mecânica | 1 | 1.200 |
| Instalações hidráulicas (água quente/fria) | 1 | 1.000 |
| Chest freezer adicional 400 L (produto acabado) | 1 | 2.000 |
| **Subtotal Processamento SIE** | | **R$ 10.000** |

### Processamento — Linguiça e Defumação
| Item | Qtd | Valor (R$) |
| :--- | :---: | :--- |
| Moedor industrial de carne | 1 | 4.000 |
| Embutideira industrial | 1 | 4.500 |
| Seladora a vácuo | 1 | 2.500 |
| Freezer horizontal adicional 200 L | 1 | 2.000 |
| Defumador semi-industrial (câmara 50–100 kg/lote) | 1 | 4.000 |
| **Subtotal Linguiça + Defumação** | | **R$ 17.000** |

| | |
| :--- | :--- |
| **TOTAL FASE 1** | **R$ 120.000** |
