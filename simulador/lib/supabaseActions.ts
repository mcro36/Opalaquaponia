import { supabase, DEFAULT_PROJECT_ID } from './supabase'

// ===== PROJECT =====
export async function loadProject(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) { console.warn('Supabase loadProject error:', error.message); return null }
  return data
}

export async function updateProject(projectId: string, updates: Record<string, unknown>) {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
  if (error) console.warn('Supabase updateProject error:', error.message)
}

// ===== CAPEX =====
export async function loadCapexItems(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('capex_items')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) { console.warn('Supabase loadCapex error:', error.message); return [] }
  return data ?? []
}

export async function upsertCapexItem(projectId: string, item: { id: string; category: string; name: string; cost: number; status: string; priority?: string }) {
  const { error } = await supabase
    .from('capex_items')
    .upsert({
      id: item.id,
      project_id: projectId,
      category: item.category,
      name: item.name,
      cost: item.cost,
      status: item.status,
      priority: item.priority || 'Média',
    })
  if (error) console.warn('Supabase upsertCapex error:', error.message)
}

export async function deleteCapexItem(id: string) {
  const { error } = await supabase.from('capex_items').delete().eq('id', id)
  if (error) console.warn('Supabase deleteCapex error:', error.message)
}

// ===== OPEX =====
export async function loadOpexItems(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('opex_items')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) { console.warn('Supabase loadOpex error:', error.message); return [] }
  return data ?? []
}

export async function upsertOpexItem(projectId: string, item: { id: string; category: string; name: string; monthlyCost: number }) {
  const { error } = await supabase
    .from('opex_items')
    .upsert({
      id: item.id,
      project_id: projectId,
      category: item.category,
      name: item.name,
      monthly_cost: item.monthlyCost,
    })
  if (error) console.warn('Supabase upsertOpex error:', error.message)
}

export async function deleteOpexItem(id: string) {
  const { error } = await supabase.from('opex_items').delete().eq('id', id)
  if (error) console.warn('Supabase deleteOpex error:', error.message)
}

// ===== TANKS & BIOMASS =====
export async function loadTanksWithBiomass(projectId = DEFAULT_PROJECT_ID) {
  const { data: tanks, error } = await supabase
    .from('tanks')
    .select('*, biomass_readings(biomass_kg, reading_date)')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })

  if (error) { console.warn('Supabase loadTanks error:', error.message); return {} }

  const biomassMap: Record<string, number> = {}
  for (const tank of tanks ?? []) {
    const readings = tank.biomass_readings as { biomass_kg: number; reading_date: string }[]
    const latest = readings?.sort((a: { reading_date: string }, b: { reading_date: string }) =>
      b.reading_date.localeCompare(a.reading_date)
    )[0]
    biomassMap[tank.label.toLowerCase()] = latest ? Number(latest.biomass_kg) : 50
  }
  return biomassMap
}

// ===== FULL STATE LOADER =====
export async function loadFullState(projectId = DEFAULT_PROJECT_ID) {
  const [project, capex, opex, biomass] = await Promise.all([
    loadProject(projectId),
    loadCapexItems(projectId),
    loadOpexItems(projectId),
    loadTanksWithBiomass(projectId),
  ])

  if (!project) return null

  return {
    phase: String(project.phase),
    biomass: Object.keys(biomass).length > 0 ? biomass : { t1: 50, t2: 50, t3: 50, t4: 50, t5: 50, t6: 50 },
    capexItems: capex.map((c: any) => ({
      id: String(c.id),
      category: String(c.category),
      name: String(c.name),
      cost: Number(c.cost),
      status: String(c.status || 'Planejado'),
      priority: String(c.priority || 'Média'),
    })),
    opexItems: opex.map((o: any) => ({
      id: String(o.id),
      category: String(o.category),
      name: String(o.name),
      monthlyCost: Number(o.monthly_cost),
    })),
    parameters: {
      scenario: String(project.current_scenario || 'realista'),
      targetDensity: Number(project.target_density_kg_m3),
      fca: Number(project.fca_base),
      pricePerKg: Number(project.price_per_kg),
      mortalityByPhase: [
        { phase: 'transporte', rate: 5 },
        { phase: 'alevinagem', rate: 10 },
        { phase: 'recria', rate: 4 },
        { phase: 'engorda', rate: 2 },
      ],
      climateControlEnabled: Boolean(project.climate_control_enabled),
      ownFeedEnabled: Boolean(project.own_feed_enabled),
      linhagem: String(project.linhagem),
      reversaoSexual: Boolean(project.reversao_sexual),
      targetWeight: Number(project.target_weight_g),
    },
  }
}
