import * as CONST from '../data/constants';

interface StressParams {
  marketCrash?: boolean;
  feedCrisis?: boolean;
  climateDisaster?: boolean;
  highMortality?: boolean;
}

/**
 * Retorna o custo do kg da ração baseado no estágio e se a fábrica própria está ativa.
 */
export function getFeedCostPerKg(stageMonth: number, ownFeedEnabled: boolean, stress?: StressParams): number {
  let baseCost = 0;
  if (ownFeedEnabled) {
    baseCost = stageMonth <= 2 ? CONST.OWN_FEED_INITIAL_COST_KG : CONST.OWN_FEED_COST_KG;
  } else {
    const stage = CONST.GROWTH_STAGES.find(s => s.month === stageMonth);
    baseCost = stage ? stage.feedCostKg : 4.00;
  }

  if (stress?.feedCrisis) {
    baseCost *= 1.4; // Aumento de 40% no custo da ração
  }
  return baseCost;
}

/**
 * Calcula o custo mensal de ração.
 */
export function calcFeedCostMonthly(ownFeedEnabled: boolean, stress?: StressParams): number {
  return CONST.GROWTH_STAGES.reduce((total, stage) => {
    const costKg = getFeedCostPerKg(stage.month, ownFeedEnabled, stress);
    const monthlyConsumption = stage.biomassKg * stage.feedRate * 30;
    return total + (monthlyConsumption * costKg);
  }, 0);
}

/**
 * Calcula o custo da bomba de calor para um determinado mês (1-12).
 */
export function calcHeatPumpCost(month: number, stress?: StressParams): number {
  const climate = CONST.BH_CLIMATE.find(c => c.month === month);
  if (!climate) return 0;

  let ambientTemp = climate.avgTemp;
  if (stress?.climateDisaster) {
    ambientTemp -= 5; // Inverno 5°C mais frio que a média
  }

  const deltaT = Math.max(0, CONST.TARGET_WATER_TEMP - ambientTemp);
  const powerKw = deltaT * CONST.HEAT_LOSS_PER_DEGREE_KW;
  const monthlyKwh = (powerKw * 24 * 30) / CONST.HEAT_PUMP_COP;
  
  return monthlyKwh * CONST.CEMIG_TARIFF_KWH;
}

/**
 * Calcula o custo total de energia mensal.
 */
export function calcEnergyCostMonthly(month: number, solarEnabled: boolean, climateControlEnabled: boolean, stress?: StressParams): number {
  const heatPumpCost = climateControlEnabled ? calcHeatPumpCost(month, stress) : 0;
  const baseEnergy = CONST.BLOWER_MONTHLY_COST + CONST.AUTOMATION_MONTHLY_COST;
  const totalCost = baseEnergy + heatPumpCost;

  if (solarEnabled) {
    return Math.max(totalCost * 0.1, CONST.SOLAR_MIN_BILL);
  }
  
  return totalCost;
}

/**
 * Calcula o OPEX total mensal.
 */
export function calcOpexMonthly(
  month: number, 
  ownFeedEnabled: boolean, 
  solarEnabled: boolean,
  climateControlEnabled: boolean,
  stress?: StressParams
): number {
  const feedCost = calcFeedCostMonthly(ownFeedEnabled, stress);
  const energyCost = calcEnergyCostMonthly(month, solarEnabled, climateControlEnabled, stress);
  const fixedCosts = Object.values(CONST.FIXED_OPEX).reduce((a, b) => a + b, 0);
  
  return feedCost + energyCost + fixedCosts;
}

/**
 * Calcula o faturamento mensal no regime estável.
 */
export function calcRevenue(stress?: StressParams): number {
  const harvestStage = CONST.GROWTH_STAGES[CONST.GROWTH_STAGES.length - 1];
  
  let totalBiomass = harvestStage.biomassKg;
  if (stress?.highMortality) {
    totalBiomass *= 0.8; // Perda de 20% da biomassa final
  }

  let price = CONST.FILLET_PRICE_KG;
  if (stress?.marketCrash) {
    price *= 0.7; // Queda de 30% no preço de venda
  }

  const filletWeight = totalBiomass * CONST.FILLET_YIELD;
  return filletWeight * price;
}

/**
 * Calcula o lucro líquido mensal.
 */
export function calcProfit(
  month: number,
  ownFeedEnabled: boolean,
  solarEnabled: boolean,
  climateControlEnabled: boolean,
  activePhases: boolean[],
  stress?: StressParams
): { lucro: number; opex: number; receita: number; depreciacao: number; impostos: number } {
  const receita = calcRevenue(stress);
  const opex = calcOpexMonthly(month, ownFeedEnabled, solarEnabled, climateControlEnabled, stress);
  const capexTotal = calcCapex(activePhases);
  
  const depreciacao = capexTotal / 60;
  const impostos = receita * 0.04;
  const lucro = receita - opex - depreciacao - impostos;
  
  return { lucro, opex, receita, depreciacao, impostos };
}

/**
 * Calcula o CAPEX total baseado nas fases ativas.
 */
export function calcCapex(activePhases: boolean[]): number {
  let total = CONST.LICENSING_COST;
  CONST.CAPEX_PHASES.forEach((phase, index) => {
    if (activePhases[index] || phase.required) {
      total += phase.cost;
    }
  });
  return total;
}

/**
 * Calcula o payback estimado em meses.
 */
export function calcPayback(
  ownFeedEnabled: boolean,
  solarEnabled: boolean,
  climateControlEnabled: boolean,
  activePhases: boolean[],
  stress?: StressParams
): number {
  let totalAnnualProfit = 0;
  for (let m = 1; m <= 12; m++) {
    totalAnnualProfit += calcProfit(m, ownFeedEnabled, solarEnabled, climateControlEnabled, activePhases, stress).lucro;
  }
  
  const avgMonthlyProfit = totalAnnualProfit / 12;
  const totalInvestment = calcCapex(activePhases) + CONST.WORKING_CAPITAL;
  
  return avgMonthlyProfit > 0 ? totalInvestment / avgMonthlyProfit : Infinity;
}

/**
 * Gera projeção de fluxo de caixa acumulado.
 */
export function calcCashFlowProjection(
  months: number,
  ownFeedEnabled: boolean,
  solarEnabled: boolean,
  climateControlEnabled: boolean,
  activePhases: boolean[],
  stress?: StressParams
) {
  const capexTotal = calcCapex(activePhases);
  const workingCapital = CONST.WORKING_CAPITAL;
  let balance = -(capexTotal + workingCapital);
  const projection = [];

  for (let m = 1; m <= months; m++) {
    const sMonth = ((m - 1) % 12) + 1;
    const profitData = calcProfit(sMonth, ownFeedEnabled, solarEnabled, climateControlEnabled, activePhases, stress);
    
    if (m <= 6) {
      const rampFactor = m / 6;
      const rampOpex = profitData.opex * rampFactor;
      balance -= rampOpex;
    } else {
      balance += profitData.lucro + profitData.depreciacao;
    }

    if (m % 3 === 0 || m === 1 || m === months) {
      projection.push({ name: `Mês ${m}`, value: Math.round(balance / 1000) });
    }
  }
  return projection;
}

export const WORKING_CAPITAL = CONST.WORKING_CAPITAL;
