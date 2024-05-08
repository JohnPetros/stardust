import type { Database } from './Database'

export type SupabaseSolution = Database['public']['Tables']['solutions']['Row'] & {
  user: { slug: string; avatar_id: string }
  replies: [{ count: number }]
  upvotes: [{ count: number }]
  comments: [{ count: number }]
}
