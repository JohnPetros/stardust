import type { Database } from './Database'
import type { SupabaseUser } from './SupabaseUser'

export type SupabaseTier = Database['public']['Tables']['tiers']['Row']
