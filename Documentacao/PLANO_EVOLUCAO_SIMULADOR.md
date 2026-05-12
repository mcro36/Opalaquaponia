# Plano de Evolução do Simulador RJ Piscicultura

Aplicação em **React + Next.js** que consolida todas as regras de negócio da documentação técnica em um simulador interativo e editável para **produção intensiva de tilápia em Belo Horizonte, MG**.

---

## Stack Tecnológico

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| Framework | Next.js 14+ (App Router) | SSG, rotas por pasta |
| UI | React 18 + Componentes funcionais | Estado reativo |
| Estilo | CSS Modules + CSS Variables | Escopo isolado, tema dark/light |
| Gráficos | Recharts ou react-chartjs-2 | Interativos e responsivos |
| Estado | React Context + useReducer | Centralizado sem libs externas |
| Persistência | localStorage + JSON export/import | Offline-first |
| Build | Next.js (output: export) | Site estático, sem servidor |

---

## Sprints de Desenvolvimento

### Sprint 1: Fundação e Navegação
- [ ] Criar projeto Next.js
- [ ] Contexto global (`ProjectContext.tsx`) com persistência em localStorage
- [ ] Sidebar com navegação ativa

### Sprint 2: Dashboard Financeiro
- [ ] KPI Cards: CAPEX (meta < R$ 350k), OPEX, Lucro, Payback, FCA, ROI
- [ ] Gráfico de barras: CAPEX por Fase
- [ ] Tabela OPEX mensal (baseado nos toggles de Ração Própria e Energia Solar)
- [ ] Capital de giro: barra de progresso dos 6 meses de ramp-up

### Sprint 3: Painéis Técnicos e Toggles
- [ ] Painel Tanques (Fase 1)
- [ ] Painel Climatização (Fase 3) - Custo sazonal Bomba de Calor
- [ ] Toggle **Fábrica de Ração (Fase 4)**: recalcula OPEX com R$ 2,10/kg
- [ ] Toggle **Energia Solar (Fase 5)**: reduz custo de energia para taxa mínima e soma +R$ 91.200 no CAPEX
- [ ] Toggle **Gerador de Emergência**: se OFF, simular mortalidade anual.

---

# REGRAS DE NEGÓCIO (Motor do Simulador)

## BLOCO A: Ciclo dos Tanques
- Os peixes **ficam no mesmo tanque** por 6 meses.
- Um tanque é ativado por mês. Após 6 meses, 1 despesca/mês em rodízio.
- Mortalidade cumulativa: ~13-15% do alevino à despesca.

## BLOCO B: Ração (Comercial vs. Própria)
```javascript
const calcularCustoRacao = (fabricaAtiva) => {
  return tanques.reduce((total, tanque) => {
    const custoKg = fabricaAtiva ? 2.10 : tabelaComercial[tanque.estagio].preco;
    return total + (tanque.biomassa * tanque.taxaDiaria * 30 * custoKg);
  }, 0);
};
```

## BLOCO C: Energia (Rede vs. Solar)
O custo energético é a soma dos Sopradores + Bomba de Calor (Sazonal BH) + Automação.

```javascript
const calcularCustoEnergia = (mes, solarAtiva) => {
  if (solarAtiva) return 290.00; // Taxa mínima rural CEMIG
  
  const perdaTermica = 1.01 * (28 - tempMediaBH[mes]);
  const custoBomba = (perdaTermica / 5.0) * 24 * 30 * 0.85;
  const custoSopradoresOutros = 1220.00; // R$ 1.050 sopradores + R$ 170 automação
  
  return custoBomba + custoSopradoresOutros;
};
```

## BLOCO D: Faturamento
- Faturamento = `pesoDespesca(1.913 kg) × rendimento(0.33) × precoVenda(45.00)`
- Faturamento mensal: **R$ 28.395**.

## BLOCO E: CAPEX Modular
O CAPEX aumenta à medida que as Fases (Toggles) são ativadas.

| Módulo Obrigatório | Valor |
| :--- | :---: |
| Fase 1 (Infra e Aeração) | R$ 85.000 |
| Fase 2 (Automação e Gerador) | R$ 47.800 |
| Fase 3 (Climatização) | R$ 54.100 |
| Licenças MG | R$ 9.000 |
| **Total Base** | **R$ 195.900** |

**Toggles Opcionais:**
- Fase 4 (Fábrica Ração) = + R$ 62.600
- Fase 5 (Solar 21 kWp) = + R$ 91.200

## BLOCO F: Capital de Giro
- FIXO: ~R$ 90.000. Corresponde ao custo de manter os tanques funcionando nos primeiros 6 meses até a primeira venda ocorrer.
