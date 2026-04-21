import type { Database } from './Database'

export type SupabaseApiKey = Database['public']['Tables']['api_keys']['Row']
