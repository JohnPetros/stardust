import type { Database } from './Database'

export type SupabaseComment = Database['public']['Views']['comments_view']['Row']
