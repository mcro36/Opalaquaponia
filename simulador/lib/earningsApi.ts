import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DRE {
  receita_bruta: number;
  receita_agregados?: number;
  pis_cofins: number;
  receita_liquida: number;
  cpv_racao: number;
  cpv_alevinos: number;
  cpv_processamento: number;
  cpv_agregados?: number;
  lucro_bruto: number;
  sga_energia: number;
  sga_manutencao: number;
  ebitda: number;
  depreciacao: number;
  ebit: number;
  financeiro: number;
  lair: number;
  ir_csll: number;
  lucro_liquido: number;
}

export interface KPIFinancial {
  receita: number;
  ebitda: number;
  lucro_liquido: number;
  capex: number;
  caixa_final: number;
}

export interface KPIOperational {
  tanques: string;
  biomassa: number;
  file_vendido: number;
  fca: number | null;
  mortalidade: number | null;
  preco_medio: number;
  custo_kg: number | null;
}

export interface CapitalStructure {
  divida_bruta: number;
  caixa: number;
  divida_liquida: number;
  alavancagem: string;
}

export interface FCL {
  ebitda: number;
  capex: number;
  ir: number;
  amortizacao: number;
  fcl_antes: number;
  dividendos: number;
  fcl_apos: number;
}

export interface EarningsRelease {
  id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  event_key: string;
  admin_message: string;
  dre: DRE;
  kpi_financial: KPIFinancial;
  kpi_operational: KPIOperational;
  capital_structure: CapitalStructure;
  fcl: FCL;
  yearly_summary?: any;
}

export async function getAllEarningsReleases(): Promise<EarningsRelease[]> {
  const { data, error } = await supabase
    .from('earnings_releases')
    .select('*')
    .order('period_start', { ascending: true });

  if (error) {
    console.error('Error fetching earnings releases:', error);
    return [];
  }

  return data || [];
}

export async function getEarningsRelease(period: string): Promise<EarningsRelease | null> {
  const { data, error } = await supabase
    .from('earnings_releases')
    .select('*')
    .eq('period_label', period)
    .single();

  if (error) {
    console.error(`Error fetching earnings release ${period}:`, error);
    return null;
  }

  return data;
}
