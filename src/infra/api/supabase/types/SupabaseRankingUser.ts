export type SupabaseRankingUser = {
  id: string
  xp: number
  position?: number
  tier_id: string
  user: {
    name: string
    slug: string
    avatar: {
      image: string
      name: string
    } | null
  } | null
}
