import type { Database } from './Database'

export type SupabaseAchievement =
  Database['public']['Tables']['achievements']['Row']
