import type { Database } from './SupabaseDatabase.ts'

export type SupabaseUser = Database['public']['Tables']['users']
