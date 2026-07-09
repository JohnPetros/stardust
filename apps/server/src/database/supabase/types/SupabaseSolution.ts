import type { Database } from './Database'

export type SupabaseSolution = Database['public']['Views']['solutions_view']['Row']
export type SupabaseSolutionPayload = Database['public']['Tables']['solutions']['Insert']
