export interface MortalityPhase {
  phase: string;
  rate: number;
}

// R1: Biomassa com Sazonalidade
export function getFatorTempMensal(mes: number): number {
  // BH Cwb profile
  const tempAguaSemClima = [27, 27, 26, 24, 21, 19, 18, 20, 22, 25, 26, 27][mes - 1];
  
  if (tempAguaSemClima >= 25) return 1.0; // Ótimo
  if (tempAguaSemClima >= 22) return 0.85; // Bom
  if (tempAguaSemClima >= 19) return 0.50; // Alerta
  return 0.0; // Crítico/Letal
}

export function calcGanhoPesoDia(mes: number, linhagem: string, tempAlvo: number, isClimaOn: boolean): number {
  const ganhoBase = 4.5; // ~4.5g/dia growth potential
  
  // Genetica
  const fatorGenetica = linhagem === 'gift' ? 1.15 : 1.0; // GIFT +15%
  
  // Temp Factor
  let fatorTemp = 1.0;
  if (!isClimaOn) {
    fatorTemp = getFatorTempMensal(mes);
  } else {
    // If tempAlvo is outside 25-30, small penalty
    if (tempAlvo > 30 || tempAlvo < 25) fatorTemp = 0.9;
  }
  
  return ganhoBase * fatorTemp * fatorGenetica;
}

// R11: Curva Dias-Grau
export function calcDiasAteDespesca(pesoAlvo: number, pesoAlevino: number, isClimaOn: boolean, linhagem: string, tempAlvo: number): number {
  let dias = 0;
  let pesoAtual = pesoAlevino;
  let mesAtual = 1; // start in Jan for simulation
  
  // Prevent infinite loop if no growth
  let monthsWithoutGrowth = 0;

  while (pesoAtual < pesoAlvo && dias < 730) {
    const ganhoHj = calcGanhoPesoDia(mesAtual, linhagem, tempAlvo, isClimaOn);
    pesoAtual += ganhoHj;
    dias++;
    
    if (dias % 30 === 0) {
      mesAtual = mesAtual === 12 ? 1 : mesAtual + 1;
    }
    
    if (ganhoHj === 0) {
      monthsWithoutGrowth++;
      if (monthsWithoutGrowth > 90) return 999; // Represents inviability
    } else {
      monthsWithoutGrowth = 0;
    }
  }
  return dias;
}

// R12: FCA Ponderado por estágio (Simplified for global target)
export function calcFCAPonderado(isOwnFeed: boolean, scenario: string, isClimaOn: boolean): number {
  let baseFCA = isOwnFeed ? 1.0 : 1.2;
  
  if (scenario === 'otimista') baseFCA = 1.0;
  if (scenario === 'pessimista') baseFCA = 1.5;
  if (!isClimaOn) baseFCA = 1.8;
  
  return baseFCA;
}

// R15: Mortalidade total encadeada
export function calcAlevinosNecessarios(biomassaAlvoKg: number, targetWeight: number, mortalities: MortalityPhase[]): number {
  const targetFishCount = (biomassaAlvoKg * 1000) / targetWeight;
  
  // Calculate combined survival rate: Π(1 - mortalidade[fase])
  const survivalRate = mortalities.reduce((acc, phase) => {
    return acc * (1 - (phase.rate / 100));
  }, 1);
  
  return Math.ceil(targetFishCount / survivalRate);
}

// R2: Financeiro completo
export function calcLucroLiquidoMensal(receitaBruta: number, opexMensal: number, capexTotal: number): {lucro: number, impostos: number, depreciacao: number} {
  const impostos = receitaBruta * 0.04; // 4% Simples Nacional estimate
  const depreciacao = capexTotal / 60; // 5 years (60 months) straight-line
  
  const lucro = receitaBruta - impostos - opexMensal - depreciacao;
  
  return { lucro, impostos, depreciacao };
}

// R4: Energia sazonal
export function calcCustoEnergiaMensal(mes: number, isClimaOn: boolean): number {
  // Base energy for aeration, etc. is in OPEX. This is just for climate.
  if (!isClimaOn) return 0;
  
  // BH Winter: May, Jun, Jul, Aug
  const isWinter = mes >= 5 && mes <= 8;
  
  // Approx R$ 1000 in peak winter, R$ 200 rest of time to maintain 28C
  return isWinter ? 1000 : 200;
}
