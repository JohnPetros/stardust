import type { Database } from './Database'

export type SupabaseRankingWinner = Database['public']['Tables']['winners']['Row'] & {
  avatars: {
    name: string
    image: string
  } | null
}
