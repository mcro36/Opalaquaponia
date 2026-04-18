import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xhgptpjniqdycnmmrxkq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZ3B0cGpuaXFkeWNubW1yeGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDIxMzgsImV4cCI6MjA5MjExODEzOH0.G0USmujzPKX8TsNKLmxRYO44OdWwHuYUqvtzFcV9utU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Default project ID for the Piloto BH seed data
export const DEFAULT_PROJECT_ID = 'b0000000-0000-0000-0000-000000000001'
