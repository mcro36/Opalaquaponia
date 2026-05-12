// === INFRAESTRUTURA ===
export const TANK_COUNT = 6;
export const TANK_VOLUME_LITERS = 60_000;
export const TANK_VOLUME_M3 = 60;
export const TOTAL_VOLUME_M3 = 360;
export const CYCLE_MONTHS = 6;

// === BIOMASSA POR ESTÁGIO (cada tanque no regime estável) ===
// Dados baseados no crescimento progressivo em 6 meses
export const GROWTH_STAGES = [
  { month: 1, label: 'Alevinagem',  weightRange: '10-50g',   fishCount: 2900, biomassKg: 87,   feedRate: 0.040, feedType: 'Inicial 45% PB',     feedCostKg: 6.00 },
  { month: 2, label: 'Recria I',    weightRange: '50-150g',  fishCount: 2750, biomassKg: 275,  feedRate: 0.035, feedType: 'Juvenil 36% PB',     feedCostKg: 5.00 },
  { month: 3, label: 'Recria II',   weightRange: '150-300g', fishCount: 2650, biomassKg: 596,  feedRate: 0.028, feedType: 'Crescimento 32% PB', feedCostKg: 4.50 },
  { month: 4, label: 'Engorda I',   weightRange: '300-500g', fishCount: 2600, biomassKg: 1040, feedRate: 0.020, feedType: 'Engorda 28% PB',     feedCostKg: 4.20 },
  { month: 5, label: 'Engorda II',  weightRange: '500-700g', fishCount: 2570, biomassKg: 1542, feedRate: 0.015, feedType: 'Engorda 28% PB',     feedCostKg: 4.20 },
  { month: 6, label: 'Despesca',    weightRange: '700-850g', fishCount: 2550, biomassKg: 1913, feedRate: 0.012, feedType: 'Terminação 28% PB',  feedCostKg: 4.00 },
] as const;

// === CLIMATIZAÇÃO (Perfil BH - INMET) ===
export const BH_CLIMATE = [
  { month: 1,  label: 'Jan', avgTemp: 23.5 },
  { month: 2,  label: 'Fev', avgTemp: 24.0 },
  { month: 3,  label: 'Mar', avgTemp: 23.0 },
  { month: 4,  label: 'Abr', avgTemp: 21.5 },
  { month: 5,  label: 'Mai', avgTemp: 19.0 },
  { month: 6,  label: 'Jun', avgTemp: 18.0 },
  { month: 7,  label: 'Jul', avgTemp: 17.5 },
  { month: 8,  label: 'Ago', avgTemp: 19.5 },
  { month: 9,  label: 'Set', avgTemp: 21.0 },
  { month: 10, label: 'Out', avgTemp: 22.5 },
  { month: 11, label: 'Nov', avgTemp: 22.5 },
  { month: 12, label: 'Dez', avgTemp: 23.0 },
] as const;

export const TARGET_WATER_TEMP = 28; // °C
export const HEAT_LOSS_PER_DEGREE_KW = 1.01; // kW por °C de ΔT (6 tanques com isolamento)
export const HEAT_PUMP_COP = 5.0;
export const CEMIG_TARIFF_KWH = 0.85; // R$/kWh rural MG
export const SOLAR_MIN_BILL = 290; // R$/mês taxa mínima

// === FATURAMENTO ===
export const FILLET_YIELD = 0.33;
export const FILLET_PRICE_KG = 45.0;
export const OWN_FEED_COST_KG = 2.10;
export const OWN_FEED_INITIAL_COST_KG = 3.00;

// === CAPEX POR FASE ===
export const CAPEX_PHASES = [
  { id: 'f1', phase: 1, label: 'Infraestrutura e Aeração',  cost: 85_000, required: true },
  { id: 'f2', phase: 2, label: 'Automação e Segurança',      cost: 47_800, required: true },
  { id: 'f3', phase: 3, label: 'Climatização e Alimentação', cost: 54_100, required: true },
  { id: 'f4', phase: 4, label: 'Fábrica de Ração',           cost: 62_600, required: false },
  { id: 'f5', phase: 5, label: 'Energia Solar (21 kWp)',      cost: 91_200, required: false },
] as const;

export const LICENSING_COST = 9_000;
export const WORKING_CAPITAL = 90_000;

// === OPEX FIXO (sem ração e sem energia) ===
export const FIXED_OPEX = {
  alevinos: 1_160,
  maoDeObra: 3_000,
  manutencao: 800,
  processamento: 1_200,
} as const;

export const BLOWER_MONTHLY_COST = 1_050;
export const AUTOMATION_MONTHLY_COST = 170;
