import type { Database } from './Database'

export type SupabaseComment =
  Database['public']['Tables']['comments']['Row'] & {
    user: { slug: string; avatar_id: string }
    replies: [{ count: number }]
    upvotes: [{ count: number }]
  }
