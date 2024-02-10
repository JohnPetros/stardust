import type { Database } from './Database'

export type SupabasePlayground =
  Database['public']['Tables']['playgrounds']['Row'] & {
    user?: { slug: string; avatar_id: string }
  }
