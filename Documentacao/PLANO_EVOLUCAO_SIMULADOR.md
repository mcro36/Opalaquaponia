# Plano de Evolução do Simulador Opala Aquaponia

Aplicação completa em **React + Next.js** que consolida todas as informações da pasta `Documentacao` em um simulador interativo, editável e com regras de negócio realistas para **produção super-intensiva de tilápia em Belo Horizonte, MG**.

---

## Stack Tecnológico

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | SSG, rotas por pasta, API routes futuras |
| **UI** | React 18 + Componentes funcionais | Estado reativo, composição |
| **Estilo** | CSS Modules + CSS Variables | Escopo isolado, tema dark/light |
| **Gráficos** | Recharts ou react-chartjs-2 | Interativos e responsivos |
| **Estado** | React Context + useReducer | Centralizado sem libs externas |
| **Persistência** | localStorage + JSON export/import | Offline-first |
| **Build** | Next.js (output: export) | Site estático, sem servidor |

---

## Mapeamento de Dados → Módulos

| Documento | Dados | Módulo |
| :--- | :--- | :--- |
| 1_Aeração | Biomassa/tanque, vazão ar, sopradores | `/tecnico/aeracao` |
| 2_Automação | Sensores, CLP, lógica smart | `/tecnico/automacao` |
| 3_Alimentação | Termorregulação, alimentadores, IA | `/tecnico/alimentacao` |
| 4_Segurança | Biofloco, off-flavor, energia | `/riscos` |
| 5_Ração Circular | Extrusora, silagem, lentilha | `/tecnico/racao` |
| 6_Financeiro | CAPEX/OPEX resumo, ROI | `/dashboard` |
| 7_Plano Negócios | Fases, cronograma, expansão | `/roadmap` |
| 8_Riscos | Riscos térmicos, químicos | `/riscos` |
| 9_CAPEX | Itens de investimento | `/financeiro/capex` |
| 10_OPEX | Custos recorrentes | `/financeiro/opex` |

---

## FASE 1: Fundação Next.js e Navegação (Sprint 1)

### Tarefas
- [ ] Criar projeto com `npx create-next-app@latest`
- [ ] Estrutura de pastas:
  ```
  app/
    layout.tsx        → Shell (Sidebar + Header)
    page.tsx          → Dashboard principal
    tecnico/aeracao|automacao|alimentacao|racao/page.tsx
    financeiro/capex|opex/page.tsx
    roadmap/page.tsx
    riscos/page.tsx
    clima/page.tsx
    mercado/page.tsx
  components/  → Sidebar, KpiCard, EditableTable, PhaseTimeline, RiskCard
  contexts/    → ProjectContext.tsx (useReducer)
  data/        → initialState.json (dados piloto)
  ```
- [ ] `ProjectContext` com actions: ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, SET_PHASE, UPDATE_PARAM
- [ ] Persistência via `localStorage`
- [ ] Sidebar com ícones e navegação ativa

---

## FASE 2: Dashboard com KPIs (Sprint 2)

- [ ] KPI Cards animados: CAPEX, OPEX, Lucro, Payback, FCA, ROI
- [ ] Gráfico de Barras: CAPEX por categoria
- [ ] Gráfico de Pizza: OPEX por tipo
- [ ] Mini-Roadmap horizontal com "Você está aqui"
- [ ] Alertas Quick-View (riscos ativos)

---

## FASE 3: Painel Técnico Editável (Sprint 3)

- [ ] **Aeração**: Tabela biomassa editável → cálculo automático de vazão
- [ ] **Automação**: CRUD de sensores com custo unitário
- [ ] **Alimentação**: Slider de temperatura → impacto em BTU
- [ ] **Ração Circular**: Toggle ON/OFF → impacto dinâmico no OPEX

---

## FASE 4: CAPEX & OPEX CRUD (Sprint 4)

- [ ] `<EditableTable>` com edição inline, agrupamento, subtotais
- [ ] Coluna "Status" (Planejado / Comprado / Instalado)
- [ ] OPEX: auto-cálculo Anual = Mensal × 12
- [ ] Exportação: JSON, CSV, print-friendly

---

## FASE 5: Roadmap + Cash Flow (Sprint 5)

- [ ] Timeline vertical: Piloto (5m³) → 10m³ → 30m³ → 60m³
- [ ] Slider de Aporte Mensal → timeline recalcula
- [ ] Fluxo de Caixa mensal com projeção 12-36 meses
- [ ] Indicador "Fase Atual"

---

## FASE 6: Riscos + Sanidade + Água (Sprint 6)

- [ ] `<RiskCard>` com severidade, CRUD de riscos
- [ ] Alertas automáticos ligados ao CAPEX
- [ ] Score de Risco (gauge 0-100)
- [ ] Painel de qualidade da água com alertas

---

## FASE 7: Clima BH + Mercado + Regulatório (Sprint 7)

- [ ] Perfil térmico de BH com impacto na produção
- [ ] Canais de venda com preços por canal
- [ ] Checklist de licenças (SIM, SIE, SIF, IGAM)

---

## FASE 8: Polimento e PWA (Sprint 8)

- [ ] Tema Dark/Light, Responsivo, Micro-animações
- [ ] PWA offline, Página de impressão/relatório

---

# REGRAS DE NEGÓCIO COMPLETAS

> [!IMPORTANT]
> As regras abaixo tornam o simulador uma ferramenta de **decisão real** para BH, MG.

---

## BLOCO A: Análise Climática — Belo Horizonte, MG

BH possui clima tropical de altitude (Köppen **Cwb**), com inverno seco e frio que impacta diretamente a produção.

### Perfil Térmico Mensal (Ar / Água Estimada)

| Mês | Ar Média (°C) | Água Est.* (°C) | Impacto |
| :--- | :---: | :---: | :--- |
| **Jan** | 23 | 26-28 | 🟢 Ótimo. Crescimento máximo |
| **Fev** | 23 | 26-28 | 🟢 Ótimo |
| **Mar** | 22 | 25-27 | 🟢 Ótimo |
| **Abr** | 21 | 23-25 | 🟡 Bom. Leve redução apetite |
| **Mai** | 18 | 20-22 | 🟠 Alerta. FCA sobe 15-20% |
| **Jun** | 17 | 18-20 | 🔴 Crítico. Metabolismo -40% |
| **Jul** | 17 | 17-19 | 🔴 Crítico. Parada alimentar |
| **Ago** | 19 | 19-21 | 🟠 Alerta. Recuperação lenta |
| **Set** | 21 | 21-23 | 🟡 Bom. Retomada gradual |
| **Out** | 22 | 24-26 | 🟢 Ótimo |
| **Nov** | 22 | 25-27 | 🟢 Ótimo |
| **Dez** | 22 | 26-28 | 🟢 Ótimo |

*Tanques de 5m³ têm inércia térmica muito baixa — seguem o ar com defasagem de ~12-24h.*

### Zonas de Comportamento da Tilápia
```
ZONA_OTIMA   = 25-30°C  → Crescimento 100%, FCA base
ZONA_BOA     = 22-25°C  → Crescimento 85%, FCA +10%
ZONA_ALERTA  = 18-22°C  → Crescimento 50%, FCA +30%, alimentação só diurna
ZONA_CRITICA = <18°C    → Crescimento 0%, imunidade baixa, RISCO DE MORTE
ZONA_LETAL   = <12°C    → Mortalidade iminente
```

> [!CAUTION]
> **Em BH, sem climatização, a produção fica inviável por 3-4 meses/ano** (Jun-Ago). A bomba de calor não é luxo — é **pré-requisito**. O simulador deve bloquear o cálculo de lucro nesses meses se a climatização estiver desativada.

---

## BLOCO B: Variáveis Biológicas

### 11. Curva de Crescimento por Temperatura (Dias-Grau)
```
ganhoPesoDia = ganhoPesoBase × fatorTemperatura[mes] × fatorGenetica
diasParaDespesca = (pesoAlvo - pesoAlevino) / ganhoPesoDia

// Com climatização (28°C): 1g → 800g em ~180 dias (6 meses)
// SEM climatização em BH:  1g → 800g em ~280 dias (9+ meses)
// Custo extra sem clima: 3 meses de ração + energia + mão de obra
```

### 12. FCA por Estágio de Vida
| Estágio | Peso (g) | FCA Esperado | Proteína Ração |
| :--- | :--- | :--- | :--- |
| Alevinagem | 1-30 | 0.8-1.0 | 40-45% |
| Recria I | 30-150 | 1.0-1.2 | 36-40% |
| Recria II | 150-400 | 1.2-1.4 | 32-36% |
| Engorda | 400-800 | 1.3-1.6 | 28-32% |

FCA médio ponderado = Σ(FCA_estagio × %biomassa_estagio).

### 13. Genética e Linhagem
- **GIFT**: +15% ganho de peso vs. linhagens
- **Chitralada**: Melhor adaptação ao frio
- Simulador: seletor de linhagem → ajusta crescimento e tolerância ao frio

### 14. Reversão Sexual
- 100% machos obrigatório (+30% crescimento)
- Custo: R$ 0.30-0.50/un vs. R$ 0.15 sem reversão

### 15. Mortalidade por Fase
| Fase | Mortalidade | Causa |
| :--- | :--- | :--- |
| Transporte | 5-10% | Estresse, ΔT |
| Alevinagem | 8-15% | Canibalismo |
| Recria | 3-5% | Doenças |
| Engorda | 1-3% | Oportunistas |
```
alevinosNecessarios = (biomassaAlvo / pesoAlvo) / Π(1 - mortalidade[fase])
// Para 175kg a 800g = 219 peixes → comprar ~274 alevinos
```

---

## BLOCO C: Qualidade de Água

### 16. Parâmetros Completos
| Parâmetro | Ideal | Crítico | Impacto |
| :--- | :--- | :--- | :--- |
| OD (mg/L) | 5-8 | <3 (letal) | Crescimento, FCA |
| pH | 6.5-8.5 | <5 / >9 | Toxicidade NH3 |
| NH3 Total (mg/L) | <1.0 | >2.0 | Lesões branquiais |
| NH3 Não-Ionizada | <0.02 | >0.05 | ALTAMENTE TÓXICA |
| Nitrito (mg/L) | <0.5 | >1.0 | Sangue marrom |
| Alcalinidade (CaCO3) | 80-150 | <40 | Colapso tampão |
| CO2 (mg/L) | <10 | >20 | Asfixia |
| SST (mg/L) | 300-500 | >800 | Entupimento |
| Temp (°C) | 25-30 | <18 / >33 | Ver Bloco A |

### 17. Gestão de Biofloco (BFT)
```
relacaoCN = 15-20:1  (ideal)
volumeMelaco = (racaoDia × 0.5 × 0.7) / 0.5  // kg melaço/dia
// Se SST > 800 → remover sólidos
// Se SST < 200 → adicionar carbono
```

---

## BLOCO D: Sanidade

### 18. Protocolos
| Doença | Agente | Gatilho | Prevenção |
| :--- | :--- | :--- | :--- |
| Estreptococose | *Streptococcus* | >28°C + estresse | Vacinação |
| Columnaris | *Flavobacterium* | Lesões + água ruim | Sal 3g/L |
| Aeromonose | *Aeromonas* | Inverno (imuno↓) | Evitar ΔT >3°C/dia |
| Ictio | *Ichthyophthirius* | Frio + alta densidade | Sal 5g/L |

- Se `ΔTemperatura > 3°C/24h` → ALERTA: "Risco de Aeromonas"
- Se `OD < 4mg/L por >2h` → ALERTA: "Imunossupressão"

---

## BLOCO E: Processamento e Mercado (BH)

### 19. Rendimento
```
rendimentoFileSemPele = 33%  // 30-36% ajustável
residuo = 67%  → silagem / ração circular
```

### 20. Canais de Venda em BH
| Canal | Preço/kg Filé | Volume |
| :--- | :--- | :--- |
| Direto (WhatsApp) | R$ 55-65 | Baixo |
| Feiras/Mercados | R$ 50-60 | Médio |
| Restaurantes | R$ 45-55 | Alto |
| CEASA-BH | R$ 35-45 | Muito Alto |
| E-commerce | R$ 60-75 | Baixo-Médio |

### 21. Regulamentação MG
- **SIM** (Municipal): Venda em BH
- **SIE-MG** (Estadual via IMA): Venda em MG
- **SIF** (Federal via MAPA): Venda nacional
- **Outorga**: IGAM-MG
- **Licenciamento**: COPAM/FEAM (>5 ton/ano)
- Custo estimado: R$ 5k - R$ 15k

---

## BLOCO F: Investimento Inteligente

> [!IMPORTANT]
> A **ordem** em que cada real é gasto define se o projeto sobrevive.

### 22. Priorização por Impacto
| # | Investimento | Justificativa | Quando |
| :---: | :--- | :--- | :--- |
| **1** | Climatização (Bomba Calor) | Sem isso, 4 meses parado em BH | Mês 1 |
| **2** | Aeração + Redundância | Sem OD não há vida | Mês 1 |
| **3** | Sensor OD (mínimo 2) | Variável #1 | Mês 1 |
| **4** | Gerador/QTA | 1 blackout = perda total | Mês 2-3 |
| **5** | Automação alimentação | Maior impacto no FCA | Mês 4-6 |
| **6** | Sensores pH + Amônia | Previne perdas silenciosas | Mês 6-9 |
| **7** | IA de Visão | Refinamento FCA | Mês 12+ |
| **8** | Fábrica Ração | Só viável com >500kg/mês | Fase Industrial |

### 23. Gatilhos de Expansão (Semáforo)
```
expansaoPermitida = 
  ciclosCompletos >= 3          AND
  mortalidadeMedia < 8%         AND
  fcaMedio < 1.4                AND
  capitalDisponivel >= capexNextFase × 0.7  AND
  margemOperacional > 15%
```

---

## BLOCO G: Motores de Cálculo

### R1. Biomassa com Sazonalidade BH
```
fatorTemp = tabelaSazonalidade[mes]
ganhoPesoDia = base × fatorTemp × fatorGenetica
diasCiclo = (pesoAlvo - pesoAlevino) / ganhoPesoDia
```

### R2. Financeiro Completo
```
receitaBruta = fileMensal × preco[canal]
impostos = receitaBruta × aliquotaSimples  // 1.28% a 4.64%
custoRacao = biomassaGanha × FCA_ponderado × precoKg × (1 - descontoCircular)
custoEnergia = (sopradores + climatizacao) × horas × tarifa
depreciacaoMensal = capex / vidaUtilMeses
lucroLiquido = receitaBruta - impostos - opex - depreciacao
```

### R3. Capital de Giro (Cash Flow Gap)
```
// Peixe comprado no mês 1, vendido no mês 6
capitalGiroMinimo = opexMensal × 6
```

### R4. Energia Sazonal (BH)
```
energiaClima[Out-Mar] = 0  // Bomba calor OFF
energiaClima[Abr-Set] = potencia × horas × dias × tarifa
// Custo extra inverno: ~R$ 800-1.200/mês
```

### R5. Cenários Expandidos
| Cenário | FCA | Preço | Mort. | Clima | Resultado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Otimista | 1.0 | R$ 65 | 3% | Sim | Payback 18m |
| Realista | 1.2 | R$ 50 | 5% | Sim | Payback 31m |
| Pessimista | 1.5 | R$ 40 | 10% | Sim | Payback 60m |
| **Sem Aquec.** | 1.8 | R$ 50 | 15% | **NÃO** | **⛔ INVIÁVEL** |

---

## Módulos Adicionais Sugeridos

| Módulo | Função |
| :--- | :--- |
| `/clima` | Perfil térmico BH + impacto produção |
| `/agua` | Parâmetros de qualidade + alertas |
| `/sanidade` | Doenças e gatilhos de risco |
| `/processamento` | Rendimento filé, resíduos, cadeia frio |
| `/mercado` | Canais de venda, preços, volume |
| `/regulatorio` | Checklist licenças com status |
| `/cashflow` | Fluxo de caixa 12-36 meses |

---

## Resumo Final

| Fase | Foco | Complexidade |
| :--- | :--- | :---: |
| 1 | Next.js + Navegação + Context | ⭐⭐ |
| 2 | Dashboard + KPIs + Gráficos | ⭐⭐ |
| 3 | Painel Técnico Editável | ⭐⭐⭐ |
| 4 | CAPEX/OPEX CRUD + Export | ⭐⭐⭐ |
| 5 | Roadmap + Cash Flow | ⭐⭐⭐ |
| 6 | Riscos + Sanidade + Água | ⭐⭐⭐ |
| 7 | Clima BH + Mercado + Regulatório | ⭐⭐ |
| 8 | Polimento, PWA, Responsivo | ⭐⭐ |
