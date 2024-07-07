import type { Database } from './Database'

export type SupabaseUser = Database['public']['Views']['users_view']['Row']
