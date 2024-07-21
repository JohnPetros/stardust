export type SupabaseRankingUser = {
  id: string
  xp: number
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
