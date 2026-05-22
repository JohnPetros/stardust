import type { Database } from './Database'

export type SupabaseNote = Database['public']['Tables']['notes']['Row']
