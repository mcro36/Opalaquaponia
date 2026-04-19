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

// ==========================================
// ERP SPRINT 14: PRODUÇÃO & MANEJO
// ==========================================

// --- Batches (Lotes) ---
export async function loadBatches(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('batches')
    .select('*, biometries(*)')
    .eq('project_id', projectId)
    .order('entry_date', { ascending: false })

  if (error) { console.warn('Supabase loadBatches error:', error.message); return [] }
  return data ?? []
}

export async function upsertBatch(projectId: string, batch: Partial<any>) {
  const { error } = await supabase
    .from('batches')
    .upsert({ ...batch, project_id: projectId })
  if (error) console.warn('Supabase upsertBatch error:', error.message)
}

export async function deleteBatch(id: string) {
  const { error } = await supabase.from('batches').delete().eq('id', id)
  if (error) console.warn('Supabase deleteBatch error:', error.message)
}

// --- Biometries (Biometrias) ---
export async function upsertBiometry(biometry: Partial<any>) {
  const { error } = await supabase
    .from('biometries')
    .upsert(biometry)
  if (error) console.warn('Supabase upsertBiometry error:', error.message)
}

export async function deleteBiometry(id: string) {
  const { error } = await supabase.from('biometries').delete().eq('id', id)
  if (error) console.warn('Supabase deleteBiometry error:', error.message)
}

// --- Daily Tasks (Manejo Diário) ---
export async function loadDailyTasks(projectId = DEFAULT_PROJECT_ID, date?: string) {
  let query = supabase
    .from('daily_tasks')
    .select('*')
    .eq('project_id', projectId)
    
  if (date) {
    query = query.eq('task_date', date)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) { console.warn('Supabase loadDailyTasks error:', error.message); return [] }
  return data ?? []
}

export async function upsertDailyTask(projectId: string, task: Partial<any>) {
  const { error } = await supabase
    .from('daily_tasks')
    .upsert({ ...task, project_id: projectId })
  if (error) console.warn('Supabase upsertDailyTask error:', error.message)
}

export async function deleteDailyTask(id: string) {
  const { error } = await supabase.from('daily_tasks').delete().eq('id', id)
  if (error) console.warn('Supabase deleteDailyTask error:', error.message)
}

// ==========================================
// ERP SPRINT 15: FINANCEIRO
// ==========================================

// --- Transactions (Transações) ---
export async function loadTransactions(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('project_id', projectId)
    .order('transaction_date', { ascending: false })

  if (error) { console.warn('Supabase loadTransactions error:', error.message); return [] }
  return data ?? []
}

export async function upsertTransaction(projectId: string, transaction: Partial<any>) {
  const { error } = await supabase
    .from('transactions')
    .upsert({ ...transaction, project_id: projectId })
  if (error) console.warn('Supabase upsertTransaction error:', error.message)
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) console.warn('Supabase deleteTransaction error:', error.message)
}

// ==========================================
// ERP SPRINT 16: COMERCIAL
// ==========================================

export async function loadClients(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('project_id', projectId)
    .order('name', { ascending: true })

  if (error) { console.warn('Supabase loadClients error:', error.message); return [] }
  return data ?? []
}

export async function upsertClient(projectId: string, client: Partial<any>) {
  const { error } = await supabase
    .from('clients')
    .upsert({ ...client, project_id: projectId })
  if (error) console.warn('Supabase upsertClient error:', error.message)
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) console.warn('Supabase deleteClient error:', error.message)
}

export async function loadOrders(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, clients(*), batches(*)')
    .eq('project_id', projectId)
    .order('order_date', { ascending: false })

  if (error) { console.warn('Supabase loadOrders error:', error.message); return [] }
  return data ?? []
}

export async function upsertOrder(projectId: string, order: Partial<any>) {
  const { error } = await supabase
    .from('orders')
    .upsert({ ...order, project_id: projectId })
  if (error) console.warn('Supabase upsertOrder error:', error.message)
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) console.warn('Supabase deleteOrder error:', error.message)
}

// ==========================================
// ERP SPRINT 17: ESTOQUE E INSUMOS
// ==========================================

export async function loadInventoryItems(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('project_id', projectId)
    .order('name', { ascending: true })

  if (error) { console.warn('Supabase loadInventoryItems error:', error.message); return [] }
  return data ?? []
}

export async function upsertInventoryItem(projectId: string, item: Partial<any>) {
  const { error } = await supabase
    .from('inventory_items')
    .upsert({ ...item, project_id: projectId })
  if (error) console.warn('Supabase upsertInventoryItem error:', error.message)
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) console.warn('Supabase deleteInventoryItem error:', error.message)
}

export async function loadInventoryMovements(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('inventory_movements')
    .select('*, inventory_items!inner(project_id, name, unit)')
    .eq('inventory_items.project_id', projectId)
    .order('movement_date', { ascending: false })

  if (error) { console.warn('Supabase loadInventoryMovements error:', error.message); return [] }
  return data ?? []
}

export async function upsertInventoryMovement(movement: Partial<any>) {
  const { error } = await supabase
    .from('inventory_movements')
    .upsert(movement)
  
  if (error) {
    console.warn('Supabase upsertInventoryMovement error:', error.message);
    return;
  }

  // Update current stock
  if (movement.item_id && movement.quantity) {
    const qty = movement.movement_type === 'entrada' ? Number(movement.quantity) : -Number(movement.quantity);
    await supabase.rpc('adjust_stock', { p_item_id: movement.item_id, p_qty: qty });
    // Since we don't have the RPC, we'll do it manually in JS for now
    const { data: item } = await supabase.from('inventory_items').select('current_stock').eq('id', movement.item_id).single();
    if (item) {
      await supabase.from('inventory_items').update({ current_stock: Number(item.current_stock) + qty }).eq('id', movement.item_id);
    }
  }
}

// ==========================================
// ERP SPRINT 18: RH & EQUIPE
// ==========================================

export async function loadEmployees(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('project_id', projectId)
    .order('name', { ascending: true })

  if (error) { console.warn('Supabase loadEmployees error:', error.message); return [] }
  return data ?? []
}

export async function upsertEmployee(projectId: string, employee: Partial<any>) {
  const { error } = await supabase
    .from('employees')
    .upsert({ ...employee, project_id: projectId })
  if (error) console.warn('Supabase upsertEmployee error:', error.message)
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) console.warn('Supabase deleteEmployee error:', error.message)
}

export async function loadTimeEntries(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*, employees!inner(project_id, name, role)')
    .eq('employees.project_id', projectId)
    .order('entry_date', { ascending: false })

  if (error) { console.warn('Supabase loadTimeEntries error:', error.message); return [] }
  return data ?? []
}

export async function upsertTimeEntry(entry: Partial<any>) {
  const { error } = await supabase
    .from('time_entries')
    .upsert(entry)
  if (error) console.warn('Supabase upsertTimeEntry error:', error.message)
}

export async function deleteTimeEntry(id: string) {
  const { error } = await supabase.from('time_entries').delete().eq('id', id)
  if (error) console.warn('Supabase deleteTimeEntry error:', error.message)
}

// ==========================================
// ERP SPRINT 19: METAS & OKRs
// ==========================================

export async function loadGoals(projectId = DEFAULT_PROJECT_ID) {
  const { data, error } = await supabase
    .from('goals')
    .select('*, key_results(*)')
    .eq('project_id', projectId)
    .order('deadline', { ascending: true })

  if (error) { console.warn('Supabase loadGoals error:', error.message); return [] }
  return data ?? []
}

export async function upsertGoal(projectId: string, goal: Partial<any>) {
  const { error } = await supabase
    .from('goals')
    .upsert({ ...goal, project_id: projectId })
  if (error) console.warn('Supabase upsertGoal error:', error.message)
}

export async function deleteGoal(id: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) console.warn('Supabase deleteGoal error:', error.message)
}

export async function upsertKeyResult(kr: Partial<any>) {
  const { error } = await supabase
    .from('key_results')
    .upsert(kr)
  if (error) console.warn('Supabase upsertKeyResult error:', error.message)
}

export async function deleteKeyResult(id: string) {
  const { error } = await supabase.from('key_results').delete().eq('id', id)
  if (error) console.warn('Supabase deleteKeyResult error:', error.message)
}

